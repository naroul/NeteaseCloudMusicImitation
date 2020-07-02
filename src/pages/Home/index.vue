<template>
  <div id="home" @click="handleClick">Homes</div>
</template>

<script>
export default {
  name: 'Home',
  methods: {
    handleClick() {
      this.$router.push('/');
    },
  },
};
</script>

<style lang="scss" scoped></style>
