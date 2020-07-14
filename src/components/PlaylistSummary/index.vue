<template>
  <div class="playlist-summary-wrapper">
    <div class="cover">
      <img :src="data.picUrl" />
      <div class="cover-bottom-bar">
        <i class="iconfont icon-service"></i>
        <span class="play-count">{{ playCount }}</span>
        <i class="iconfont icon-play"></i>
      </div>
    </div>
    <p class="name">
      <router-link to="/">{{ data.name }}</router-link>
    </p>
  </div>
</template>

<script>
import { formatPlayCount } from '^/formatPlayCount';

export default {
  props: {
    /**
     * 推荐歌单的数据
     */
    data: {
      type: Object,
      required: true,
      default: {},
    },
  },

  computed: {
    /**
     * 歌单的播放数
     */
    playCount() {
      return formatPlayCount(this.data.playCount);
    },
  },
};
</script>

<style lang="scss" scoped>
.playlist-summary-wrapper {
  display: inline-block;
  vertical-align: top;
  box-sizing: border-box;
  width: 140px;
  height: 200px;

  .cover {
    position: relative;
    width: 140px;
    height: 140px;
    font-size: 0;

    img {
      width: 140px;
      height: 140px;
    }

    .cover-bottom-bar {
      position: absolute;
      bottom: 0;
      padding: 5px 10px;
      box-sizing: border-box;
      width: 100%;
      height: 27px;
      display: flex;
      align-items: center;
      background: rgba(51, 51, 51, 0.6);

      .play-count {
        flex: 1;
        padding-left: 3px;
        height: 17px;
        line-height: 17px;
        text-align: left;
        color: rgba(255, 255, 255, 0.6);
        font-size: 12px;
      }

      .iconfont {
        color: rgba(255, 255, 255, 0.6);
      }

      .icon-play {
        font-size: 20px;
      }
    }
  }

  .name {
    margin: 8px 0 3px;
    line-height: 1.4;
    font-size: 14px;
  }
}
</style>
