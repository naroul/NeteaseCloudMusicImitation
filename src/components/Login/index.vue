<template>
  <div class="login-wrapper">
    <div class="header">
      <label>登录</label>
      <MyButton width="30" class="close-button" :onclick="closeLoginDialog">
        <i class="iconfont icon-close"></i>
      </MyButton>
    </div>
    <div class="form">
      <label>账号</label>
      <MyInput
        class="input"
        v-model="phone"
        type="tel"
        placeholder="请输入电话号码"
      />
      <label>密码</label>
      <MyInput
        class="input"
        v-model="password"
        type="password"
        placeholder="请输入密码"
      />
      <MyButton :width="120" class="login-button" :onclick="confirmLogin">
        登录
      </MyButton>
      <MyButton :width="120" class="cancel-button" :onclick="closeLoginDialog">
        取消
      </MyButton>
    </div>
    <PuzzleVerify
      class="puzzle-verify"
      v-if="isShowPuzzleVerify"
      @verified="verified"
    />
  </div>
</template>

<script>
import { mapMutations } from 'vuex';
import { loginByPhone } from '@/apis/login';
import PuzzleVerify from '../PuzzleVerify';
import MyInput from '@/ui/MyInput';
import MyButton from '@/ui/MyButton';

export default {
  data() {
    return {
      /**
       * 电话号码
       */
      phone: '',

      /**
       * 密码
       */
      password: '',

      /**
       * 是否显示图形验证码
       */
      isShowPuzzleVerify: false,
    };
  },

  methods: {
    /**
     * 关闭登录框
     */
    closeLoginDialog() {
      this.setLoginDialogStatus(false);
    },

    /**
     * 验证通过时的回调
     * 验证通过后执行登录操作
     */
    verified() {
      this.login();
    },

    /**
     * 登录按钮回调
     * 验证账号 密码输入值 如果都不为空，则显示图形验证框
     */
    confirmLogin() {
      if (this.phone && this.password) {
        this.isShowPuzzleVerify = true;
      } else {
        this.$toast.failed('账号或密码为空，请输入');
      }
    },

    /**
     * 登录
     */
    login() {
      this.isShowPuzzleVerify = false;

      loginByPhone(this.phone, this.password)
        .then((res) => {
          console.log(res);
          this.setLoginStatus(true);
          this.setLoginDialogStatus(false);
        })
        .catch((e) => console.log(e));
    },

    ...mapMutations(['setLoginStatus', 'setLoginDialogStatus']),
  },

  components: {
    MyInput,
    MyButton,
    PuzzleVerify,
  },
};
</script>

<style lang="scss" scoped>
@import '#/scss/global.scss';

.login-wrapper {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  margin: auto;
  box-sizing: border-box;
  border: 1px solid black;
  border-radius: 2px;
  width: 500px;
  height: 400px;
  background: url('~@/assets/images/Login/background.jpg');
  background-size: cover;
  background-position: center -20px;

  .header {
    box-sizing: border-box;
    width: 499px;
    height: 50px;
    padding: 0 20px;
    line-height: 50px;
    background: #5b5b5b;
    border-radius: 2px;

    font-size: 16px;

    label {
      color: $white-color;
    }

    .close-button {
      float: right;
      position: relative;
      top: 50%;
      transform: translateY(-50%);
      background: #5b5b5b;

      .icon-close {
        color: $white-color;

        &:hover,
        &:active {
          color: #fff;
        }
      }
    }
  }

  .form {
    display: grid;
    grid-template-rows: 50px 50px;
    grid-template-columns: 100px 200px;
    justify-content: center;
    align-items: center;
    width: 300px;
    height: 200px;
    margin: 50px 0 0 100px;

    .input {
      background: rgba(211, 212, 219, 0.2);
      color: $white-color;
    }

    label {
      justify-self: center;
      padding: 5px;
      color: $white-color;
    }

    .login-button {
      position: relative;
      left: 52px;
      justify-self: self-end;
    }

    .cancel-button {
      position: relative;
      justify-self: self-end;
    }
  }

  .puzzle-verify {
    position: relative;
    left: 40px;
    top: -280px;
  }
}
</style>
