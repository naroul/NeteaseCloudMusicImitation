<template>
  <div class="playlist">
    <div class="playlist-wrapper">
      <!-- 标题区域 -->
      <div class="label">
        <span class="label-text">{{ catCur }}</span>

        <!-- 选择下拉框 -->
        <div class="selector">
          <MyButton class="cat-select">
            <span>选择分类</span>
            <i class="iconfont icon-arrow-down" />
          </MyButton>

          <!-- 下拉框 -->
          <div class="select-content" v-if="catSubs">
            <div class="arrorw-top"></div>
            <div class="all-style">
              <MyButton class="btn-all">
                <span>全部风格</span>
              </MyButton>
            </div>
            <div class="cat" v-for="cat of Object.entries(catSubs)">
              <div class="cat-title">
                <i :class="['iconfont', icons[cat[0]]]" />
                <span>{{ cat[0] }}</span>
              </div>
              <div class="cat-subs">
                <span class="sub" v-for="sub of cat[1]">{{ sub }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getPlaylistCat,
  getHotPlaylistCat,
  getTopPlaylist,
} from '@/apis/playlist';
import MyButton from '@/ui/MyButton';

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
      catCur: '全部',
    };
  },

  methods: {
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
    _getTopPlaylist({ cat, limit, before }) {
      return getTopPlaylist({ cat, limit, before });
    },

    _initData() {
      this._getPlaylistCat().then(({ data: { categories, sub } }) => {
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
        console.log(cats);
      });

      this._getTopPlaylist({
        limit: 35,
      }).then(({ data: { playlists } }) => {
        this.playList = playlists;
      });
    },
  },

  created() {
    this._initData();

    this.icons = {
      语种: 'icon-Exportservices',
      情感: 'icon-smile',
      场景: 'icon-nightmode',
      风格: 'icon-component',
      主题: 'icon-customization',
    };
  },

  components: {
    MyButton,
  },
};
</script>

<style lang="scss" scoped>
@import '#/scss/global.scss';

.playlist {
  background: $background-grey-white;

  .playlist-wrapper {
    height: 1000px;
    width: 900px;
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

          .arrorw-top {
            position: absolute;
            top: -11px;
            left: 118px;
            width: 20px;
            height: 20px;
            background: $background-grey-white;
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
              cursor: pointer;

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
  }
}
</style>
