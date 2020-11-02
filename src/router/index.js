import Vue from 'vue'
import VueRouter from 'vue-router'
const Home = () =>import('../views/Home/Home')
const SellerPage = () => import('../views/Seller/SellerPage')
const TrendPage = ()=> import('../views/Trend/TrendPage')
const MapPage = () => import('../views/Map/MapPage')

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/Home'
  },
  {
    path: '/Home',
    name: 'Home',
    component: Home
  },
  {
    path: '/SellerPage',
    name: 'SellerPage',
    component: SellerPage
  },
  {
    path: '/TrendPage',
    name: 'TrendPage',
    component: TrendPage
  },
  {
    path: '/MapPage',
    name: 'MapPage',
    component: MapPage
  },

]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
