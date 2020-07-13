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
        <div class="login-wrapper">
          <i v-if="isLogged" class="iconfont icon-usercenter" />
          <span class="login-text" v-else>登录</span>
        </div>
      </div>
    </div>
    <div class="navs-wrapper" v-if="tabIndexActive === 0">
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
import { mapGetters, mapMutations } from 'vuex';
import SearchBox from '@/ui/SearchBox';
import { getLoginStatus } from '@/apis/header';

export default {
  data() {
    return {
      /**
       * 目前被选中的tab的index
       */
      tabIndexActive: 0,

      /**
       * 目前被选中的nav（推荐、排行榜等）的index
       */
      navIndexActive: 0,
    };
  },

  computed: {
    ...mapGetters(['isLogged']),
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
     * 获取登录状态并保存到state中
     */
    async _getLoginStatus() {
      getLoginStatus()
        .then((res) => this.setLoginStatus(true))
        .catch((e) => this.setLoginStatus(false));
    },

    ...mapMutations(['setLoginStatus']),
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
      { title: '推荐', url: '/recommend' },
      { title: '排行榜', url: '/toplist' },
      { title: '歌单', url: '/home/playlist' },
      { title: '歌手', url: '/home/singer' },
    ];

    this._getLoginStatus();
  },

  components: {
    SearchBox,
  },
};
</script>

<style lang="scss" scoped>
@import '#/scss/global.scss';

.header-wrapper {
  height: 105px;

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
        margin-right: 20px;
        width: 70px;
        height: 70px;
        background: url('~@/assets/images/Header/logo.jpg');
        background-size: 70px 70px;
      }

      .tab {
        position: relative;
        padding: 0 19px;
        text-align: center;
        line-height: 70px;
        text-decoration: none;
        color: #fff;

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
        align-self: center;
        margin: auto 23px;
        font-size: 12px;
        color: #787878;

        .login-text {
          cursor: pointer;

          &:hover {
            color: #999;
          }
        }

        .icon-usercenter {
          font-size: 35px;
          color: #a3a3a3;
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
