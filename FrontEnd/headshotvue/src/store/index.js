import Vue from 'vue'
import Vuex from 'vuex'
import users from './modules/users.js'
import standings from './modules/standings.js'

Vue.use(Vuex)

export default new Vuex.Store({
	state: {
	},
	getters: {
	},
	mutations: {
	},
	actions: {
	},
	modules: {
		users,
		standings
	}
})