<template>
  <div id="recommend" @click="handleClick">login</div>
</template>

<script>
export default {
  name: 'Recommend',
  methods: {
    handleClick() {
      this.$router.push('/login');
    },
  },
};
</script>

<style lang="scss" scoped></style>
