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
 * 总主页面
 */
const Home = (resolve) => {
  import('@/pages/Home').then((module) => {
    resolve(module);
  });
};

/**
 * 音乐板块主页
 */
const MusicHome = (resolve) => {
  import('@/pages/Music/Home').then((module) => {
    resolve(module);
  });
};

/**
 * 推荐页
 */
const Recommend = (resolve) => {
  import('@/pages/Music/Recommend').then((module) => {
    resolve(module);
  });
};

/**
 * 排行榜页
 */
const Toplist = (resolve) => {
  import('@/pages/Music/Toplist').then((module) => {
    resolve(module);
  });
};

/**
 * 歌单页
 */
const Playlist = (resolve) => {
  import('@/pages/Music/Playlist').then((module) => {
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
 * 用户动态页
 */
const Event = (resolve) => {
  import('@/pages/User/Event').then((module) => {
    resolve(module);
  });
};

/**
 * 用户关注页
 */
const Follow = (resolve) => {
  import('@/pages/User/Follow').then((module) => {
    resolve(module);
  })
}

/**
 * 用户粉丝页
 */
const Followed = (resolve) => {
  import('@/pages/User/Followed').then((module) => {
    resolve(module);
  })
}

/**
 * 用户等级页
 */
const Level = (resolve) => {
  import("@/pages/User/Level").then((module) => {
    resolve(module);
  })
}

/**
 * 个人设置页
 */
const Update = (resolve) => {
  import("@/pages/User/Update").then((module) => {
    resolve(module);
  })
}

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
    component: Home,
    redirect: '/music/recommend',
    children: [
      /**
       * 音乐板块路由
       */
      {
        path: 'music',
        component: MusicHome,
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

      /**
       * 用户板块路由
       */
      {
        path: '/user',
        component: UserHome,
        children: [
          {
            path: 'info',
            component: UserInfo,
          },
          {
            path: 'event',
            component: Event,
          },
          {
            path: 'follow',
            component: Follow,
          },
          {
            path: 'followed',
            component: Followed,
          },
          {
            path: 'level',
            component: Level,
          },
          {
            path: 'update',
            component: Update,
          }
        ],
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
