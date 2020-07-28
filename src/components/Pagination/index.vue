<template>
  <!-- 分页 -->
  <div class="pg-wrapper">
    <div class="pagination">
      <MyButton class="btn-pg" :disabled="pgCur === 1" :onclick="pgChangePrev">
        <i
          :class="['iconfont', 'icon-arrow-lift', { disabled: pgCur === 1 }]"
        />
        <span :class="{ disabled: pgCur === 1 }">上一页</span>
      </MyButton>
      <div
        :class="['page', { ellipsis: pg === 0, 'page-cur': pg === pgCur }]"
        v-for="pg of pgList"
        @click="pgChange(pg)"
      >
        {{ pg === 0 ? '...' : pg }}
      </div>
      <MyButton
        class="btn-pg"
        :disabled="pgCur === pgSize"
        :onclick="pgChangeNext"
      >
        <span :class="{ disabled: pgCur === pgSize }">下一页</span>
        <i
          :class="[
            'iconfont',
            'icon-arrow-right',
            { disabled: pgCur === pgSize },
          ]"
        />
      </MyButton>
    </div>
  </div>
</template>

<script>
import MyButton from '@/ui/MyButton';

export default {
  props: {
    /**
     * 分页的总页数
     */
    pgSize: {
      type: Number,
      required: true,
    },

    /**
     * 是否重置页码 变成true时重置
     */
    isPgReset: {
      type: Boolean,
      required: false,
      default: false,
    },
  },

  data() {
    return {
      /**
       * 当前页码
       */
      pgCur: 1,
    };
  },

  computed: {
    /**
     * 分页显示的9个页数的页数列表
     */
    pgList() {
      if (this.pgSize <= 8) {
        /**
         * 总页数不满9页的情况
         */
        let pgLs = [];
        for (i = 1; i <= this.pgSize; i++) {
          pgLs = [...pgLs, i];
        }
        return pgLs;
      } else {
        /**
         * 总页数超过9页的情况，但当前页小于5时
         */
        if (this.pgCur <= 5) {
          /**
           *  0代表省略号
           */
          return [1, 2, 3, 4, 5, 6, 7, 8, 0, this.pgSize];
        } else if (this.pgCur > 5 && this.pgCur <= this.pgSize - 5) {
          let pgLs = [];
          for (let i = this.pgCur - 3; i <= this.pgCur + 3; i++) {
            pgLs = [...pgLs, i];
          }
          return [1, 0, ...pgLs, 0, this.pgSize];
        } else {
          let pgLs = [];
          for (let i = this.pgSize - 7; i <= this.pgSize; i++) {
            pgLs = [...pgLs, i];
          }
          return [1, 0, ...pgLs];
        }
      }
    },
  },

  watch: {
    /**
     * 页码改变，重新请求数据
     */
    pgCur(newPg, oldPg) {
      this.$emit('pgChange', newPg);
    },

    isPgReset(newIs, oldIs) {
      if (newIs) {
        this.pgCur = 1;
      }
    },
  },

  methods: {
    /**
     * 上一页
     */
    pgChangePrev() {
      this.pgCur -= 1;
    },

    /**
     * 页码点击 回调
     */
    pgChange(pg) {
      this.pgCur = pg;
    },

    /**
     * 下一页
     */
    pgChangeNext() {
      this.pgCur += 1;
    },
  },

  components: {
    MyButton,
  },
};
</script>

<style lang="scss" scoped>
.pg-wrapper {
  margin: 20px auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .pagination {
    display: flex;
    flex-wrap: wrap;
    color: #333;

    .btn-pg {
      height: 26px;
      margin: 0 2px;
      line-height: 26px;
      font-size: 12px;
      background: #e5e5e5;
      border: 1px solid #ccc;

      &:hover {
        background: #f4f4f4;
        color: #505050;
      }

      .disabled {
        color: #bebebe;
      }
    }

    .iconfont {
      font-size: 10px;
    }

    .page {
      margin: 0 2px;
      padding: 0 8px;
      height: 22px;
      line-height: 22px;
      font-size: 12px;
      border: 1px solid #ccc;
      border-radius: 2px;
      cursor: pointer;
    }

    .page-cur {
      background: rgb(196, 10, 15);
      border-color: #a2161b;
      color: #fff;
    }

    .ellipsis {
      border: none;
    }
  }
}
</style>
