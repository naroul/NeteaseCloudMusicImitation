<template>
  <div class="bd">
    <div class="n-pglg">
      <img :src="myMusicPic" />
      <h2>此页面尚未开放，敬请期待!</h2>
    </div>
  </div>
</template>

<script>
import mymusic from "#/images/Common/mymusic.png";

export default {
  data() {
    return {
      myMusicPic: mymusic,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "#/scss/global.scss";

.bd {
  @include bd;

  .n-pglg {
    width: 807px;
    margin: 0 auto 0;
    padding-top: 104px;
    display: flex;

    img {
      width: 400px;
      height: 300px;
    }

    h2 {
      padding-top: 144px;
      padding-left: 20px;
      font-size: 28px;
      font-weight: 500;
    }
  }
}
</style>