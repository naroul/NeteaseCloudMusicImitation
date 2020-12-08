<template>
  <div>
    <!-- 私信按钮 -->
    <span class="u-btn-s" @click="open">
      <i>发私信</i>
    </span>

    <Dialog v-if="isShowDialog" title="发送私信" :width="480" @close="close">
      <EditBox
        width="100%"
        :isShowBtn="true"
        label="私信"
        :maxCount="200"
        v-model="msg"
        @confirm="send"
      />
    </Dialog>
  </div>
</template>

<script>
import Dialog from "@/ui/Dialog";
import EditBox from "@/ui/EditBox";
import { sendMsg } from "@/apis/user";

export default {
  props: {
    id: {
      type: [Number, String],
      required: true,
      default: "",
    },
  },

  data() {
    return {
      /**
       * 私信弹窗状态
       */
      isShowDialog: false,

      /**
       * 私信内容
       */
      msg: "",
    };
  },

  methods: {
    /**
     * 打开私信弹窗
     */
    open() {
      this.isShowDialog = true;
    },

    /**
     * 关闭私信弹窗
     */
    close() {
      this.isShowDialog = false;
    },

    /**
     * 发送私信
     */
    send() {
      sendMsg({ id: this.id, msg: this.msg })
        .then(({ data }) => {
          this.isShowDialog = false;
          this.$toast.success("发送成功");
        })
        .catch((e) => {
          this.isShowDialog = false;
          this.$toast.failed(e.toString());
        });
    },
  },

  components: {
    Dialog,
    EditBox,
  },
};
</script>

<style lang="scss" scoped>
.u-btn-s {
  display: inline-block;
  width: 75px;
  height: 31px;
  background: url("~@/assets/images/Common/button.png");
  background-position: 0 -810px;
  text-decoration: none;
  cursor: pointer;

  i {
    display: inline-block;
    height: 29px;
    line-height: 29px;
    padding-left: 30px;
    font-style: normal;
    text-align: left;
    font-size: 12px;
    cursor: pointer;
  }

  &:hover,
  &:active {
    outline: none;
    background-position: 0 -845px;
  }
}
</style>