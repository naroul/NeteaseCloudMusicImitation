import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '@/pages/Home';
import NotFound from '@/pages/NotFound';

/**
 * 使用模块化机制编程，需要要调用 Vue.use(VueRouter) 路由才能起作用
 */
Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    redirect: '/home',
  },
  {
    path: '/home',
    component: Home,
    alias: '/ho',
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
