import Vuex from 'vuex/types'
import Vue from 'vue'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    totalTvCount: 10 // The TV inventory
  },

  getters: {
    // Here we will create a getter
  },

  mutations: {
    // Here we will create Jenny
  },

  actions: {
    // Here we will create Larry
  }
});

module.exports = store;