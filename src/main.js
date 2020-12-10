import Vue from "vue";
import App from "./App.vue";
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
// 导入字体图标
import './assets/fonts/iconfont.css'
// 导入全局样式表
import '../src/assets/css/global.css'
import router from "./router";
import store from "./store";

// 导入自己封装的插件对象
import axiosPlugs from '@/utils/request.js'

Vue.use(ElementUI);
Vue.use(axiosPlugs)
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");