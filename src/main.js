import Vue from "vue";
import App from "./App.vue";
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// 富文本样式
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme
// 导入字体图标
import './assets/fonts/iconfont.css'
// 导入全局样式表
import './assets/css/global.css'
// 导入treetable
import treeTable from 'vue-table-with-tree-grid'

// 注册全局组件
Vue.component('tree-table', treeTable)
import router from "./router";
import store from "./store";

// 导入自己封装的插件对象
import axiosPlugs from '@/utils/request.js'

Vue.use(ElementUI);
Vue.use(axiosPlugs)
Vue.use(VueQuillEditor)
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");