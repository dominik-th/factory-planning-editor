// fixes IE issues
import 'es6-promise/auto'
import Vue from 'vue'
import VueI18n from 'vue-i18n'
import BootstrapVue from 'bootstrap-vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import messages from './i18n'
import { store } from './store/store';
import App from './App.vue'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

window.$ = require('jquery')
window.joint = require('jointjs')
window.svgPanZoom = require('svg-pan-zoom')

library.add(fas)

Vue.component('font-awesome-icon', FontAwesomeIcon)
Vue.use(VueI18n)
Vue.use(BootstrapVue)
Vue.config.productionTip = false

const i18n = new VueI18n({
  locale: 'de-DE', // set locale
  messages, // set locale messages
})

new Vue({
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')
