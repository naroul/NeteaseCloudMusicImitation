import Vue from 'vue';
import VueRouter from 'vue-router';

/**
 * 使用模块化机制编程，需要要调用 Vue.use(VueRouter) 路由才能起作用
 */
Vue.use(VueRouter);

/**
 * 主页 推荐页
 */
const Recommend = (resolve) => {
  import('@/pages/Recommend').then((module) => {
    resolve(module);
  });
};

/**
 * 登录页
 */
const Login = (resolve) => {
  import('@/pages/Login').then((module) => {
    resolve(module);
  });
};

/**
 * 404
 */
const NotFound = (resolve) => {
  import('@/pages/NotFound').then((module) => {
    resolve(module);
  });
};

const routes = [
  {
    path: '/',
    redirect: '/recommend',
  },
  {
    path: '/recommend',
    component: Recommend,
    /**
     * 别名
     */
    // alias: '/recom',
  },
  {
    path: '/login',
    component: Login,
  },
  {
    /**
     * 未定义的路由导向404页面
     */
    path: '*',
    component: NotFound,
  },
];

const router = new VueRouter({
  mode: 'history',
  routes,
});

export default router;
