<template>
  <div class="ranklist-summary-wrapper">
    <div class="title">
      <router-link :to="`/music/toplist?id=${data.id}`">
        <img :src="data.coverImgUrl" />
      </router-link>
      <div class="title-text-wrapper">
        <router-link :to="`/music/toplist?id=${data.id}`">
          <div class="text">{{ data.name }}</div>
        </router-link>
        <div class="fonts">
          <i class="iconfont icon-play" @click="play" title="播放" />
          <i class="iconfont icon-add" @click="addSongs" title="添加到列表" />
        </div>
      </div>
    </div>
    <div class="top-list">
      <div
        :class="[
          'top-list-item',
          {
            'odd-order': index % 2 === 0,
          },
        ]"
        v-for="(item, index) of data.toplist"
        :key="item.id"
      >
        <div
          :class="[
            'item-order',
            {
              'top-order': index < 3,
            },
          ]"
        >
          {{ index + 1 }}
        </div>
        <router-link class="text-wrap" :to="`/music/song?id=${item.id}`">
          <div class="item-name">{{ item.name }}</div>
        </router-link>
      </div>
      <div class="look-all">
        <router-link :to="`/music/toplist?id=${data.id}`">
          查看全部>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { playerMixin } from "@/mixins";

export default {
  mixins: [playerMixin],

  props: {
    /**
     * 推荐的榜单的数据
     */
    data: {
      type: Object,
      required: true,
      default: {},
    },
  },

  methods: {
    /**
     * 将当前播放列表清空，并用歌单歌曲替代 并设置播放状态为 true
     */
    play() {
      /**
       * 播放歌单
       */
      this.plyPlaylist(this.data.id);

      /**
       * 设置播放状态为true
       */
      this.setPlayStatus(true);
      this.setVolConfigStatus(false);
    },

    /**
     * 将歌单所有歌曲添加到播放列表底部
     */
    addSongs() {
      this.addSongList(this.data.toplist);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "#/scss/global.scss";

.ranklist-summary-wrapper {
  box-sizing: border-box;
  width: 230px;
  border: 1px solid $border-grey-white;

  .title {
    box-sizing: border-box;
    height: 120px;
    padding: 20px 0 0 19px;
    display: flex;
    align-items: top;

    img {
      width: 80px;
      height: 80px;
    }

    .title-text-wrapper {
      margin: 6px 0 0 10px;

      .text {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: 14px;
        color: #333;
        font-weight: bold;
        cursor: pointer;
      }

      .fonts {
        margin-top: 10px;

        .iconfont {
          position: relative;
          font-size: 30px;
          left: -3px;
          color: #828282;

          &:hover,
          &:active {
            color: #333;
          }
        }

        .icon-add {
          left: -10px;
        }
      }
    }
  }

  .top-list {
    .top-list-item {
      display: flex;
      height: 32px;
      padding: 0 20px;

      .item-order {
        width: 35px;
        height: 32px;
        line-height: 32px;
        text-align: center;
        font-size: 16px;
        color: #666;
      }

      .top-order {
        color: #c10d0c;
      }

      a {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .item-name {
        height: 32px;
        line-height: 32px;
        font-size: 12px;
        color: #505050;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        cursor: pointer;

        &:hover {
          text-decoration: underline;
        }
      }
    }

    .odd-order {
      background: $white-color-opacity;
    }

    .look-all {
      height: 32px;
      padding-right: 10px;
      font-size: 12px;
      background: $white-color-opacity;
      text-align: right;
      line-height: 32px;

      a {
        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
}
</style>
