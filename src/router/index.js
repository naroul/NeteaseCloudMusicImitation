import Vue from 'vue';
import VueRouter from 'vue-router';

/**
 * 使用模块化机制编程，需要要调用 Vue.use(VueRouter) 路由才能起作用
 */
Vue.use(VueRouter);

/**
 * 推荐页
 */
const Header = (resolve) => {
  import('@/components/Header').then((module) => {
    resolve(module);
  });
};

/**
 * 推荐页
 */
const Home = (resolve) => {
  import('@/pages/Home').then((module) => {
    resolve(module);
  });
};

/**
 * 推荐页
 */
const Recommend = (resolve) => {
  import('@/pages/Recommend').then((module) => {
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
    // redirect: '/home',
    component: Header,
  },
  {
    path: '/home',
    component: Home,
    children: [
      {
        path: 'recommend',
        component: Recommend,
      },
    ],
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
