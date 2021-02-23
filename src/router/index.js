import Vue from "vue";
import VueRouter from "vue-router";
// 导入 js 文件
import NProgress from 'nprogress'
// 导入 css 文件
import 'nprogress/nprogress.css'
Vue.use(VueRouter);

const routes = [{
    path: '/',
    redirect: '/login'
  },
  {
    path: "/login",
    name: "Login",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import("../views/login")
  },
  {
    path: "/home",
    name: "Home",
    component: () => import("../views/home"),
    redirect: '/welcome',
    children: [{
        path: '/home',
        component: () => import("../views/welcome")
      },
      {
        path: "/users",
        name: "Users",
        component: () => import("../views/users"),
      },
      {
        path: "/rights",
        name: "Rights",
        component: () => import("../views/power/rights"),
      },
      {
        path: "/roles",
        name: "Roles",
        component: () => import("../views/power/roles"),
      },
      {
        path: "/goods",
        name: "Goods",
        component: () => import("../views/goods/list"),
      },
      {
        path: "/categories",
        name: "Categories",
        component: () => import("../views/goods/cate"),
      },
      {
        path: "/goods/add",
        name: "GoodsAdd",
        component: () => import("../views/goods/add"),
      }
    ]
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

// 使用全局前置路由守卫判断用户是否登录
// to从那个路由开始的  from要跳转的目标路由 next 是否执行后续
router.beforeEach((to, from, next) => {
  // 开启进度条
  NProgress.start()
  // 排除登录页面   不在登录页面就要判断用户是否登录
  if (to.path !== '/login') {
    // 取出本地的数据
    let userInfo = sessionStorage.getItem('userInfo')
    // 判断是否登录
    if (!userInfo) {
      // 没登录 返回登录页面
      router.push('/login')
    } else {
      // 登录了执行后续
      next()
    }
  } else {
    // 再登录页面执行后续
    next()
  }

  // 如果再登录页面只有next
  // if (to.path === '/login') return next()

  // // 如果不在登录页 取出本地数据判断
  // let userInfo = sessionStorage.getItem('userInfo')
  // // 不存在跳转会登录
  // if (!userInfo) return next('/login')
  // // 执行后续代码
  // next()
})

// 全局后置钩子 to from 
router.afterEach(() => {
  // 关闭进度条
  NProgress.done()
})

export default router;