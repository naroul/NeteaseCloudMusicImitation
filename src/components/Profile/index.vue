<template>
  <!-- 个人简介 -->
  <div class="usr-prf" v-if="userInfo">
    <!-- 用户头像 -->
    <div class="usr-pic">
      <img :src="userInfo.profile.avatarUrl" />
    </div>

    <!-- 用户简介 -->
    <div class="usr-info">
      <!-- 用户名 等级 私信 关注等-->
      <div class="name">
        <!-- 所有用户（包括登录用户）都会显示的信息 名字 等级 -->
        <h2 class="name-wrp">
          <span class="tit">
            {{ userInfo.profile.nickname }}
          </span>
          <span class="lev">
            {{ userInfo.level }}
            <i class="icn-lev"></i>
          </span>
        </h2>

        <!-- 登录用户显示编辑资料按钮 -->
        <span class="u-btn-e" v-if="isUuId">
          <i>编辑个人资料</i>
        </span>

        <!-- 访问其它用户显示的信息 -->
        <div class="oth-u" v-else>
          <!-- 用户性别 0代表保密 1男 2女-->
          <i
            v-if="!!userInfo.profile.gender"
            :class="[
              'icn-gender',
              {
                'icn-male': userInfo.profile.gender === 1,
                'icn-female': userInfo.profile.gender === 2,
              },
            ]"
          ></i>

          <!-- 私信按钮 -->
          <BtnSendMsg class="smsg" :id="userInfo.profile.userId" />

          <!-- 关注按钮 -->
          <BtnFollow
            :id="userInfo.profile.userId"
            :followed="userInfo.profile.followed"
          ></BtnFollow>
        </div>
      </div>

      <!-- 动态 关注 粉丝 -->
      <ul class="tab-box">
        <!-- 动态数 -->
        <li class="fst">
          <router-link :to="`/user/event?id=${userInfo.profile.userId}`">
            <strong>{{ userInfo.profile.eventCount }}</strong>
            <span>动态</span>
          </router-link>
        </li>

        <!-- 关注数 -->
        <li>
          <router-link :to="`/user/follow?id=${userInfo.profile.userId}`">
            <strong>{{ userInfo.profile.follows }}</strong>
            <span>关注</span>
          </router-link>
        </li>

        <!-- 粉丝数 -->
        <li>
          <router-link to="#">
            <strong>{{ userInfo.profile.followeds }}</strong>
            <span>粉丝</span>
          </router-link>
        </li>
      </ul>

      <!-- 个人介绍 -->
      <div
        v-if="userInfo.profile && userInfo.profile.signature"
        class="inf s-fc"
      >
        个人介绍：{{ userInfo.profile.signature }}
      </div>

      <!-- 年龄 -->
      <div
        v-if="userInfo.profile && userInfo.profile.birthday"
        class="inf s-fc"
      >
        年龄：{{ _formatMsToYears(userInfo.profile.birthday) }}
      </div>
    </div>
  </div>
</template>

<script>
import BtnFollow from "@/components/BtnFollow";
import BtnSendMsg from "@/components/BtnSendMsg";
import { formatMsToYears } from "^/formatMsToYears";
import { userMixin } from "@/mixins";

export default {
  mixins: [userMixin],
  props: {
    /**
     * 是否是当前登录用户的Id
     */
    isUuId: {
      type: Boolean,
      required: true,
    },
  },

  methods: {
    /**
     * 根据出生的 ms 计算年代
     */
    _formatMsToYears(ms) {
      return formatMsToYears(ms);
    },
  },

  components: {
    BtnFollow,
    BtnSendMsg,
  },
};
</script>

<style lang="scss" scoped>
.usr-prf {
  margin-bottom: 43px;
  display: flex;

  .usr-pic {
    width: 188px;
    margin-right: 40px;

    img {
      display: block;
      width: 180px;
      height: 180px;
      padding: 3px;
      background: #fff;
      border: 1px solid #d5d5d5;
    }
  }

  .usr-info {
    flex: 1;

    .name {
      display: flex;
      align-items: center;
      padding-bottom: 12px;
      margin-bottom: 10px;
      border-bottom: 1px solid #ddd;

      .name-wrp {
        .tit {
          margin-top: 3px;
          font-size: 22px;
          font-weight: normal;
          line-height: 30px;
        }

        .lev {
          margin: 8px 0 0 10px;
          display: inline-flex;
          align-items: center;
          height: 19px;
          overflow: hidden;
          padding-left: 29px;
          line-height: 21px;
          color: #e03a24;
          font-size: 14px;
          font-weight: bold;
          font-style: italic;
          background: url("~@/assets/images/Common/icon2.png") no-repeat 0
            9999px;
          background-position: -135px -190px;
          word-break: break-word;

          .icn-lev {
            position: relative;
            left: 3px;
            width: 12px;
            height: 19px;
            background: url("~@/assets/images/Common/icon2.png");
            background-position: -191px -190px;
            display: inline-block;
            overflow: hidden;
            font-style: normal;
            text-align: left;
            font-size: inherit;
          }
        }
      }

      .oth-u {
        display: flex;
        margin-left: 8px;

        .icn-gender {
          display: block;
          width: 20px;
          height: 20px;
          margin-top: 9px;
          background: url("~@/assets/images/Common/icon.png");
        }

        .icn-male {
          background-position: -41px -57px;
        }

        .icn-female {
          background-position: -41px -27px;
        }

        .smsg {
          margin: 4px 0 0 15px;
        }
      }

      .u-btn-e {
        margin: 4px 0 0 15px;
        padding: 0 5px 0 0;
        display: inline-block;
        height: 31px;
        line-height: 31px;
        overflow: hidden;
        vertical-align: top;
        text-align: center;
        outline: none;
        font-size: 12px;
        color: #333;
        background: url("~@/assets/images/Common/button2.png") no-repeat 0
          9999px;
        background-position: right -100px;
        text-decoration: none;
        cursor: pointer;

        &:hover,
        &:active {
          background-position: right -182px;
        }

        i {
          display: inline-block;
          padding: 0 15px 0 20px;
          height: 31px;
          line-height: 31px;
          overflow: hidden;
          vertical-align: top;
          text-align: center;
          font-style: normal;
          background: url("~@/assets/images/Common/button2.png") no-repeat 0
            9999px;
          background-position: 0 -59px;
          cursor: pointer;

          &:hover,
          &:active {
            background-position: 0 -141px;
          }
        }
      }
    }

    .tab-box {
      height: 41px;
      margin-bottom: 15px;
      color: #666;

      li {
        float: left;
        padding: 0 40px 0 20px;
        border-left: 1px solid #ddd;
      }

      a {
        display: inline-block;
        position: relative;
        zoom: 1;
        color: #666;
        text-decoration: none;
        list-style: none;

        &:hover {
          color: #0c73c2;
        }
      }

      strong {
        display: block;
        margin-top: -4px;
        margin-bottom: 6px;
        font-size: 24px;
        font-weight: normal;
        cursor: pointer;
      }

      span {
        display: block;
        font-size: 12px;
        text-indent: 2px;
        cursor: pointer;
      }

      .fst {
        padding-left: 0;
        border-left: none;
      }
    }

    .inf {
      margin-bottom: 5px;
      line-height: 21px;
      font-size: 12px;
      color: #666;
    }
  }
}
</style>