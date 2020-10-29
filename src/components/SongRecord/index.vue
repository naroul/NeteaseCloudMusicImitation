<template>
  <!-- 用户听歌排行 单个歌曲列表项 -->
  <div :class="['s-record', { even: (index + 1) % 2 === 0 }]">
    <!-- 排序和播放按钮 -->
    <div class="hd">
      <span class="ply">&nbsp;</span>
      <span class="num">{{ index + 1 }}.</span>
    </div>

    <!-- 歌曲信息 -->
    <div class="song">
      <span class="txt">
        <router-link to="#">
          <b :title="songData.song.name">{{ songData.song.name }}</b>
        </router-link>

        <span class="ar s-fc">
          <em>-</em>
          <span :title="songData.song.ar[0].name">
            <router-link to="#" class="s-fc">{{
              songData.song.ar[0].name
            }}</router-link>
          </span>
        </span>
      </span>

      <!-- 操作项 -->
      <div class="opt">
        <span class="icn-add" title="添加到播放列表"></span>
        <span class="icn icn-fav" title="收藏"></span>
        <span class="icn icn-share" title="分享"></span>
        <span class="icn icn-dl" title="下载"></span>
      </div>
    </div>

    <!-- 比例条 -->
    <div class="tops">
      <span class="bg" :style="{ width: `${songData.score}%` }"></span>
      <span class="times" v-if="isShowTimes">{{ songData.playCount }}次</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    /**
     * 该列表项在列表中的索引
     */
    index: {
      type: Number,
      required: true,
    },

    /**
     * 歌曲数据
     */
    songData: {
      type: Object,
      required: true,
    },

    /**
     * 是否显示播放次数
     */
    isShowTimes: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
};
</script>

<style lang="scss" scoped>
.s-record {
  height: 38px;
  line-height: 38px;
  overflow: hidden;

  &:hover,
  &:active {
    background: #e6e6e6;

    .song {
      .txt {
        max-width: 80%;
      }

      .opt {
        display: block;
      }
    }
  }

  .hd {
    float: left;
    width: 72px;
    height: 38px;
    overflow: hidden;

    .ply {
      float: right;
      margin-top: 10px;
      width: 17px;
      height: 17px;
      cursor: pointer;
      background: url("~@/assets/images/Common/table.png");
      background-position: 0 -103px;

      &:hover {
        background-position: 0 -128px;
      }
    }

    .num {
      float: left;
      padding-left: 5px;
      padding-right: 8px;
      width: 37px;
      text-align: right;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-size: 16px;
      color: #666;
    }
  }

  .song {
    float: left;
    position: relative;
    padding-left: 10px;
    width: 480px;
    height: 38px;
    z-index: 1;
    zoom: 1;
    font-size: 12px;
    overflow: hidden;

    .txt {
      position: relative;
      display: inline-block;
      max-width: 99%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;

      b {
        font-weight: bold;
      }

      a {
        text-decoration: none;
        color: #333;
      }

      .ar {
        em {
          margin: 0 5px;
        }
      }

      .s-fc {
        color: #aeaeae;
      }
    }

    .opt {
      position: absolute;
      z-index: 1;
      right: 0;
      top: 11px;
      display: none;
      width: 92px;
      height: 20px;
      overflow: hidden;

      .icn-add {
        float: left;
        margin-top: 2px;
        width: 13px;
        height: 13px;
        background: url("~@/assets/images/Common/icon.png");
        background-position: 0 -700px;
        overflow: hidden;
        vertical-align: middle;

        &:hover {
          background-position: -22px -700px;
        }
      }

      .icn {
        float: left;
        width: 18px;
        height: 16px;
        margin: 2px 0 0 8px;
        overflow: hidden;
        text-indent: -999px;
        background: url("~@/assets/images/Common/table.png");
        cursor: pointer;
      }

      .icn-fav {
        background-position: 0 -174px;

        &:hover {
          background-position: -20px -174px;
        }
      }

      .icn-share {
        background-position: 0 -195px;

        &:hover {
          background-position: -20px -195px;
        }
      }

      .icn-dl {
        background-position: -80px -174px;

        &:hover {
          background-position: -103px -174px;
        }
      }
    }
  }

  .tops {
    float: right;
    position: relative;
    z-index: 1;
    zoom: 1;
    width: 319px;
    height: 38px;
    line-height: 38px;

    .bg {
      position: absolute;
      z-index: 1;
      height: 38px;
      background-color: #4eb4f5;
      opacity: 0.1;
    }

    .times {
      position: absolute;
      left: 10px;
      z-index: 1;
      height: 38px;
      line-height: 38px;
      font-size: 12px;
      color: #666;
    }
  }
}

.even {
  background-color: #f7f7f7;
}
</style>