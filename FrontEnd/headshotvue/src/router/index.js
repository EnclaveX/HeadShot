import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Principal from '../views/Principal.vue'
import Countries from '../components/countries/Countries.vue'
import Teams from '../components/teams/Teams.vue'
import Leagues from '../components/leagues/Leagues.vue'
import Standings from '../components/standings/Standings.vue'
import LoadApis from '../components/loadApis/LoadApis.vue'
import Anothers from '../components/anothers/Anothers.vue'
import { userKey } from '@/global'

Vue.use(VueRouter)

const router = new VueRouter({
	routes: [
		{
			path: '/login',
			name: 'Login',
			component: Principal,
			meta: { requireAuth: false },
		},
		{
			path: '/',
			name: 'Home',
			component: Home,
			meta: { requireAuth: true },
			children: [
				{
					path: 'countries',
					name: 'Countries',
					component: Countries
				},
				{
					path: 'teams',
					name: 'Teams',
					component: Teams
				},
				{
					path: 'leagues',
					name: 'Leagues',
					component: Leagues
				},
				{
					path: 'standings',
					name: 'Standings',
					component: Standings
				},
				{ 
					path: 'loadApis',
					name: 'LoadApis',
					component: LoadApis
				},
				{ 
					path: 'anothers',
					name: 'Anothers',
					component: Anothers
				} 
			]
		},
		{
			path: '/about',
			name: 'About',
			component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
		}
	]
})

router.beforeEach((to, from, next) => {
	const json = localStorage.getItem(userKey)

	if (to.matched[0].meta.requireAuth) {
		const user = JSON.parse(json)

		user ? next() : next({
			path: '/login',
			query: { redirect: to.fullPath }
		})
	} else {
		next()
	}
})

export default router
