import Vue from 'vue';
import router from '@/router';
import App from '@/App';
import store from './store';
import Toast from '@/plugins/Toast';
import '#/fonts/iconfont.scss';

/**
 * 注册Toast插件
 */
Vue.use(Toast);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
