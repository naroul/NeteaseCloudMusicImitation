<template>
  <div id="music-home">
    <router-view></router-view>
  </div>
</template>

<script>
import { headerMixin } from '@/mixins';

export default {
  mixins: [headerMixin],

  /**
   * 加载前设置header显示navs
   */
  beforeMount() {
    this.setIsShowHeaderNavs(true);
  },
};
</script>

<style></style>
