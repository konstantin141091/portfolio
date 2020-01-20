Vue.component('vue_register', {
  data(){
    return {
      userData: {
        email: '',
        firstName: '',
        lastName: '',
        password: '',
        repassword: '',
      },
      mesErr: '',
      formErr: false,
      formRegister: true,
    }
  },
  methods: {
    doValidation() {
      // первичная валидация
      for (let key in this.userData) {
        // console.log(this.userData[key].length);
        if (this.userData[key].length < 1) {
          this.mesErr = 'Указаны не все данные';
          this.formErr = true;
          this.userData.password = '';
          this.userData.repassword = '';
          return null;
        }
        this.formTrue = false;
      }
      //проверка email
      const reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
      if(reg.test(this.userData.email) == false) {
        this.mesErr = 'Некорректный email';
        this.formErr = true;
        return null;
      } else {
        this.formErr = false;
      }

      //проверка пароля
      if (this.userData.password !== this.userData.repassword) {
        this.mesErr = 'Пароли не совпадают';
        this.formErr = true;
        this.userData.password = '';
        this.userData.repassword = '';
        return null;
      } else {
        this.formErr = false;
      }

      this.doRegister();
    },
    doRegister() {
      this.$root.postJson('/register', this.userData)
        .then((response) => {
          if (response.status != 201) {
            this.mesErr = 'Ошибка регистрации';
            this.formErr = true;
            return null;
          }
          this.formRegister = false;
        })
    }
  },
  mounted() {
  },

  template: `
            <div class="content">
                <h1 v-show="formRegister">Регистрация пользователя</h1>
                <h1 v-show="!formRegister">Реристрация прошла успешно</h1>
                <h1 v-show="!formRegister">Авторизуйтесь в приложение</h1>
             
                <div class="form__register" v-show="formRegister">
                    <div class="form-group">
                        <label for="exampleInputEmail1">Ваша почта</label>
                        <input type="email" class="form-control" placeholder="vasya@mail.ru" v-model="userData.email">
                        <small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone else.</small>
                    </div>
                    <div class="form-group">
                        <label for="exampleInputEmail1">Ваше Имя</label>
                        <input type="text" class="form-control" placeholder="Имя" v-model="userData.firstName">
                    </div>
                    <div class="form-group">
                        <label for="exampleInputEmail1">Ваша Фамилия</label>
                        <input type="text" class="form-control" placeholder="Фамилия" v-model="userData.lastName">
                    </div>
                    <div class="form-group">
                        <label for="exampleInputPassword1">Пароль</label>
                        <input type="password" class="form-control" v-model="userData.password">
                    </div>
                    <div class="form-group">
                        <label for="exampleInputPassword1">Повторите пароль</label>
                        <input type="password" class="form-control" v-model="userData.repassword">
                    </div>
                    <p v-show="formErr">{{ mesErr }}</p>
                    <button class="btn btn-primary" @click="doValidation">Загерестрироваться</button>
<!--                    <input type="submit" class="btn btn-primary" value="Загерестрироваться" @click="doValidation(event)">-->
                </div>
            </div>
            `
});
