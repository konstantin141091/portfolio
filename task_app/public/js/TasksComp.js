Vue.component('vue_tasks', {
  data(){
    return {
      tasks: [],
      showTasks: true,
      showEditForm: false,
      showAddForm: false,
      oneTask: {
        completed: true,
        _id: '',
        title: '',
        user: '',
      },
      userTask: '',
      selected: '',
    }
  },
  methods: {
    doAddTaskForm() {
      this.showTasks = !this.showTasks;
      this.showAddForm = !this.showAddForm;
      this.userTask = '';
      this.selected = 'Невыполнена';
    },
    doEditForm(item) {
      this.showTasks = !this.showTasks;
      this.showEditForm = !this.showEditForm;
      this.userTask = item.title;
      this.oneTask = {...this.oneTask, ...item};
    },
    doCompleted(item) {
      this.$root.patchJson(`/tasks/${item._id}`)
        .then((response) => {
          if (response.status !== 200) {
            return null;
          }
          return response.json();
        })
        .then((response) => {
          let task = this.tasks.find(task => {
            if (task._id === item._id) {
              task.completed = !task.completed;
            }
          });
        })
    },
    removeTask(item) {
      this.$root.deleteJson(`/tasks/${item._id}`)
        .then((response) => {
          if (response.status !== 204) {
            return null;
          }
          return response;
        })
        .then((response) => {
          this.tasks.splice(this.tasks.indexOf(item), 1)
        })
    },
    editTask() {
      this.oneTask.title = this.userTask;
      let sel;
      if (this.selected === 'Невыполнена') {
        sel = false;
      } else {
        sel = true;
      }
      this.oneTask.completed = sel;
      this.$root.putJson(`/tasks/${this.oneTask._id}`, this.oneTask)
        .then((response) => {
          if (response.status !==200) {
            return null;
          }
          return response.json();
        }).then((response) => {
        let task = this.tasks.find(task => {
          if (task._id === this.oneTask._id) {
            task.completed = this.oneTask.completed;
            task.title = this.oneTask.title;
          }
        });
        this.showTasks = !this.showTasks;
        this.showEditForm = !this.showEditForm;
      })
    },
    addTask() {
      delete this.oneTask._id;
      this.oneTask.title = this.userTask;
      if (this.selected === 'Невыполнена') {
        this.oneTask.completed = false;
      } else {
        this.oneTask.completed = true;
      }
      // this.$root.postJsonWhitToken('/tasks', this.oneTask)
      //   .then((response) => {
      //     if (response.status === 400) {
      //       console.log('ошибка авториризации');
      //       return null;
      //     } else if (response.status === 201) {
      //       return response.json();
      //     } else {
      //       localStorage.removeItem('token');
      //       localStorage.removeItem('user_id');
      //       window.location = '/auth';
      //       return null;
      //     }
      //   }).then(
      //   (data) => {
      //     this.tasks.push(data);
      //     this.showTasks = !this.showTasks;
      //     this.showAddForm = !this.showAddForm;
      //   }
      // );
      const token = this.$root.token;
      const socket = io.connect(`http://localhost:3000?token=${token}`);
      this.oneTask.user = localStorage.getItem('user_id');
      socket.emit('create', this.oneTask);
    }
  },
  mounted(){
    const token = this.$root.token;
    if(!token) {
      window.location = '/auth';
    }
    const user_id = localStorage.getItem('user_id');
    const socket = io.connect(`http://localhost:3000?token=${token}`);
    socket.on(`created:${user_id}`, (task) => {

      if (task !== null) {
        if (task.message) {
                localStorage.removeItem('token');
                localStorage.removeItem('user_id');
                window.location = '/auth';
                return null;
        }
        this.tasks.push(task);
        this.showTasks = true;
        this.showAddForm = false;
      }
    });



    this.$root.getJsonWhitToken('/tasks')
      .then((response) => {
        if (response.status !== 200) {
          localStorage.removeItem('token');
          localStorage.removeItem('user_id');
          window.location = '/auth';
          return null;
        }
        return response.json();
      })
      .then((data) => {
        for(let task of data) {
          this.tasks.push(task);
        }
      })
  },

  template: `
            <div class="content">
                <h1>Ваши задачи</h1>
                <div class="edit_form" v-show="showEditForm">
                    <div class="form-group">
                       <label for="formGroupExampleInput">Текст задачи</label>
                       <input type="text" class="form-control" v-model="userTask">
                    </div>
                    <div class="form-group">
                        <label for="disabledSelect">Статус</label>
                        <select id="disabledSelect" class="form-control" v-model="selected">
                            <option>Невыполнена</option>
                            <option>Выполнена</option>
                        </select>
                    </div>
                    <button class="btn btn-primary" @click="editTask">Редактировать задачу</button>
                </div>
                
                <div class="content__task__add" v-show="showAddForm">
                    <div class="add">
                        <div class="form-group">
                            <label for="formGroupExampleInput">Текст задачи</label>
                            <input type="text" class="form-control" id="formGroupExampleInput" 
                            placeholder="Что нужно сделать?" v-model="userTask">
                        </div>
                        <div class="form-group">
                            <label for="disabledSelect">Статус</label>
                            <select id="disabledSelect" v-model="selected" class="form-control">
                                <option>Невыполнена</option>
                                <option>Выполнена</option>
                            </select>
                        </div>
                        <button type="submit" class="btn btn-primary" @click="addTask">Создать задачу</button>
                    </div>
                </div>
                
                
                <div class="content__tasks" v-show="showTasks">
                    <vue_task_item v-for="item of tasks"
                               :key="item._id"
                               :task-item="item"
                               @doCompleted="doCompleted"
                               @removeTask="removeTask"
                               @doEditForm="doEditForm">
                    </vue_task_item>
                </div>
            </div>
            `
});

Vue.component('vue_task_item', {
  props: ['taskItem'],
  data(){
    return {

    }
  },
  methods: {

  },
  template: `
            <div class="card text-center" style="width: 18rem;">
                <div class="card-body">
                   <h5 v-if="taskItem.completed" class="card-title">Задача выполнена</h5>
                   <h5 v-else class="card-title">Задача невыполнена</h5>
                    <p class="card-text">{{taskItem.title}}</p>
                        <button v-if="taskItem.completed" class="btn btn-primary mb-2 completed" 
                        @click="$emit('doCompleted', taskItem)">Отметить как невыполненую</button>
                        <button v-else class="btn btn-primary mb-2 completed" 
                        @click="$emit('doCompleted', taskItem)">Отметить как выполненую</button>
                        <button class="btn btn-primary mb-2" @click="$emit('doEditForm', taskItem)">Редактировать</button>
                    <button class="btn btn-primary mb-2 remove" @click="$emit('removeTask', taskItem)">Удалить</button>
                </div>
            </div>
            `
});

