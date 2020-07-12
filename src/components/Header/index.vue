<template>
  <div class="header-wrapper">
    <div class="tabs-wrapper">
      <div class="tabs">
        <router-link to="/" class="logo"></router-link>
        <li
          :class="['tab', { 'tab-active': index === tabIndexActive }]"
          v-for="(tab, index) in this.tabs"
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
          <span class="login-text">登录</span>
        </div>
      </div>
    </div>
    <div class="navs-wrapper"></div>
  </div>
</template>

<script>
import SearchBox from '@/ui/SearchBox';

export default {
  data() {
    return {
      /**
       * 目前被选中的tab的index
       */
      tabIndexActive: 0,
    };
  },

  methods: {
    /**
     * 更改为选中的tab的index并跳转到对应页面url
     */
    tabClicked(index, url) {
      this.tabIndexActive = index;
      this.$router.push(url);
    },
  },

  created() {
    /**
     * 存储tabs的文本和跳转地址
     */
    this.tabs = [
      { title: '发现音乐', url: '/' },
      { title: '我的音乐', url: '/my-music' },
      { title: '商城', url: '/shop' },
    ];
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
      }
    }
  }

  .navs-wrapper {
    height: 35px;
    box-sizing: border-box;
    background: $background-red;
    border-bottom: 1px solid $border-red;
  }
}
</style>
