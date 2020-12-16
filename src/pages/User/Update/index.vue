<template>
  <!-- 个人设置 -->
  <div class="upt">
    <!-- 标题 -->
    <div class="tl">
      <h3>个人设置</h3>
    </div>

    <div class="cnt">
      <!-- 个人信息 -->
      <div class="prf">
        <!-- 昵称 -->
        <div class="itm">
          <label class="lab">昵称：</label>
          <MyInput
            class="nm"
            type="text"
            :width="284"
            :height="19"
            v-model="nickname"
          />
        </div>

        <!-- 介绍 -->
        <div class="itm">
          <label class="lab">介绍：</label>
          <textarea v-model="signature" class="txt"></textarea>
          <span :class="['ct', { unval: count < 0 }]">{{ count }}</span>
        </div>

        <!-- 性别 -->
        <div class="itm">
          <label class="lab">性别：</label>
          <div class="gen">
            <input type="radio" id="1" :value="1" v-model="gender" />
            <label class="genlb">男</label>

            <input type="radio" id="2" :value="2" v-model="gender" />
            <label class="genlb">女</label>

            <input type="radio" id="0" :value="0" v-model="gender" />
            <label class="genlb">保密</label>
          </div>
        </div>

        <!-- 生日 -->
        <div class="itm">
          <label class="lab">生日：</label>
          <div class="brth">
            <DropList
              @select="selcetYear"
              :width="80"
              :value="year"
              :selections="years"
            />
            <span class="wrd">年</span>
            <DropList
              @select="selcetMonth"
              :width="66"
              :value="month"
              :selections="months"
            />
            <span class="wrd">月</span>
            <DropList
              @select="selcetDay"
              :width="66"
              :value="day"
              :selections="days"
            />
            <span class="wrd">日</span>
          </div>
        </div>

        <!-- 保存按钮 -->
        <div class="ft">
          <span class="u-btn" @click="setAcntInfo">
            <i>保 存</i>
          </span>
        </div>
      </div>

      <!-- 用户头像 暂不支持更改 -->
      <div class="avartar">
        <img :src="avartar" />
        <span>暂不支持更换头像</span>
      </div>
    </div>
  </div>
</template>

<script>
import MyInput from "@/ui/MyInput";
import EditBox from "@/ui/EditBox";
import DropList from "@/ui/DropList";
import { getAccountInfo, setAccountInfo } from "@/apis/user";

export default {
  data() {
    return {
      /**
       * 昵称
       */
      nickname: "",

      /**
       * 介绍
       */
      signature: "",

      /**
       * 性别 0 保密 1 男 2 女
       */
      gender: 0,

      /**
       * 出生年份
       */
      year: 1970,

      /**
       * 出生月份
       */
      month: "01",

      /**
       * 出生日期
       */
      day: "01",

      avartar: "",
    };
  },

  computed: {
    /**
     * 个人介绍的字数
     */
    count() {
      return 300 - this.signature.length;
    },

    /**
     * 现在时间到1970的所有年份数组
     */
    years() {
      let years = [];
      for (let i = 70, now = new Date().getFullYear() - 1900; i <= now; i++) {
        years = [...years, 1900 + i];
      }

      return years;
    },

    /**
     * 月份
     */
    months() {
      return [
        "01",
        "02",
        "03",
        "04",
        "05",
        "06",
        "07",
        "08",
        "09",
        "10",
        "11",
        "12",
      ];
    },

    days() {
      /**
       * 相应年 月对应的天数
       */
      const maxDate = new Date(this.year, this.month, 0).getDate();

      let days = [];

      for (let i = 1; i <= maxDate; i++) {
        days = [...days, i < 10 ? "0" + i : i];
      }

      return days;
    },
  },

  watch: {
    /**
     * 监听年份变化，实时监测日期的合法性
     */
    year(newYr, oldYr) {
      const maxDate = new Date(newYr, this.month, 0).getDate();

      if (Number(this.day) > maxDate) {
        this.day = maxDate;
      }
    },

    /**
     * 监听月份变化，实时监测日期的合法性
     */
    month(newMt, oldMt) {
      const maxDate = new Date(this.year, newMt, 0).getDate();

      if (Number(this.day) > maxDate) {
        this.day = maxDate;
      }
    },
  },

  methods: {
    /**
     * 选择年份
     */
    selcetYear(value) {
      this.year = value;
    },

    /**
     * 选择月份
     */
    selcetMonth(value) {
      this.month = value;
    },

    /**
     * 选择日期
     */
    selcetDay(value) {
      this.day = value;
    },

    /**
     * 设置用户信息
     */
    setAcntInfo() {
      const {
        count,
        gender,
        year,
        month,
        day,
        nickname,
        province,
        city,
        signature,
      } = this;

      /**
       * 验证介绍是否合法
       */
      if (count < 0) {
        this.$toast.failed("介绍不可大于300字！");
        return;
      }

      /**
       * 生日对应的事件戳
       */
      const birthday = new Date(year, Number(month) - 1, day).getTime();

      setAccountInfo({
        gender,
        birthday,
        nickname,
        province,
        city,
        signature,
      }).then(() => {
        this.$toast.success("保存成功！");
      });
    },
  },

  created() {
    /**
     * 初始化页面信息
     */
    getAccountInfo().then(({ data: { profile } }) => {
      const birth = new Date(profile.birthday);
      this.nickname = profile.nickname;
      this.signature = profile.signature || "";
      this.gender = profile.gender;
      this.year = birth.getFullYear();
      this.month =
        birth.getMonth() + 1 < 10
          ? "0" + (birth.getMonth() + 1)
          : birth.getMonth() + 1;
      this.day = birth.getDate() < 10 ? "0" + birth.getDate() : birth.getDate();

      /**
       * 头像url
       */
      this.avartar = profile.avatarUrl;

      /**
       * 城市和省份作为实例属性 死数据 暂不支持选择
       */
      this.city = profile.city;
      this.province = profile.province;
    });
  },

  components: {
    MyInput,
    EditBox,
    DropList,
  },
};
</script>

