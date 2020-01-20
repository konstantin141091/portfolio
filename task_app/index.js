const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const path = require('path');
const http = require('http');
const socketIO = require('socket.io');
const config = require('./config.json');//конфиг с настройками в mongodb

// здесь подключаю конфиг с настройками подключения к mongodb
mongoose.connect(config.mogodbConfig, {useNewUrlParser: true, useUnifiedTopology: true});

const Task = require('./modeles/task');
const User = require('./modeles/user');

const app = express();
const server = http.Server(app);
const io = socketIO(server);


io.use((socket, next) => {
  const token = socket.handshake.query.token;
  jwt.verify(token, 'super secret key', (err) => {
    if (err) {
      return next(new Error('authentication error'));
    }
    next();
  });
  return next(new Error('authentication error'));
});

io.on('connection', (socket) => {
  console.log('has connected!');

  socket.on('create', async (data) => {
    console.log(1234234);
    const task = new Task(data);
    const savedTask = await task.save()
      .then((savedTask) => {
        socket.broadcast.emit(`created:${savedTask.user}`, savedTask);
        socket.emit(`created:${savedTask.user}:`, savedTask);
      })
      .catch(() => {
        socket.broadcast.emit(`created:${savedTask.user}`, { message: 'Validation error' });
        socket.emit(`created:${savedTask.user}:`, { message: 'Validation error' });
      });
  });

  socket.on('disconnect', () => {
    console.log('has disconnected!');
  });
});

app.use(express.json());
app.use(cors());
app.use(express.json());
app.use(cors());
app.use('/', express.static('public'));

const checkAuthentication = (req, res, next) => {
  // Authorization: Bearer <token>
  if (req.headers.authorization) {
    const [type, token] = req.headers.authorization.split(' ');
    jwt.verify(token, 'super secret key', (err, decoded) => {
      if (err) {
        return res.status(403).send();
      }
      req.user = decoded;
      next();
    });
  } else {
    res.status(403).send();
  }
};
app.use('/tasks', checkAuthentication);// запросы к tasks только для авторизированых пользователей
// (сюда передавть в заголовок токен)

//страница задач
app.get('/tasks_main', async (req, res) => {
  res.sendFile(path.resolve(__dirname, 'public/template', 'tasks.html'))
});
// получить список всех задач
app.get('/tasks', async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const tasks = await Task.find({ user: req.user._id }).skip((page - 1) * limit).limit(limit);
  res.status(200).json(tasks);
});
//отметить выполнение
app.patch('/tasks/:id', async (req, res) => {
  const task = await Task.findById(req.params.id);
  task.completed = !task.completed;
  const updateTask = await Task.updateOne({_id: req.params.id}, {$set: {completed: task.completed}});
  res.status(200).json(updateTask);

});
//редактирование
app.put('/tasks/:id', async (req, res) => {
  const task = await Task.updateOne({ _id: req.params.id }, { $set: req.body });
  res.status(200).json(task);
});
//удаление
app.delete('/tasks/:id', async (req, res) => {
  await Task.findOneAndDelete({_id: req.params.id});
  res.status(204).json('ok');
});
//добавление задач
app.post('/tasks', async (req, res) => {
  const task = new Task({ ...req.body, user: req.user._id });
  task.save()
    .then((savedTask) => {
      res.status(201).json(savedTask);
    })
    .catch(() => {
      res.status(400).json({ message: 'Validation error' });
    });
});
//регистрация
app.get('/register', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'public/template', 'register.html'))
});
app.post('/register', async (req, res) => {
  const { repassword, ...restBody } = req.body;
  const user = new User(restBody);
  await user.save();
  res.status(201).send();
});
// аунтефикация
app.get('/auth', (req, res)=> {
  res.sendFile(
    path.resolve(__dirname, 'public/template', 'auth.html'),
  );
});

app.post('/auth', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ email: username });
  if (!user) {
    return res.status(401).send();
  }
  if (!user.validatePassword(password)) {
    return res.status(401).send();
  }
  const plainUser = JSON.parse(JSON.stringify(user));
  delete plainUser.password;

  res.status(200).json({
    ...plainUser,
    token: jwt.sign(plainUser, 'super secret key'),
  });
});
// какой порт слушаем
server.listen(3000, () => {
  console.log('Server has been started!');
});