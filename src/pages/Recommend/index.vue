<template>
  <div id="recommend">
    <Banner :banners="banners" v-if="banners.length" />
  </div>
</template>

<script>
import { getBanners } from '@/apis/recommend';
import Banner from '@/components/Banner';

export default {
  data() {
    return {
      banners: [],
    };
  },

  methods: {
    /**
     * 获取轮播图数据
     */
    _getBanners() {
      getBanners().then((res) => {
        console.log(res);
        this.banners = res.data.banners;
      });
    },
  },

  created() {
    this._getBanners();
  },

  components: {
    Banner,
  },
};
</script>

<style lang="scss" scoped></style>