<style lang="scss" scoped>
.upt {
  width: 980px;
  min-height: 700px;
  margin: 0 auto;
  padding: 40px;
  background-color: #fff;
  border: 1px solid #d3d3d3;
  border-width: 0 1px;
  font-size: 12px;

  .tl {
    height: 40px;

    h3 {
      font-size: 24px;
      font-weight: normal;
    }
  }

  .cnt {
    margin-top: 30px;
    display: flex;

    .prf {
      width: 340px;
      margin-right: 30px;

      .lab {
        width: 38px;
        line-height: 32px;
        text-align: right;
        float: left;
      }

      .itm {
        position: relative;
        min-height: 32px;
        margin-bottom: 10px;

        .ct {
          position: absolute;
          right: 12px;
          bottom: 8px;
          color: #d0d0d0;
        }

        .unval {
          color: #c20c0c;
        }
      }

      .ft {
        margin-top: 40px;
        padding-left: 38px;

        .u-btn {
          display: inline-block;
          padding: 0 5px 0 0;
          white-space: nowrap;
          background: url("~@/assets/images/Common/button2.png") no-repeat 0
            9999px;
          background-position: right -428px;
          cursor: pointer;

          &:hover {
            background-position: right -510px;
          }

          i {
            display: inline-block;
            height: 31px;
            line-height: 31px;
            overflow: hidden;
            vertical-align: top;
            text-align: center;
            width: 40px;
            color: #fff;
            background: url("~@/assets/images/Common/button2.png") no-repeat 0
              9999px;
            background-position: 0 -387px;
            padding: 0 15px 0 20px;
            font-style: normal;
            cursor: pointer;

            &:hover {
              background-position: 0 -469px;
            }
          }
        }
      }

      .txt {
        width: 292px;
        height: 122px;
        resize: none;
      }

      .nm {
        margin: 0;
        padding: 5px 6px 6px;
        border: 1px solid #cdcdcd;
        border-radius: 2px;
        line-height: 19px;
        box-sizing: content-box;
        font-size: 12px;
      }

      .gen {
        width: 292px;
        height: 30px;
        line-height: 33px;

        .genlb {
          margin-right: 10px;
        }
      }

      .brth {
        width: 292px;
        min-height: 30px;
        display: flex;

        .wrd {
          margin: 0 12px 0 6px;
          line-height: 32px;
        }
      }
    }

    .avartar {
      position: relative;
      width: 140px;
      height: 140px;
      font-size: 0;

      img {
        width: 140px;
        height: 140px;
      }

      span {
        display: block;
        position: absolute;
        width: 140px;
        height: 26px;
        left: 0;
        bottom: 0;
        color: #fff;
        text-align: center;
        line-height: 26px;
        font-size: 12px;
        background: #8e8e8e;
        opacity: 0.8;
      }
    }
  }
}
</style>