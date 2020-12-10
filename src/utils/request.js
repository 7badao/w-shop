import axios from 'axios'
const instance = axios.create({
  baseURL: 'http://127.0.0.1:8888/api/private/v1/'
})
// 请求拦截器
instance.interceptors.request.use(function (config) {
  let userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
  // 判断token是否存在
  if (userInfo) {
    // 取出本地的token
    config.headers.Authorization = userInfo
  }
  // 请求成功返回
  return config;
}, function (error) {
  // 请求失败返回
  return Promise.reject(error);
});

// 响应拦截器
instance.interceptors.response.use(function (response) {
  // console.log(response.data, '请求拦截');
  // 响应返回
  return response;
}, function (error) {
  //失败返回
  return Promise.reject(error);
});

// 创建一个插件对象
const Myplugs = {}
// 添加一个 Install 方法
// Vue：构造器
Myplugs.install = function (Vue) {
  // 添加逻辑
  // 将 axios 实例挂载到 Vue 的元素中
  Vue.prototype.$http = instance
}

// 暴露插件对象
export default Myplugs