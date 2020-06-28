import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '@/components/Home';

/**
 * 使用模块化机制编程，需要要调用 Vue.use(VueRouter) 路由才能起作用
 */
Vue.use(VueRouter);

const routes = [
  {
    path: '/home',
    component: Home,
  },
];

const router = new VueRouter({
  routes,
});

export default router;
