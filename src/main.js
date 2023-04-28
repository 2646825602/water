import Vue from 'vue'
import Vuex from "vuex"
import ElementUI from "element-ui"
import 'element-ui/lib/theme-chalk/index.css'
import router from './router'
import store from './store'
import App from './App.vue'

Vue.use(Vuex);
Vue.use(ElementUI);


Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
