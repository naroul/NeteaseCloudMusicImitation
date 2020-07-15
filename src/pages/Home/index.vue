<template>
  <div id="home">
    <Header />
    <router-view></router-view>
    <Login v-if="isShowLoginDialog" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import Header from '@/components/Header';
import Login from '@/components/Login';

export default {
  computed: {
    ...mapGetters(['isShowLoginDialog']),
  },

  components: {
    Header,
    Login,
  },
};
</script>

<style></style>
