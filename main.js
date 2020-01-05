import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false

Vue.prototype.CUSTOM_BASE_URL = 'http://aktq8s.natappfree.cc';

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
