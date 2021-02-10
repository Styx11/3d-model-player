import { RouteRecordRaw } from 'vue-router'
import Login from '@/pages/login/Login.vue'
import LoginHome from '@/pages/login/components/LoginHome.vue'

const routes: Array<RouteRecordRaw> = [
	{
		path: '/',
		name: 'Login',
		component: Login,
		children: [
			{ path: '', name: 'LoginHome', component: LoginHome },
		]
	},
	{
		path: '/home',
		name: 'Home',
		// route level code-splitting
		// this generates a separate chunk (about.[hash].js) for this route
		// which is lazy-loaded when the route is visited.
		component: () => import(/* webpackChunkName: "home" */ '@/pages/home/Home.vue'),
	},

	// will match everything and put it under `$route.params.pathMatch`
	{ path: '/:pathMatch(.*)*', redirect: '/home' },
]

export default routes
