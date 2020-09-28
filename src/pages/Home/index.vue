<template>
  <div id="home">
    <Header />
    <router-view></router-view>
    <Login v-if="isShowLoginDialog" />
    <PLayer />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import Header from '@/components/Header';
import Login from '@/components/Login';
import PLayer from '@/components/Player';

export default {
  computed: {
    ...mapGetters(['isShowLoginDialog']),
  },

  components: {
    Header,
    Login,
    PLayer,
  },
};
</script>

<style></style>
