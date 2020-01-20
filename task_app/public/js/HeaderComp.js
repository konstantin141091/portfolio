Vue.component('vue_header', {
  data(){
    return {
      url: window.location.pathname,
      tasksAdd: false,
      taskComp: '',
    }
  },
  methods: {
    doForm() {
      this.taskComp.doAddTaskForm();
    },
    doLogout() {
      localStorage.removeItem('token');
      window.location = '/auth';
    }

  },
  mounted() {
    if (this.url === '/tasks_main') {
      this.tasksAdd = true;
    }
    this.taskComp = this.$root.$refs.tasks;
  },

  template: `
            <nav class="navbar navbar-expand-lg navbar-light bg-light">
                <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarTogglerDemo01" aria-controls="navbarTogglerDemo01" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarTogglerDemo01">
                    <a class="navbar-brand" href="/">Главная</a>
                    <ul class="navbar-nav mr-auto mt-2 mt-lg-0">
                        <li class="nav-item active">
                            <a class="nav-link" href="/tasks_main">Просмотр моих задач <span class="sr-only"></span></a>
                        </li>
                        <li class="nav-item">
                            <a href="#" class="nav-link" @click="doForm" v-show="tasksAdd">
                            Добавить новую задачу</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link add__task" href="/register">Зарегестрироваться</a>
                        </li>
                    </ul>
                    <a href="/auth" class="btn btn-outline-success my-2 my-sm-0" type="submit">Войти</a>
                    <a href="#" class="btn btn-outline-success my-2 my-sm-0" type="submit" @click="doLogout">Выйти</a>
                </div>
            </nav>
            `
});
