<template>
  <!-- 用户简历 用于用户关注、粉丝页面 -->
  <div class="resume" :style="{ width: `${width}px`, height: `${height}px` }">
    <!-- 头像 -->
    <router-link class="avt" :to="`/user/info?id=${profile.userId}`">
      <img :src="profile.avatarUrl" />
    </router-link>

    <!-- 文字信息 -->
    <div class="info">
      <!-- 名字、性别 -->
      <p>
        <router-link
          :to="`/user/info?id=${profile.userId}`"
          class="nm"
          :title="profile.nickname"
        >
          {{ profile.nickname }}
        </router-link>
        &nbsp;
        <i
          v-if="!!profile.gender"
          :class="[
            'icn-gender',
            {
              'icn-male': profile.gender === 1,
              'icn-female': profile.gender === 2,
            },
          ]"
        ></i>
      </p>

      <!-- 动态、 关注、 粉丝 -->
      <p>
        <router-link class="acts" :to="`/user/event?id=${profile.userId}`">
          动态
          <em>{{ profile.eventCount }}</em>
        </router-link>

        <span class="line">|</span>

        <router-link class="acts" :to="`/user/follow?id=${profile.userId}`">
          关注
          <em>{{ profile.follows }}</em>
        </router-link>

        <span class="line">|</span>

        <router-link class="acts" :to="`/user/fans?id=${profile.userId}`">
          粉丝
          <em>{{ profile.followeds }}</em>
        </router-link>
      </p>

      <!-- 说明 -->
      <p class="sign" :title="profile.signature">
        <span>{{ profile.signature }}</span>
      </p>
    </div>

    <!-- 关注、私信区 -->
    <div v-if="profile.followed" class="fl">
      <BtnSendMsg id="profile.userId" />
      <p>
        <i class="icn-f"></i>
        已关注
      </p>
    </div>

    <div v-else>
      <BtnFollow :id="profile.userId" :followed="profile.followed" />
    </div>
  </div>
</template>

<script>
import BtnFollow from "@/components/BtnFollow";
import BtnSendMsg from "@/components/BtnSendMsg";

export default {
  props: {
    /**
     * 用户资料
     */
    profile: {
      type: Object,
      required: true,
      default: {},
    },

    /**
     * 宽度
     */
    width: {
      type: Number,
      required: false,
      default: 400,
    },

    /**
     * 高度
     */
    height: {
      type: Number,
      required: false,
      default: 80,
    },
  },

  components: {
    BtnFollow,
    BtnSendMsg,
  },
};
</script>

<style lang="scss" scoped>
@import "#/scss/global.scss";

.resume {
  display: flex;

  .avt {
    width: 60px;
    height: 60px;

    img {
      width: 60px;
      height: 60px;
    }
  }

  .info {
    flex: 1;
    margin-left: 10px;

    p {
      margin-bottom: 6px;
      display: flex;

      .nm {
        max-width: 235px;
        display: inline-block;
        font-size: 14px;
        color: #0c73c2;
        vertical-align: middle;
        @include word-hide;

        &:hover {
          text-decoration: underline;
        }
      }

      .icn-gender {
        margin: 1px 0 0 2px;
        margin-top: -2px;
        width: 14px;
        height: 15px;
        background: url("~@/assets/images/Common/icon.png");
      }

      .icn-male {
        background-position: -70px -20px;
      }

      .icn-female {
        background-position: -70px 0;
      }

      .acts {
        font-size: 12px;
        color: #000;

        &:hover {
          text-decoration: underline;
        }

        em {
          color: #0c73c2;
          font-style: normal;
        }
      }

      .line {
        margin: 0 8px;
        color: #999;
        font-size: 12px;
      }
    }

    .sign {
      margin-top: 10px;
      font-size: 12px;
      color: #666;

      span {
        max-width: 255px;
        @include word-hide;
      }
    }
  }

  .fl {
    width: 75px;
    padding-top: 5px;

    p {
      margin-top: 5px;
      text-align: center;
      font-size: 12px;

      .icn-f {
        display: inline-block;
        width: 13px;
        height: 10px;
        background: url("~@/assets/images/Common/icon.png");
        background-position: -60px -470px;
      }
    }
  }
}
</style>