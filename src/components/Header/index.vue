<template>
  <div class="header-wrapper">
    <div class="tabs-wrapper">
      <div class="tabs">
        <router-link to="/" class="logo"></router-link>
        <li
          :class="['tab', { 'tab-active': index === tabIndexActive }]"
          v-for="(tab, index) of this.tabs"
          @click="tabClicked(index, tab.url)"
        >
          {{ tab.title }}
          <div
            class="selected-arrow-font"
            v-if="index === tabIndexActive"
          ></div>
        </li>
        <div class="filler"></div>
        <div class="search-wrapper">
          <SearchBox placeholder="音乐/视频/用户"></SearchBox>
        </div>
        <div
          class="login-wrapper"
          @mouseover.prevent="showOptions"
          @mouseleave.prevent="hiddenOptions"
        >
          <!-- 消息数  -->
          <i v-if="isLogged && !isShowOptions" class="msg-ct top-ct">{{
            msgCount
          }}</i>

          <!-- 已登陆 显示用户图标 -->
          <img v-if="isLogged" :src="userImgUrl" />

          <!-- 未登录 提示登录 -->
          <span class="login-text" @click="openLoginDialog" v-else>登录</span>

          <!-- 已登陆时，用户可操作的选项浮窗 -->
          <div v-if="isLogged && isShowOptions" class="logged-options">
            <div class="top-arrow"></div>
            <router-link
              :to="`/user/info?id=${uuId}`"
              :class="['option', 'first-option']"
            >
              <i class="icn icn-hm"></i>
              我的主页
            </router-link>
            <div class="option">
              <i class="icn icn-msg"></i>
              我的消息
              <!-- 消息数  -->
              <i v-if="isLogged && isShowOptions" class="msg-ct opt-ct">{{
                msgCount
              }}</i>
            </div>
            <div class="option">
              <i class="icn icn-lv"></i>
              我的等级
            </div>
            <div class="option">
              <i class="icn icn-st"></i>
              个人设置
            </div>
            <div class="option" @click="_logout">
              <i class="icn icn-ex"></i>
              退出
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="navs-wrapper" v-if="tabIndexActive === 0 && isShowHeaderNavs">
      <div class="navs">
        <li class="nav" v-for="(nav, index) of this.navs">
          <span
            :class="[
              'nav-text',
              { 'nav-text-active': index === navIndexActive },
            ]"
            @click="navClicked(index, nav.url)"
            >{{ nav.title }}</span
          >
        </li>
      </div>
    </div>
    <div class="split-line" v-else></div>
  </div>
</template>

<script>
import SearchBox from '@/ui/SearchBox';
import { headerMixin, userMixin, loginMixin } from '@/mixins';
import { logout } from '@/apis/header';
import { getPrivateMsg } from '@/apis/message';
import user from '#/images/Header/user.jpg';

export default {
  mixins: [headerMixin, userMixin, loginMixin],

  data() {
    return {
      /**
       * 目前被选中的tab的index
       */
      tabIndexActive: 0,

      /**
       * 目前被选中的nav（推荐、排行榜等）的index
       */
      navIndexActive: NaN,

      /**
       * 悬停在用户标时 显示操作项
       */
      isShowOptions: false,

      /**
       * 用户图标的 base64码
       */
      userImgUrl: user,

      /**
       * 新的私信数
       */
      msgCount: 0,
    };
  },

  methods: {
    /**
     * 更改为选中的tab的index并跳转到对应页面url
     */
    tabClicked(index, url) {
      /**
       * 商城页暂不写，所以直接跳转到官方主页
       */
      if (index === 2) {
        window.open('https://music.163.com/store/product');
      } else {
        this.tabIndexActive = index;
        this.$router.push(url);
      }
    },

    /**
     * 更改为选中的nav的index并跳转到对应页面url
     */
    navClicked(index, url) {
      this.navIndexActive = index;
      this.$router.push(url);
    },

    /**
     * 打开登录框
     */
    openLoginDialog() {
      this.setLoginDialogStatus(true);
    },

    /**
     * 鼠标悬停在用户标时 显示操作项
     */
    showOptions() {
      this.isShowOptions = true;
    },

    /**
     * 鼠标离开用户标时 隐藏操作项
     */
    hiddenOptions() {
      this.isShowOptions = false;
    },

    /**
     * 登出
     */
    _logout() {
      logout()
        .then((res) => {
          /**
           * 重置登录状态
           */
          this.setLoginStatus(false);

          /**
           * 清空用户id
           */
          this.setUuId('');

          this.$router.push('/music/recommend');
        })
        .catch((e) => {
          this.$toast.failed('退出时遇到错误，请重试');
        });
    },

    /**
     * 获取私信数
     */
    _getPrivateMsg() {
      getPrivateMsg().then(({ data }) => {
        this.msgCount = data.newMsgCount > 99 ? '99+' : data.newMsgCount;
      });
    },
  },

  watch: {
    /**
     * 监听route变化，根据变化更新nav
     */
    $route(to, from) {
      this.navs.reduce(
        (prev, cur, index) => {
          if (cur.url === to.path) {
            this.navIndexActive = index;
          }
          return cur;
        },
        { url: '/' }
      );
    },

    /**
     * 监听登陆状态
     */
    isLogged(newStatus, oldStatus) {
      if (newStatus) {
        /**
         * 登录成功同时获取私信数
         */
        this._getPrivateMsg();
      } else {
        /**
         * 退出登录时私信数归零
         */
        this.msgCount = 0;
      }
    },
  },

  created() {
    /**
     * 存储tabs的文本和跳转地址
     */
    this.tabs = [
      { title: '发现音乐', url: '/' },
      { title: '我的音乐', url: '/my-music' },
      { title: '商城', url: '/store' },
    ];

    this.navs = [
      { title: '推荐', url: '/music/recommend' },
      { title: '排行榜', url: '/music/toplist' },
      { title: '歌单', url: '/music/playlist' },
      { title: '歌手', url: '/music/singer' },
    ];

    /**
     * 刷新时，根据url设置active的nav，
     * 由于初始值是NaN，所以当url不是navs中的一个时，则不会设置active
     */
    this.navs.reduce(
      (prev, cur, index) => {
        if (cur.url === this.$route.path) {
          this.navIndexActive = index;
        }
        return cur;
      },
      { url: '/' }
    );

    /**
     * 获取私信数
     */
    if (this.isLogged) {
      /**
       * 加载时已为已登录状态，加载私信数
       */
      this._getPrivateMsg();
    }
  },

  components: {
    SearchBox,
  },
};
</script>

