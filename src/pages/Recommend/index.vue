<template>
  <div class="recommend">
    <!-- 轮播图 -->
    <Banner :banners="banners" v-if="banners.length" />

    <div class="recommend-content">
      <!-- 推荐歌单 -->
      <div class="grid">
        <div class="grid-title">
          <div class="title-font-circle"></div>
          <div class="title-text">热门推荐</div>
          <div class="title-tags">
            <router-link
              :class="[
                'tag',
                {
                  'split-right': index !== tags.length - 1,
                },
              ]"
              to="/"
              v-for="(tag, index) of tags"
              :key="tag.id"
            >
              {{ tag.name }}
            </router-link>
          </div>
        </div>
        <div class="grid-content">
          <PlaylistSummary
            class="summary"
            v-if="playlistData.length"
            v-for="data of playlistData"
            :data="data"
            :key="data.id"
          />
        </div>
      </div>

      <!-- 榜单 -->
      <div class="grid">
        <div class="grid-title">
          <div class="title-font-circle"></div>
          <div class="title-text">榜单</div>
        </div>
        <div class="grid-content">
          <RanklistSummary
            :class="['summary', 'rank-summary']"
            v-if="ranklistData.length"
            v-for="data of ranklistData"
            :data="data"
            :key="data.id"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getBanners,
  getPlaylistHot,
  getPersonalized,
  getToplistSummary,
} from '@/apis/recommend';
import { getPlaylistDetail } from '@/apis/playlist';
import Banner from '@/components/Banner';
import PlaylistSummary from '@/components/PlaylistSummary';
import RanklistSummary from '@/components/RanklistSummary';

export default {
  data() {
    return {
      /**
       * 轮播图数据
       */
      banners: [],

      /**
       * 推荐的分类标签
       */
      tags: [],

      /**
       * 推荐的歌单数据
       */
      playlistData: [],

      /**
       * 推荐的榜单摘要数据
       */
      ranklistData: [],
    };
  },

  methods: {
    /**
     * 获取轮播图数据
     */
    _getBanners() {
      getBanners().then((res) => {
        this.banners = res.data.banners;
      });
    },

    /**
     * 获取热门歌单tag
     */
    _getPlaylistHot() {
      getPlaylistHot().then(({ data: { tags } }) => {
        this.tags = tags.length > 5 ? tags.slice(0, 4) : tags;
      });
    },

    /**
     * 获取推荐歌单数据
     */
    _getPersonalized() {
      getPersonalized().then(({ data: { result } }) => {
        this.playlistData = result;
      });
    },

    /**
     * 获取推荐榜单数据
     */
    async _getToplistSummary() {
      /**
       * 拿到三个推荐榜单的id 和name
       */
      const toplistSum = await getToplistSummary().then(
        ({ data: { list } }) => {
          if (list && list.length > 3) {
            return list.slice(0, 3);
          }
        }
      );

      for (let toplistItem of toplistSum) {
        const {
          data: {
            playlist: { tracks },
          },
        } = await getPlaylistDetail(toplistItem.id);

        /**
         * 包装数据
         * 榜单数据最多10条
         */
        if (tracks && tracks.length > 10) {
          this.ranklistData = [
            ...this.ranklistData,
            {
              name: toplistItem.name,
              id: toplistItem.id,
              coverImgUrl: toplistItem.coverImgUrl,
              toplist: tracks.slice(0, 10),
            },
          ];
        } else {
          this.ranklistData = [
            ...this.ranklistData,
            {
              name: toplistItem.name,
              id: toplistItem.id,
              coverImgUrl: toplistItem.coverImgUrl,
              toplist: tracks,
            },
          ];
        }
      }
    },
  },

  created() {
    this._getBanners();
    this._getPlaylistHot();
    this._getPersonalized();
    this._getToplistSummary();
  },

  components: {
    Banner,
    PlaylistSummary,
    RanklistSummary,
  },
};
</script>

<style lang="scss" scoped>
@import '#/scss/global.scss';

.recommend {
  background: $background-grey-white;

  .recommend-content {
    box-sizing: border-box;
    width: 730px;
    margin: 0 auto;
    padding: 20px 20px 40px;
    border: 1px solid #ccc;

    .grid {
      .grid-title {
        height: 33px;
        display: flex;
        flex: 0;
        flex-wrap: nowrap;
        align-items: center;
        border-bottom: 2px solid #c10d0c;

        .title-font-circle {
          margin: 0 10px;
          box-sizing: border-box;
          width: 15px;
          height: 15px;
          border: 4px solid #c10d0c;
          border-radius: 10px;
          background: #fff;
        }

        .title-text {
          font-size: 20px;
          font-weight: normal;
        }

        .title-tags {
          margin-left: 20px;

          .tag {
            padding: 0 10px;
            font-size: 12px;
            color: #666;
          }

          .split-right {
            border-right: 1px solid #ccc;
          }
        }
      }

      .grid-content {
        padding-top: 20px;
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;

        .summary {
          margin-bottom: 30px;
        }

        .rank-summary {
          flex: 1;
        }
      }
    }
  }
}
</style>
