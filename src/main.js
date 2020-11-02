import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import echarts from 'echarts'
import './assets/font/iconfont.css'
import './assets/css/jlobal.less'

axios.defaults.baseURL = 'http://localhost:8888/api/'
Vue.prototype.$http = axios
Vue.config.productionTip = false
Vue.prototype.$echarts = echarts

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
