<!-- 歌曲清单组件 -->

<template>
  <div class="song-list" :style="{ width: `${width}px` }">
    <!-- 歌单表头 参数说明 -->
    <div v-if="type === 'playlist'" class="song-list-title">
      <div class="title-content list-rank"></div>
      <div class="title-content list-cover">标题</div>
      <div class="title-content list-duration">时长</div>
      <div class="title-content list-singer">歌手</div>
    </div>
    <div
      v-for="(item, index) of songList"
      :key="item.id"
      :class="[
        'song-list-item',
        {
          'bak-grey': index % 2 === 1,
          'top-three': index < 3 && type === 'playlist',
        },
      ]"
      @mouseover="showOperators(index)"
      @mouseleave="hideOperators"
    >
      <div class="item-rank item-normal">{{ index + 1 }}</div>
      <div class="item-cover item-normal">
        <img :src="item.al.picUrl" v-if="index < 3 && type === 'playlist'" />

        <!-- 播放按钮 -->
        <i class="iconfont icon-play" @click="playSong(item)" />
        <div class="item-name" :title="item.name">{{ item.name }}</div>
      </div>
      <div class="item-duration item-normal">
        <div v-if="indexHover === index">
          <!-- 添加到播放列表 -->
          <i class="iconfont icon-add-select" @click="addSong(item)"></i>

          <!-- 收藏歌曲 -->
          <i class="iconfont icon-addfile"></i>
        </div>
        <span v-else>{{ _formatMsToDuration(item.dt) }}</span>
      </div>
      <div class="item-singer item-normal">{{ item.ar[0].name }}</div>
    </div>
  </div>
</template>

<script>
import { playerMixin } from "@/mixins";
import { formatMsToDuration } from "^/formatMsToDuration";

export default {
  mixins: [playerMixin],

  props: {
    /**
     * 歌曲清单的类型  歌单的歌曲清单 或者 歌手的歌曲清单
     */
    type: {
      validator(value) {
        return ["playlist", "singer"].includes(value);
      },
      required: true,
      default: "playlist",
    },

    /**
     * 歌曲列表数据
     */
    songList: {
      type: Array,
      required: true,
    },

    /**
     * 整个清单宽度
     */
    width: {
      type: [Number, String],
      required: false,
    },
  },

  data() {
    return {
      /**
       * 鼠标悬浮的列表项index
       */
      indexHover: NaN,
    };
  },

  methods: {
    /**
     * 将歌曲添加到播放列表的底部并播放
     */
    playSong(song) {
      this.addPlySong(song);

      /**
       * 设置播放状态为true
       */
      this.setPlayStatus(true);

      /**
       * 收起音量条
       */
      this.setVolConfigStatus(false);
    },

    /**
     * 将毫秒转换成分秒
     */
    _formatMsToDuration(ms) {
      return formatMsToDuration(ms);
    },

    /**
     * 设置鼠标悬浮的歌曲项  显示操作按钮
     */
    showOperators(index) {
      this.indexHover = index;
    },

    /**
     * 隐藏操作按钮
     */
    hideOperators() {
      this.indexHover = NaN;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "#/scss/global.scss";

.song-list {
  border: 1px solid #ccc;

  .song-list-title {
    display: flex;

    .title-content {
      padding: 8px 10px;
      height: 18px;
      line-height: 18px;
      border: 1px solid #ccc;
      border-bottom: 2px solid #ccc;
      color: #666;
      font-size: 12px;
    }

    .list-rank {
      border-left: 0;
      width: 50px;
      color: #999;
    }

    .list-cover {
      flex: 1;
    }

    .list-duration {
      width: 90px;
    }

    .list-singer {
      width: 170px;
      border-right: 0;
    }

    .list-normal {
      height: 30px;
    }
  }

  .song-list-item {
    height: 30px;
    display: flex;
    background: #f5f5f5;
    font-size: 12px;

    .item-normal {
      padding: 6px 10px;
      height: 18px;
      line-height: 18px;
    }

    .item-rank {
      width: 50px;
      text-align: center;
      color: #999;
    }

    .item-cover {
      flex: 1;
      display: flex;
      align-items: center;

      .item-name {
        max-width: 150px;
        @include word-hide;
      }

      img {
        width: 50px;
        height: 50px;
        margin-right: 14px;
      }

      .iconfont {
        font-size: 18px;
        margin-right: 10px;

        &:hover {
          color: #8b8b8b;
        }
      }
    }

    .item-duration {
      width: 90px;

      .iconfont {
        font-size: 18px;
      }
    }

    .item-singer {
      width: 170px;
    }
  }

  .bak-grey {
    background: #e6e6e6;
  }

  .top-three {
    height: 67px;

    .item-normal {
      padding: 6px 10px;
      height: 55px;
      line-height: 55px;
    }
  }
}
</style>
