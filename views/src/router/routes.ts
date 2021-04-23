import { RouteRecordRaw } from 'vue-router'
import List from '../pages/list/List.vue'
import Home from '../pages/home/Home.vue'

const routes: Array<RouteRecordRaw> = [
	{
		path: '/',
		name: 'List',
		component: List,
	},
	{
		path: '/home',
		name: 'Home',
		// route level code-splitting
		// this generates a separate chunk (about.[hash].js) for this route
		// which is lazy-loaded when the route is visited.
		component: Home,
	},

	// will match everything and put it under `$route.params.pathMatch`
	{ path: '/:pathMatch(.*)*', redirect: '/' },
]

export default routes
