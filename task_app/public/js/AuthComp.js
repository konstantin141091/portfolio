Vue.component('vue_auth', {
  data(){
    return {

    }
  },
  methods: {
    doAuth() {
      const data = {
        username: document.getElementById('username').value,
        password: document.getElementById('password').value,
      };

      localStorage.removeItem('token');
      localStorage.removeItem('user_id');
      this.$root.postJson('/auth', data)
        .then((response) => {
          if (response.status !== 200) {
            const forms = document.querySelectorAll('.form-control');
            forms.forEach(el => {
              el.classList.add('auth__error')
            });
            return { token: null }
          }
          return response.json();
        })
        .then((user) => {
          if(user.token) {
            localStorage.setItem('user_id', user._id);
            localStorage.setItem('token', user.token);
            window.location = '/tasks_main';
          }
        })
    }
  },



  template: `
            <div class="content">
                <h1>Вход в аккаунт</h1>
                <div class="form__register">
                    <div class="form-group">
                        <label for="exampleInputEmail1">Ваша почта</label>
                        <input id="username" type="email" class="form-control" name="email" placeholder="vasya@mail.ru">
                        <small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone else.</small>
                    </div>
                    <div class="form-group">
                        <label for="exampleInputPassword1">Пароль</label>
                        <input id="password" type="password" class="form-control" name="password">
                    </div>
                    <button id="send" type="submit" class="btn btn-primary" @click="doAuth()">Войти</button>
                </div>
            </div>
            `
});
