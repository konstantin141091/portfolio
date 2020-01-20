// import { store } from "../store/index";
// import {store} from "./store/store"

const app = new Vue({
  el: '#app',
  data: {
    token: localStorage.getItem('token'),
    user: {},
  },
  methods: {
    setUser(user) {
      console.log(user);
      this.user = user;
    },
    getJson(url){
      return fetch(url)
        .catch(error => {
          console.log(error);
        })
    },
    getJsonWhitToken(url) {
      return fetch(url, {
        headers: {
          'Authorization': `Bearer ${this.token}`
        }
      }).catch(error => {
        console.log(error);
      })
    },
    postJsonWhitToken(url, data) {
      return fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      }).catch(error => {
          console.log(error);
        });
    },
    postJson(url, data) {
      return fetch(url, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      }).catch(error => {
        console.log(error);
      });
    },
    patchJson(url) {
      return fetch(url, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${this.token}`
        },
      }).catch(error => {
        console.log(error);
      });
    },
    deleteJson(url) {
      return fetch(url, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${this.token}`
        },
      }).catch(error => {
        console.log(error);
      });
    },
    putJson(url, data) {
      return fetch(url, {
        method: 'PUT',
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${this.token}`
        },
        body: JSON.stringify(data)
      }).catch(error => {
        console.log(error);
      });
    },
  },
  mounted() {
    console.log(this);
  }
});

