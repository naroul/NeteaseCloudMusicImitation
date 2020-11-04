<!-- 排行榜详情页 -->

<template>
  <div class="toplist">
    <div class="toplist-wrapper">
      <!-- 侧边栏 显示所有榜单 -->
      <div class="toplist-sidebar">
        <!-- 云音乐特色榜 数据为列表的前四条 -->
        <div class="sidebar-label">云音乐特色榜</div>
        <router-link
          :class="[
            'sidebar-list-item',
            {
              'item-active': listItem.id === toplistId,
            },
          ]"
          v-for="(listItem, index) of specialList"
          @click="listItemClicked(listItem)"
          :to="{ path: '/music/toplist', query: { id: listItem.id } }"
          :key="listItem.id"
        >
          <img class="item-img" :src="listItem.coverImgUrl" />
          <div class="item-text">
            <span class="item-title">{{ listItem.name }}</span>
            <span class="item-update-freq">{{ listItem.updateFrequency }}</span>
          </div>
        </router-link>

        <!-- 全球媒体榜 数据为列表的前四条之后的所有 -->
        <div class="sidebar-label">全球媒体榜</div>
        <router-link
          :class="[
            'sidebar-list-item',
            {
              'item-active': listItem.id === toplistId,
            },
          ]"
          v-for="(listItem, index) of globalList"
          @click="listItemClicked(listItem)"
          :to="{ path: '/music/toplist', query: { id: listItem.id } }"
          :key="listItem.id"
        >
          <img class="item-img" :src="listItem.coverImgUrl" />
          <div class="item-text">
            <span class="item-name">{{ listItem.name }}</span>
            <span class="item-update-freq">{{ listItem.updateFrequency }}</span>
          </div>
        </router-link>
      </div>

      <!-- 当前榜单详情 -->
      <div class="toplist-content">
        <div class="content-title">
          <!-- 封面描述 -->
          <img class="title-img" :src="toplistDataCur.coverImgUrl" />

          <!-- 文字描述 -->
          <div class="title-label">
            <h2>{{ toplistDataCur.name }}</h2>
            <div class="update-freq">
              <i class="iconfont icon-clock" />
              <span>最近更新：{{ updatedTime }}</span>
            </div>

            <!-- 按钮区 -->
            <div class="btns">
              <!-- 播放按钮 -->
              <MyButton :width="70" :height="30" class="btn-play btn-flex">
                <i class="iconfont icon-play" />
                <span>播放</span>
              </MyButton>

              <!-- 添加到播放列表 -->
              <MyButton
                :width="30"
                :height="30"
                class="btn-add btn-flex btn-space"
              >
                <i class="iconfont icon-add-select" />
              </MyButton>

              <!-- 添加收藏 -->
              <MyButton :height="30" class="btn-collection btn-flex btn-space">
                <i class="iconfont icon-addfile" />
                <span>{{ toplistDataCur.subscribedCount }}</span>
              </MyButton>

              <!-- 评论按钮 -->
              <MyButton :height="30" class="btn-comments btn-flex">
                <i class="iconfont icon-comments" />
                <span>{{ toplistDataCur.commentCount }}</span>
              </MyButton>
            </div>
          </div>
        </div>
        <div class="content-playcount">
          <span class="count-label">歌曲列表</span>
          <span class="count-track">{{ toplistDataCur.trackCount }}首歌</span>
          <span class="count-play">
            <span>播放：</span>
            <span class="count-number">{{ toplistDataCur.playCount }}</span>
            <span>次</span>
          </span>
        </div>

        <!-- 歌曲列表 -->
        <SongList
          v-if="toplistDataCur.tracks"
          :songList="toplistDataCur.tracks"
          :type="'playlist'"
          :width="670"
        />

        <!-- 评论 -->
        <Comment v-if="this.id" :id="this.id" :type="'playlist'" />
      </div>
    </div>
  </div>
</template>

<script>
import { getAllToplist, getToplistCur } from '@/apis/toplist';
import { formatMsToDate } from '^/formatMsToDate';
import MyButton from '@/ui/MyButton';
import SongList from '@/components/SongList';
import Comment from '@/components/Comment';

