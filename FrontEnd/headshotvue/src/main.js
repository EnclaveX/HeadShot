import Vue from 'vue'
import VueI18n from 'vue-i18n'
import Toasted from 'vue-toasted';
import vuetify from '@/plugins/vuetify'
import App from './App'
import router from './router'
import store from './store'
import messages from './locales/index.js'
import './config/msgs'
import './config/axios'

Vue.use(VueI18n)
Vue.use(Toasted)

let locale

if (!localStorage.getItem('HeadShotLocale')) {
	locale = 'pt'

	localStorage.setItem("HeadShotLocale", locale);
} else {
	locale = localStorage.getItem("HeadShotLocale");
}

const i18n = new VueI18n({
	locale: locale,
	messages
})

Vue.config.productionTip = false

const ignoreWarnMessage = 'The .native modifier for v-on is only valid on components but it was used on <svg>.';

Vue.config.warnHandler = function (msg, vm, trace) {
	if (msg === ignoreWarnMessage) {
		msg = null;
		vm = null;
		trace = null;
	}
}

new Vue({
	router,
	store,
	vuetify,
	i18n,
	render: h => h(App)
}).$mount('#app')

