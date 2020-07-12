import Vue from 'vue';
import router from '@/router';
import App from '@/App';
import '#/fonts/iconfont.scss';

new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app');
