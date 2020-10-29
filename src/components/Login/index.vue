<template>
  <div class="lg-wrp">
    <!-- 登录框 -->
    <div class="lg-dialog">
      <!-- 登录标题 -->
      <div class="lg-ttl">
        <div class="zttl">登录</div>
      </div>

      <!-- 登录表单 -->
      <div class="lg-cnt">
        <div class="u-main">
          <div class="u-opt u-mopt">
            <i
              :class="[
                'u-mlg',
                'u-mmlg',
                {
                  'u-tel': !mode,
                  'u-mail': !!mode,
                },
              ]"
            ></i>
            {{ curModeInfo.name }}登录
          </div>
          <MyInput
            class="u-ipt"
            v-model="account"
            type="tel"
            :placeholder="`请输入${curModeInfo.name}`"
          />
          <MyInput
            class="u-ipt"
            v-model="password"
            type="password"
            placeholder="请输入密码"
          />
          <MyButton class="u-ipt u-lg" :onclick="confirmLogin"> 登录 </MyButton>
        </div>
        <div class="u-alt">
          <div class="u-opt" @click="setMode(0)">
            <i class="u-mlg u-tel"></i>
            手机号登录
          </div>

          <div class="u-opt" @click="setMode(1)">
            <i class="u-mlg u-mail"></i>
            网易邮箱账号登录
          </div>
        </div>
      </div>

      <!-- 关闭按钮 -->
      <span class="cls" title="关闭窗体" @click="closeLgDialog">×</span>
    </div>
    <!-- 拼图验证 -->
    <PuzzleVerify class="pzl" v-if="isShowPuzzleVerify" @verified="verified" />
  </div>
</template>

<script>
import { loginByTel, loginByMail } from "@/apis/login";
import { loginMixin, userMixin } from "@/mixins";
import PuzzleVerify from "../PuzzleVerify";
import MyInput from "@/ui/MyInput";
import MyButton from "@/ui/MyButton";

export default {
  mixins: [loginMixin, userMixin],
  data() {
    return {
      /**
       * 账号
       */
      account: "",

      /**
       * 密码
       */
      password: "",

      /**
       * 0代表手机号 1代表邮箱登录
       */
      mode: 0,

      /**
       * 是否显示图形验证码
       */
      isShowPuzzleVerify: false,
    };
  },

  computed: {
    /**
     * 登录模式的信息
     */
    curModeInfo() {
      return this.config[this.mode];
    },
  },

  methods: {
    /**
     * 设置登录模式
     */
    setMode(mode) {
      this.mode = mode;
    },

    /**
     * 关闭登录框
     */
    closeLgDialog() {
      this.setLoginDialogStatus(false);
    },

    /**
     * 点击登录按钮
     */
    confirmLogin() {
      if (this.account && this.password) {
        this.isShowPuzzleVerify = true;
      } else {
        this.$toast.failed("账号或密码为空，请输入");
      }
    },

    /**
     * 验证通过时的回调
     * 验证通过后执行登录操作
     */
    verified() {
      this.login();
    },

    /**
     * 登录
     */
    async login() {
      this.isShowPuzzleVerify = false;

      await (!this.mode
        ? loginByTel(this.account, this.password)
        : loginByMail(this.account, this.password)
      )
        .then((res) => {
          /**
           * 登录成功时，返回码以2开头
           */
          if (/^2/.test(res.data && res.data.code)) {
            this.$toast.success("登陆成功", 1000);

            /**
             * 设置全局登录状态
             */
            this.setLoginStatus(true);

            /**
             * 存储登录用户Id
             */
            this.setUuId(res.data.profile.userId);

            /**
             * 关闭登录框
             */
            this.setLoginDialogStatus(false);
          } else {
            /**
             * 当返回码不是2开头，并有错误信息时，toast出改报错
             */
            if (res.data && (res.data.msg || res.data.message)) {
              this.$toast.failed(res.data.msg || res.data.message);
            }
          }
        })
        .catch((e) => {
          this.$toast.failed("账号或密码错误，请重新输入");
        });
    },
  },

  created() {
    this.config = [
      {
        name: "手机号",
        x: -16,
        y: -65,
      },
      {
        name: "网易邮箱账号",
        x: -271,
        y: -670,
      },
    ];
  },

  components: {
    MyInput,
    MyButton,
    PuzzleVerify,
  },
};
</script>

<style lang="scss" scoped>
@import "#/scss/global.scss";

.lg-wrp {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  margin: auto;
  background: transparent;
  z-index: 99;

  .lg-dialog {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 530px;
    height: 330px;
    border-radius: 4px;
    box-shadow: 0 5px 16px rgba(0, 0, 0, 0.8);
    border: none;
    background: #fff;

    .lg-ttl {
      position: relative;
      z-index: 10;
      border-bottom: 1px solid #191919;
      border-radius: 4px 4px 0 0;
      background: #2d2d2d;

      .zttl {
        padding-right: 45px;
        margin: 0;
        height: 38px;
        line-height: 38px;
        padding-left: 18px;
        border-radius: 3px 3px 0 0;
        font-weight: bold;
        font-size: 14px;
        color: #fff;
        background-position: 50% 0;
      }
    }

    .lg-cnt {
      padding: 40px 0 39px;

      .u-main {
        float: left;
        width: 224px;
        padding: 0 35px 3px 40px;
        border-right: 1px dotted #ccc;

        .u-mopt {
          padding-left: 28px;
          cursor: default;

          &:hover {
            text-decoration: none;
          }
        }

        .u-ipt {
          margin-top: 10px;
          width: 220px;
          font-size: 12px;
        }

        .u-lg {
          height: 30px;
          font-size: 12px;
          background: rgba(40, 120, 198, 1);
          color: #fff;
          border-radius: 3px;

          &:hover {
            background: #4a93db;
          }
        }
      }

      .u-alt {
        float: left;
        padding: 3px 0 3px 39px;
      }

      .u-opt {
        display: flex;
        margin-top: 15px;
        align-items: center;
        font-size: 12px;
        cursor: pointer;

        &:hover {
          text-decoration: underline;
        }

        .u-mlg {
          display: block;
          margin-right: 14px;
          width: 38px;
          height: 38px;
          background: url("~@/assets/images/Common/logo.png");
          border-radius: 9px;
        }

        .u-mail {
          background-position: -271px -670px;
          cursor: pointer;
        }

        .u-tel {
          background-position: -16px -65px;
          cursor: pointer;
        }

        .u-mmlg {
          cursor: default;
        }
      }
    }

    .cls {
      position: absolute;
      z-index: 20;
      top: 16px;
      right: 20px;
      width: 10px;
      height: 10px;
      overflow: hidden;
      text-indent: -9999px;
      cursor: pointer;
      background: url("~@/assets/images/Common/layer.png");
      background-position: 0 -95px;
    }
  }

  .pzl {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 100;
  }
}
</style>