<style lang="scss" scoped>
@import '#/scss/global.scss';

.header-wrapper {
  .tabs-wrapper {
    height: 70px;
    box-sizing: border-box;
    background: $background-black;
    border-bottom: 1px solid #000;

    .tabs {
      display: flex;
      width: 1100px;
      margin: 0 auto;

      .logo {
        display: block;
        width: 176px;
        height: 69px;
        background: url('~@/assets/images/Common/topbar.png');

        background-position: 0 0;
      }

      .tab {
        position: relative;
        padding: 0 19px;
        text-align: center;
        line-height: 70px;
        text-decoration: none;
        color: #fff;
        cursor: pointer;

        &:hover,
        &:active {
          background: #000;
        }

        .selected-arrow-font {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          bottom: 0;
          width: 0px;
          height: 0px;
          border-bottom: 7px solid $background-red;
          border-right: 6px solid transparent;
          border-left: 6px solid transparent;
        }
      }

      .tab-active {
        background: #000;
      }

      .filler {
        flex: 1;
      }

      .search-wrapper {
        align-self: center;
      }

      .login-wrapper {
        position: relative;
        align-self: center;
        margin: auto 23px;
        font-size: 12px;
        color: #787878;

        .logged-options {
          position: absolute;
          top: 40px;
          left: -64px;
          width: 158px;
          border-radius: 4px;
          z-index: 99;

          .top-arrow {
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
            top: -8px;
            border-bottom: 8px solid #000;
            border-right: 8px solid transparent;
            border-left: 8px solid transparent;
          }

          .option {
            position: relative;
            display: flex;
            align-items: center;
            height: 34px;
            padding-left: 24px;
            line-height: 34px;
            text-align: center;
            background: #000;
            color: #ccc;
            cursor: pointer;

            &:hover {
              color: #fff;
              background: #353535;
            }

            .icn {
              float: left;
              width: 18px;
              height: 18px;
              margin-right: 10px;
              background: url('~@/assets/images/Common/toplist.png');
            }

            .icn-hm {
              background-position: 0 -80px;
            }

            .icn-msg {
              background-position: -20px -120px;
            }

            .opt-ct {
              top: 9px;
              left: 110px;
            }

            .icn-lv {
              background-position: 0px -100px;
            }

            .icn-st {
              background-position: 0px -140px;
            }

            .icn-ex {
              background-position: 0px -200px;
            }
          }

          .first-option {
            border-radius: 4px 4px 0 0;
          }
        }

        .login-text {
          cursor: pointer;

          &:hover {
            color: #999;
          }
        }

        img {
          border-radius: 30px;
        }

        .msg-ct {
          position: absolute;
          display: inline-block;
          min-width: 17px;
          height: 17px;
          padding: 0 4px;
          box-sizing: border-box;
          background: #c20c0c;
          border-radius: 18px;
          border: 1px solid #242424;
          line-height: 16px;
          font-size: 12px;
          white-space: nowrap;
          color: #fff;
          text-align: center;
          font-style: normal;
          font-family: Arial, Helvetica, sans-serif;
        }

        .top-ct {
          top: -5px;
          left: 20px;
        }
      }
    }
  }

  .navs-wrapper {
    height: 35px;
    box-sizing: border-box;
    background: $background-red;
    border-bottom: 1px solid $border-red;

    .navs {
      display: flex;
      box-sizing: border-box;
      width: 1100px;
      height: 34px;
      margin: 0 auto;
      padding-left: 95px;

      .nav {
        width: 90px;
        padding: 0 10px;
        align-self: center;
        box-sizing: border-box;
        text-align: center;
        text-decoration: none;

        .nav-text {
          display: inline-block;
          height: 20px;
          line-height: 20px;
          padding: 0 13px 2px 13px;
          font-size: 12px;
          color: #fff;
          cursor: pointer;

          &:hover,
          &:active {
            border-radius: 20px;
            background: #9b0909;
          }
        }

        .nav-text-active {
          border-radius: 20px;
          background: #9b0909;
        }
      }
    }
  }

  .split-line {
    height: 5px;
    box-sizing: border-box;
    background: $background-red;
    border-bottom: 1px solid $border-red;
  }
}
</style>
