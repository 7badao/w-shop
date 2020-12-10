import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    userInfo: JSON.parse(window.sessionStorage.getItem('userInfo')) || {}
  },
  mutations: {
    // 改变state的数据
    setUserInfo(state, userInfo) {
      state.userInfo = userInfo
      // 将数据存到本地
      window.sessionStorage.setItem('userInfo', JSON.stringify(state.userInfo))
    }
  },
  actions: {},
  modules: {}
});