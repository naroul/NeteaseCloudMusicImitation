import Vue from 'vue';
import VueRouter from 'vue-router';

/**
 * 使用模块化机制编程，需要要调用 Vue.use(VueRouter) 路由才能起作用
 */
Vue.use(VueRouter);

/**
 * 解决重复点击跳转相同url时会报错的问题
 */
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err);
};

// 这里实现组件懒加载是使用了异步组件的方式  与路由懒加载的实现方式并不相同

/**
 * 主页
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
 * 排行榜页
 */
const Toplist = (resolve) => {
  import('@/pages/Toplist').then((module) => {
    resolve(module);
  });
};

/**
 * 歌单页
 */
const Playlist = (resolve) => {
  import('@/pages/Playlist').then((module) => {
    resolve(module);
  });
};

/**
 * 用户主页
 */
const UserHome = (resolve) => {
  import('@/pages/User/Home').then((module) => {
    resolve(module);
  });
};

/**
 * 用户信息页
 */
const UserInfo = (resolve) => {
  import('@/pages/User/Info').then((module) => {
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
    redirect: '/home/recommend',
  },
  {
    path: '/home',
    component: Home,
    children: [
      {
        path: 'recommend',
        component: Recommend,
      },
      {
        path: 'toplist',
        component: Toplist,
      },
      {
        path: 'playlist',
        component: Playlist,
      },
    ],
  },
  {
    path: '/user',
    component: UserHome,
    children: [
      {
        path: 'info',
        component: UserInfo,
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
