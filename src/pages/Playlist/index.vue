<template>
  <div class="playlist">
    <div class="playlist-wrapper">
      <!-- 标题区域 -->
      <div class="label">
        <span class="label-text">{{ catCur }}</span>

        <!-- 选择下拉框 -->
        <div class="selector">
          <MyButton class="cat-select" :onclick="controlSelector">
            <span>选择分类</span>
            <i class="iconfont icon-arrow-down" />
          </MyButton>

          <!-- 下拉框 -->
          <div class="select-content" v-if="catSubs && isShowSelector">
            <div class="arrorw-top"></div>
            <div class="all-style">
              <MyButton :onclick="allClicked" class="btn-all">
                <span>全部风格</span>
              </MyButton>
            </div>
            <div class="cat" v-for="cat of Object.entries(catSubs)">
              <div class="cat-title">
                <i :class="['iconfont', icons[cat[0]]]" />
                <span>{{ cat[0] }}</span>
              </div>
              <div class="cat-subs">
                <span class="sub" v-for="sub of cat[1]" @click="subClicked(sub)">{{ sub }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 最多36个歌单的展示 -->
      <div class="playlist-content">
        <div class="playlist-item" v-if="playList.length" v-for="data of playList">
          <PlaylistSummary :data="data" :isShowAuthor="true" :isElip="true" :key="data.id" />
        </div>
      </div>

      <Pagination :pgSize="pgSize" :isPgReset="isPgReset" @pgChange="onPgChange" />
    </div>
  </div>
</template>

<script>
import {
  getPlaylistCat,
  getHotPlaylistCat,
  getTopPlaylist,
} from "@/apis/playlist";
import { includes } from "lodash";
import MyButton from "@/ui/MyButton";
import PlaylistSummary from "@/components/PlaylistSummary";
import Pagination from "@/components/Pagination";

export default {
  data() {
    return {
      /**
       * 所有歌单分类标签和子标签
       */
      catSubs: null,

      /**
       * 显示的歌单数据
       */
      playList: [],

      /**
       * 当前页所选的标签
       */
      catCur: "全部",

      /**
       * 是否显示下拉框
       */
      isShowSelector: false,

      /**
       * 目前所在页
       */
      pgCur: 1,

      /**
       * 当前标签拥有歌单页数
       */
      pgSize: NaN,

      /**
       * 是否重置页码
       */
      isPgReset: false,
    };
  },

  watch: {
    /**
     * 监听当前标签 变化时重新请求数据
     */
    async catCur(newCat, oldCat) {
      await this._getTopPlaylist({
        limit: 36,
        cat: newCat,
      }).then(({ data: { playlists, total } }) => {
        this.playList = playlists;

        /**
         * 当设置为true时，会更新页码(触发分页组件中的 watch)
         */
        this.isPgReset = true;
        const pgSize = parseInt(total / 36);
        this.pgSize = total % 36 === 0 ? pgSize : pgSize + 1;
      });

      /**
       * 更新页码后，置为false，以便下一次触发watch
       */
      this.isPgReset = false;
    },

    /**
     * 监听当前页数 变化时请求对应页数据
     */
    pgCur(newPg, oldPg) {
      this._getTopPlaylist({
        limit: 36,
        offset: (newPg - 1) * 36,
        cat: this.catCur,
      }).then(({ data: { playlists, total } }) => {
        this.playList = playlists;
        const pgSize = parseInt(total / 36);
        this.pgSize = total % 36 === 0 ? pgSize : pgSize + 1;
      });
    },
  },

  methods: {
    /**
     * 控制下拉框
     */
    controlSelector() {
      this.isShowSelector = !this.isShowSelector;
    },

    /**
     * 全部风格 点击回调
     */
    allClicked() {
      this.$router.push({
        path: "/home/playlist",
      });

      this.isShowSelector = false;
    },

    /**
     * 子标签点击 回调
     */
    subClicked(sub) {
      this.$router.push({
        path: "/home/playlist",
        query: {
          cat: sub,
        },
      });

      this.isShowSelector = false;
    },

    /**
     * 页数改变 回调
     */
    onPgChange(newPg) {
      this.pgCur = newPg;
      this.isShowSelector = false;
    },

    /**
     * 获取歌单分类
     */
    _getPlaylistCat() {
      return getPlaylistCat();
    },

    /**
     * 获取热门歌单分类
     */
    _getHotPlaylistCat() {
      return getHotPlaylistCat();
    },

    /**
     * 获取精品歌单分类
     */
    _getTopPlaylist({ cat, limit, offset, before }) {
      return getTopPlaylist({ cat, limit, offset, before });
    },

    async _initData() {
      /**
       * 获取所有标签
       */
      await this._getPlaylistCat().then(({ data: { categories, sub } }) => {
        let cats = {};
        for (let cat of Object.values(categories)) {
          cats[cat] = [];
        }
        sub.forEach((cat) => {
          cats[categories[cat.category]] = [
            ...cats[categories[cat.category]],
            cat.name,
          ];
        });
        this.catSubs = cats;
      });

      /**
       * 按照标签获取精选歌单 默认标签为全部
       */
      const allCats = [...Object.values(this.catSubs).flat()];

      /**
       * 如果路由中存在标签，则设置 catCur
       */
      if (this.$route.query.cat && includes(allCats, this.$route.query.cat)) {
        this.catCur = this.$route.query.cat;
      } else {
        this.catCur = "全部";
      }

      this._getTopPlaylist({
        limit: 36,
        cat: this.catCur,
      }).then(({ data: { playlists, total } }) => {
        this.playList = playlists;
        const pgSize = parseInt(total / 36);
        this.pgSize = total % 36 === 0 ? pgSize : pgSize + 1;
      });
    },
  },

  created() {
    this._initData();

    this.icons = {
      语种: "icon-Exportservices",
      情感: "icon-smile",
      场景: "icon-nightmode",
      风格: "icon-component",
      主题: "icon-customization",
    };
  },

  beforeRouteUpdate(to, from, next) {
    /**
     * 按照标签获取精选歌单 默认标签为全部
     */
    const allCats = [...Object.values(this.catSubs).flat()];

    if (to.query.cat && includes(allCats, to.query.cat)) {
      this.catCur = to.query.cat;
    } else {
      this.catCur = "全部";
    }

    next();
  },

  components: {
    MyButton,
    PlaylistSummary,
    Pagination,
  },
};
</script>

<style lang="scss" scoped>
@import "#/scss/global.scss";

.playlist {
  background: $background-grey-white;

  .playlist-wrapper {
    width: 900px;
    min-height: 650px;
    margin: 0 auto;
    padding: 40px;
    border: 1px solid #d3d3d3;
    border-width: 0 1px;

    .label {
      height: 33px;
      display: flex;
      padding-bottom: 6px;
      border-bottom: 2px solid #c20c0c;

      .label-text {
        height: 33px;
        line-height: 33px;
        font-size: 24px;
        color: #333;
      }

      .selector {
        position: relative;

        .cat-select {
          height: 31px;
          line-height: 31px;
          font-size: 12px;
          font-weight: normal;
          margin: 2px 0 0 12px;
          border: 1px solid #ccc;

          span,
          i {
            color: #0c73c2;
          }
        }

        .select-content {
          position: absolute;
          left: -80px;
          top: 50px;
          width: 700px;
          padding-bottom: 10px;
          box-sizing: border-box;
          border: 1px solid #ccc;
          box-shadow: -6px 6px 6px #ccc;
          border-radius: 6px;
          background: #fff;
          z-index: 1;

          .arrorw-top {
            position: absolute;
            top: -11px;
            left: 118px;
            width: 20px;
            height: 20px;
            background: #fff;
            transform: rotate(45deg);
            border-left: 1px solid #ccc;
            border-top: 1px solid #ccc;
          }

          .all-style {
            padding: 15px 0;
            border-bottom: 1px solid #ccc;

            .btn-all {
              height: 26px;
              line-height: 26px;
              font-size: 12px;
              font-weight: normal;
              margin-left: 26px;
              border: 1px solid #ccc;
            }
          }

          .cat {
            display: flex;

            .cat-title {
              padding: 10px 15px 10px 26px;
              width: 70px;
              flex: 0;
              display: flex;
              align-items: center;
              border-right: 1px solid #e6e6e6;
              border-bottom: 1px solid #e6e6e6;

              i {
                font-size: 30px;
                color: #818181;
              }

              span {
                font-size: 12px;
                font-weight: bold;
                white-space: nowrap;
              }
            }

            .cat-subs {
              padding: 10px 0;
              flex: 1;
              display: flex;
              flex-wrap: wrap;
              align-items: center;
              border-bottom: 1px solid #e6e6e6;

              .sub {
                font-size: 12px;
                padding: 0 15px;
                margin: 15px 0;
                cursor: pointer;

                &:hover {
                  color: #0c73c2;
                }
              }
            }
          }
        }
      }

      .btn-hot {
        margin-left: 20px;
        font-size: 12px;
        color: #666;
      }
    }

    .playlist-content {
      margin-top: 30px;
      display: flex;
      flex-wrap: wrap;

      .playlist-item {
        margin: 0 5px;
      }
    }
  }
}
</style>
