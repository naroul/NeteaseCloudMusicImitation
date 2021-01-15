<template>
  <!-- 下拉选择组件	 -->
  <PopOver :canCntClsPop="true" class="pop-del">
    <template v-slot:reference>
      <div class="dls" :style="{ width: `${width}px` }">
        <div class="val">{{ value }}</div>
        <i class="icn-arw"></i>
      </div>
    </template>
    <ul class="slecs" :style="{ width: `${width - 2}px` }">
      <li @click="select(selection)" v-for="selection of selections">
        {{ selection }}
      </li>
    </ul>
  </PopOver>
</template>

<script>
import PopOver from "@/ui/PopOver";

export default {
  props: {
    /**
     * 选中的值
     */
    value: {
      required: true,
    },

    /**
     * 下拉列表项
     */
    selections: {
      type: Array,
      required: true,
      default: [],
    },

    /**
     * 宽度
     */
    width: {
      type: Number,
      required: false,
      default: 80,
    },
  },

  methods: {
    select(value) {
      this.$emit("select", value);
    },
  },

  components: {
    PopOver,
  },
};
</script>

<style lang="scss" scoped>
@import "#/scss/global.scss";

.dls {
  display: flex;
  height: 28px;
  background: url("~@/assets/images/Common/sprite2.png") no-repeat 0 9999px;
  background-position: 0 -47px;

  .val {
    padding: 0 10px;
    max-width: 100px;
    height: 28px;
    line-height: 28px;
    cursor: pointer;
  }

  .icn-arw {
    display: block;
    width: 32px;
    height: 28px;
    background: url("~@/assets/images/Common/sprite2.png") no-repeat 0 9999px;
    background-position: -169px -47px;
    cursor: pointer;
  }
}

.slecs {
  max-height: 150px;
  border: 1px solid #ccc;
  overflow: auto;

  li {
    padding-left: 10px;
    height: 26px;
    line-height: 26px;
    background: #fff;
    cursor: pointer;

    &:hover {
      background: #eaeaea;
    }
  }
}
</style>