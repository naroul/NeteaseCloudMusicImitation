<template>
  <div class="login-wrapper">
    <div class="header">
      <label>登录</label>
      <MyButton width="30" class="close-button">x</MyButton>
    </div>
    <div class="form">
      <label>账号</label>
      <MyInput
        class="input"
        v-model="tel"
        type="tel"
        placeholder="请输入电话号码"
      />
      <label>密码</label>
      <MyInput class="input" type="password" placeholder="请输入密码" />
      <MyButton :width="120" class="login-button">登录</MyButton>
      <MyButton :width="120" class="cancel-button">取消</MyButton>
    </div>
  </div>
</template>

<script>
import MyInput from '@/ui/MyInput';
import MyButton from '@/ui/MyButton';

export default {
  data() {
    return {
      tel: '',
    };
  },

  methods: {},

  components: {
    MyInput,
    MyButton,
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
    color: $white-color;
    font-size: 16px;

    .close-button {
      float: right;
      position: relative;
      top: 50%;
      transform: translateY(-50%);
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
}
</style>
