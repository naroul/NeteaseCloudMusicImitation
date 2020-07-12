<template>
  <div class="header-wrapper">
    <div class="tabs-wrapper">
      <div class="tabs">
        <router-link to="/" class="logo"></router-link>
        <li
          :class="['tab', { 'tab-active': index === tabIndexActive }]"
          v-for="(tab, index) in this.tabs"
          @click="tabClicked(index)"
        >
          {{ tab }}
          <div
            class="selected-arrow-font"
            v-if="index === tabIndexActive"
          ></div>
        </li>
      </div>
    </div>
    <div class="navs-wrapper">
      <li class="iconfont icon-cry-fill"></li>
    </div>
  </div>
</template>

<script>
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
     * 更改为选中的tab的index
     */
    tabClicked(index) {
      this.tabIndexActive = index;
    },
  },

  created() {
    /**
     * 存储tabs的内容
     */
    this.tabs = ['发现音乐', '我的音乐', '商城'];
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
