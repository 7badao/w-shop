import Vue from "vue"
import App from "./App.vue"
import ElementUI from 'element-ui'
import VueQuillEditor from 'vue-quill-editor'
import ZkTable from 'vue-table-with-tree-grid'

import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme

import 'element-ui/lib/theme-chalk/index.css';
// 导入字体图标
import './assets/fonts/iconfont.css'
// 导入全局样式表
import '../src/assets/css/global.css'
import router from "./router"
import store from "./store"

// 导入自己封装的插件对象
import axiosPlugs from '@/utils/request.js'
// 注册全局可用组件
Vue.component('tree-table', ZkTable)

Vue.use(ElementUI);
Vue.use(axiosPlugs)
Vue.use(VueQuillEditor)
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app")