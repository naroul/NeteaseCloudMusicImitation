<template>
  <div class="l-wr">
    <img :src="LoadingImg" />
  </div>
</template>

<script>
import Loading from './assets/loading.gif';

export default {
  data() {
    return {
      /**
       * 加载中 图片url
       */
      LoadingImg: Loading,
    };
  },
};
</script>

<style lang="scss" scoped>
.l-wr {
  font-size: 0px;
  text-align: center;
  padding: 10px 0;
}
</style>
