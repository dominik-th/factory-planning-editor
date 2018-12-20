'use strict';

// fixes IE issues
import 'es6-promise/auto'
import Vue from 'vue'
import VueI18n from 'vue-i18n'
import BootstrapVue from 'bootstrap-vue'
import Notifications from 'vue-notification'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { clearOutdatedStore } from './helpers/persistence'
import messages from './i18n'
import { store } from './store/store';
import App from './App.vue'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

clearOutdatedStore('0.0.1')
library.add(fas)

Vue.component('font-awesome-icon', FontAwesomeIcon)
Vue.use(VueI18n)
Vue.use(BootstrapVue)
Vue.use(Notifications, {componentName: 'AppNotifications'})

const i18n = new VueI18n({
  locale: localStorage.getItem('locale') || 'de-DE', // set locale
  messages, // set locale messages
})

new Vue({
  store, // vuex store
  i18n, // vue-i18n localized content
  render: h => h(App)
}).$mount('#app')
