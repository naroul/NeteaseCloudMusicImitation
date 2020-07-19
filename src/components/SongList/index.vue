<!-- 歌曲清单组件 -->

<template>
  <div class="song-list" :style="{ width: `${width}px` }">
    <div v-if="type === 'playlist'" class="song-list-title">
			<div class="title-rank"></div>
			<div class="title-cover"></div>
			<div class=""></div>
		</div>
    <li v-for="item of songList">{{ item.name }}</li>
  </div>
</template>

<script>
export default {
  props: {
    /**
     * 歌曲清单的类型  歌单的歌曲清单 或者 歌手的歌曲清单
     */
    type: {
      validator(value) {
        return ['playlist', 'singer'].includes(value);
      },
      required: true,
      default: 'playlist',
    },

    /**
     * 歌曲列表数据
     */
    songList: {
      type: Array,
      required: true,
    },

    /**
     * 整个清单宽度
     */
    width: {
      type: [Number, String],
      required: false,
    },
  },
};
</script>

<style lang="scss" scoped></style>