export default {
  data() {
    return {
      /**
       * 所有榜单数据
       */
      toplistDataAll: [],

      /**
       * 当前页对应歌单id
       */
      id: NaN,

      /**
       * 当前页显示的榜单数据
       */
      toplistDataCur: [],

      /**
       * 改榜单页对应榜单的id
       */
      toplistId: 0,
    };
  },

  computed: {
    /**
     * 音乐特色榜 数据的前四条
     */
    specialList() {
      return (
        this.toplistDataAll &&
        this.toplistDataAll.length &&
        this.toplistDataAll.slice(0, 4)
      );
    },

    /**
     * 全球媒体榜 数据的前四条之后
     */
    globalList() {
      return (
        this.toplistDataAll &&
        this.toplistDataAll.length &&
        this.toplistDataAll.slice(4, this.toplistDataAll.length)
      );
    },

    /**
     * 当前榜单最近更新日期
     */
    updatedTime() {
      return formatMsToDate(this.toplistDataCur.updateTime);
    },
  },

  methods: {
    /**
     * 榜单项点击回调
     */
    listItemClicked(listItem) {
      this.toplistId = listItem.id;
    },

    /**
     * 获取所有榜单信息
     */
    async _getAllToplist() {
      await getAllToplist().then(({ data: { list } }) => {
        this.toplistDataAll = list;
      });
    },

    /**
     * 获取当前榜单信息
     */
    async _getToplistCur(id) {
      await getToplistCur(id).then(({ data: { playlist } }) => {
        this.toplistDataCur = playlist;
      });
    },
  },

  async created() {
    /**
     * 获取所有榜单数据
     */
    await this._getAllToplist();

    /**
     * 从其它页跳转到toplist页时，组件第一次渲染，不会触发beforeRouteUpdate
     * 所以需要在created中处理路由的重定向
     */
    if (!this.$route.query.id) {
      this.$router.push({
        path: '/music/toplist',
        query: { id: this.toplistDataAll[0].id },
      });
    } else {
      /**
       * 如果url中有id，则加载该id的歌单信息
       */
      this._getToplistCur(this.$route.query.id);

      /**
       * 根据路由设置当前对应歌单id
       */
      this.id = Number(this.$route.query.id);
    }
  },

  /**
   * 当路由query参数变化时，由于会复用组件，所以不会调用created钩子
   * 所以路由变化时的处理需要在此钩子中处理
   */
  beforeRouteUpdate(to, from, next) {
    /**
     * 判断路由中是否有query值id，如果没有，或者id在所有榜单数据中都不存在，
     * 则跳转至第一条榜单详情页
     */
    if (
      to.query &&
      to.query.id &&
      this.toplistDataAll.map((item) => item.id).includes(Number(to.query.id))
    ) {
      /**
       * 设置组件数据 id 为url对应榜单数据id
       */
      this.toplistId = Number(to.query.id);

      /**
       * 如果url中有id，则加载该id的歌单信息
       */
      this._getToplistCur(to.query.id);

      /**
       * 根据路由设置当前对应歌单id
       */
      this.id = Number(to.query.id);

      /**
       * 调用next后，守卫才能resolve，等待中的路由才能变化
       */
      next();
    } else {
      next({
        path: '/music/toplist',
        query: { id: this.toplistDataAll[0].id },
      });
    }
  },

  components: {
    MyButton,
    SongList,
    Comment,
  },
};
</script>

<style lang="scss" scoped>
@import '#/scss/global.scss';

.toplist {
  background: $background-grey-white;

  .toplist-wrapper {
    display: flex;
    width: 980px;
    margin: 0 auto;
    border: 1px solid #d3d3d3;
    border-width: 0 1px;

    .toplist-sidebar {
      width: 240px;
      padding-top: 20px;

      .sidebar-label {
        box-sizing: border-box;
        width: 240px;
        padding: 20px 10px 12px 15px;
        font-size: 14px;
        font-weight: bold;
        color: #000;
      }

      .item-active {
        background: #e6e6e6;
      }

      .sidebar-list-item {
        display: flex;
        height: 42px;
        padding: 10px 0 10px 20px;

        &:hover {
          background: #eeecec;
        }

        .item-img {
          width: 40px;
          height: 40px;
        }

        .item-text {
          box-sizing: border-box;
          padding: 2px 0 2px 10px;
          height: 40px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          font-size: 12px;

          .item-name {
            max-width: 170px;
            color: #000;
            cursor: pointer;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .item-update-freq {
            color: #999;
            cursor: pointer;
          }
        }
      }
    }

    .toplist-content {
      width: 740px;
      padding: 40px;
      border-left: 1px solid #d3d3d3;

      .content-title {
        display: flex;

        .title-img {
          padding: 3px;
          width: 150px;
          height: 150px;
          border: 1px solid #ccc;
        }

        .title-label {
          padding: 20px;
          display: flex;
          flex-direction: column;

          h2 {
            margin: 0;
            line-height: 24px;
            font-size: 20px;
            font-weight: bold;
          }

          .update-freq {
            padding: 12px 0;
            display: flex;
            align-items: center;
            font-size: 12px;

            .icon-clock {
              margin-right: 5px;
              font-size: 20px;
            }
          }

          .btns {
            display: flex;
            padding-top: 10px;

            .btn-play {
              font-size: 12px;
              line-height: 30px;
              background: rgba(40, 120, 198, 1);
              color: #fff;
              border-radius: 3px 0 0 3px;
              border-right: 1px solid #ccc;

              &:hover {
                background: #4a93db;
              }

              .icon-play {
                font-size: 20px;
                margin-right: 3px;
              }
            }

            i,
            span {
              color: #fff;
            }

            .btn-add {
              background: rgba(40, 120, 198, 1);
              border-radius: 0 3px 3px 0;

              &:hover {
                background: #4a93db;
              }
            }

            .btn-collection {
              background: #e5e5e5;
              border: 1px solid #ccc;
              font-size: 12px;

              .icon-addfile {
                font-size: 20px;
                margin-right: 3px;
              }

              &:hover {
                background: #f4f4f4;
              }

              i,
              span {
                color: #000;
              }
            }

            .btn-comments {
              background: #e5e5e5;
              border: 1px solid #ccc;
              font-size: 12px;

              .icon-comments {
                font-size: 20px;
                margin-right: 3px;
              }

              &:hover {
                background: #f4f4f4;
              }

              i,
              span {
                color: #000;
              }
            }

            .btn-flex {
              display: flex;
              align-items: center;
            }

            .btn-space {
              margin-right: 8px;
            }
          }
        }
      }

      .content-playcount {
        padding-top: 40px;
        height: 33px;
        line-height: 33px;
        border-bottom: 2px solid #c20c0c;

        .count-label {
          font-size: 20px;
          color: #333;
        }

        .count-track {
          margin-left: 20px;
          font-size: 12px;
          color: #666;
        }

        .count-play {
          float: right;
          font-size: 12px;
          color: #666;

          .count-number {
            font-size: 12px;
            font-weight: bold;
            color: #c20c0c;
          }
        }
      }
    }
  }
}
</style>
