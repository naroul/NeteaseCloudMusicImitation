<template>
  <!-- 歌手页 -->
  <div class="bd">
    <!-- 侧边栏 -->
    <div class="sd">
      <h2 class="tit">推荐</h2>
      <ul class="nav">
        <li @click="updateCfg({ area: -1, type: -1 })">
          <span :class="{ cur: curArea === -1 && curType === -1 }"
            >热门歌手</span
          >
        </li>
      </ul>
      <div class="blk" v-for="tag of this.tags">
        <h2 class="tit">{{ tag.label }}</h2>
        <ul class="nav">
          <!-- 歌手类型 1 男 2女 3组合 -->
          <li v-for="tp of 3" @click="updateCfg({ area: tag.area, type: tp })">
            <span :class="{ cur: tag.area === curArea && curType === tp }">{{
              tag.label + Type[tp]
            }}</span>
          </li>
        </ul>
      </div>
    </div>

    <!-- 内容 -->
    <div class="mn">
      <!-- 内容标题 -->
      <div class="u-title">
        <h3>{{ Area[curArea] + Type[curType] }}</h3>
      </div>

      <ul class="cvr">
        <li
          v-for="(artist, index) of artists"
          :class="{ line: 4 < index && index < 10, sml: index > 9 }"
        >
          <!-- 前10个显示封面 -->
          <div class="avr" v-if="index < 10">
            <img :src="artist.img1v1Url" />
            <router-link class="msk" to="/user/singer" />
          </div>

          <p :title="artist.name">
            <router-link to="/user/singer">{{ artist.name }}</router-link>
          </p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { getArtist } from "@/apis/singer";

export default {
  data() {
    return {
      /**
       * 歌手类型列表 -1全部 1男 2女 3组合
       */
      Type: {
        "-1": "歌手",
        1: "男歌手",
        2: "女歌手",
        3: "组合/乐队",
      },

      Area: {
        "-1": "热门",
        7: "华语",
        96: "欧美",
        8: "日本",
        16: "韩国",
        0: "其它",
      },

      /**
       * 当前页面显示的歌手地区
       */
      curArea: -1,

      /**
       * 当前页面显示的歌手类型
       */
      curType: -1,

      /**
       * 歌手数据
       */
      artists: [],
    };
  },

  watch: {
    /**
     * 监听地区变化,更新数据
     */
    curArea(newArea, oldArea) {
      console.log("area");
      this._getArtist({ area: newArea, type: this.curType });
    },

    /**
     * 监听歌手类型变化，,更新数据
     */
    curType(newType, oldType) {
      console.log("type");
      this._getArtist({ type: newType, area: this.curArea });
    },
  },

  methods: {
    /**
     * 更新选中的地区和歌手类型
     */
    updateCfg({ area, type }) {
      this.curArea = area;
      this.curType = type;
    },

    /**
     * 获取歌手数据并更新data
     */
    _getArtist({
      limit = 100,
      offset = 0,
      type = -1,
      area = -1,
      initial = -1,
    } = {}) {
      if (this.isLoding) {
        return;
      }

      /**
       * 加载开始
       */
      this.isLoding = true;

      getArtist({ limit, offset, type, area, initial }).then(({ data }) => {
        this.artists = data.artists;

        /**
         * 加载结束
         */
        this.isLoding = false;
      });
    },
  },

  created() {
    /**
     * 左侧sidebar显示的tabs
     */
    this.tags = [
      {
        label: "华语",
        area: 7,
      },
      {
        label: "欧美",
        area: 96,
      },
      {
        label: "日本",
        area: 8,
      },
      {
        label: "韩国",
        area: 16,
      },
      {
        label: "其它",
        area: 0,
      },
    ];

    /**
     * 是否正在加载数据,用于防止改变 type和 area时发送两个请求
     */
    this.isLoding = false;

    this._getArtist();
  },
};
</script>

<style lang="scss" scoped>
@import "#/scss/global.scss";

.bd {
  width: 980px;
  min-height: 700px;
  margin: 0 auto;
  display: flex;
  background-color: #fff;
  background: url("~@/assets/images/Common/wrap2.png") repeat-y center 0;
  border: 1px solid #d3d3d3;
  border-width: 0 1px;

  .sd {
    width: 160px;
    padding: 51px 10px 40px;

    .tit {
      height: 25px;
      padding-left: 14px;
      font-size: 16px;
      font-weight: bold;
    }

    .nav {
      li {
        width: 160px;
        height: 29px;
        margin-bottom: 2px;
        line-height: 29px;

        span {
          display: inline-block;
          width: 133px;
          padding-left: 27px;
          height: 29px;
          line-height: 29px;
          background: url("~@/assets/images/Common/singer.png") no-repeat 0
            9999px;
          background-position: 0 -30px;
          color: #333;
          font-size: 12px;
          text-decoration: none;
          cursor: pointer;
        }

        .cur {
          color: #c20c0c;
          background-position: 0 0;
        }
      }
    }

    .blk {
      margin: 8px 0 0;
      padding-top: 16px;
      border-top: 1px solid #d3d3d3;
    }
  }

  .mn {
    flex: 1;
    padding: 40px;
    min-width: 720px;

    .u-title {
      height: 40px;
      border-bottom: 2px solid #c20c0c;

      h3 {
        float: left;
        font-size: 24px;
        font-weight: normal;
      }
    }

    .cvr {
      margin: 20px 0 0 -17px;

      li {
        width: 130px;
        height: 154px;
        overflow: hidden;
        padding: 0 0 30px 17px;
        line-height: 1.4;
        float: left;

        .avr {
          position: relative;
          width: 130px;
          height: 130px;
          font-size: 0;

          img {
            width: 100%;
            height: 100%;
          }

          .msk {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: url("~@/assets/images/Common/coverall.png") no-repeat;
            background-position: 0 -680px;
          }
        }

        p {
          margin-top: 8px;
          width: 100%;
          font-size: 12px;
          color: #333;
          @include word-hide;
        }
      }

      .line {
        margin-bottom: 12px;
        border-bottom: 1px dotted #999;
      }

      .sml {
        height: 30px;
        padding-bottom: 0;
        line-height: 23px;
      }
    }
  }
}
</style>