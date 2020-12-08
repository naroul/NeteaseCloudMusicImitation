<template>
  <div class="msk">
    <img
      :src="LoadingImg"
      :style="{ width: `${width}px`, height: `${height}px` }"
    />
  </div>
</template>

<script>
import Loading from "@/assets/images/Common/loading.gif";

export default {
  props: {
    width: {
      type: Number,
      required: false,
      default: 30,
    },

    height: {
      type: Number,
      required: false,
      default: 30,
    },
  },

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
.msk {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: rgba(204, 204, 204, 0.2);

  img {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    margin: auto;
  }
}
</style>