import Vue from 'vue'
import VueRouter from 'vue-router'
const Home = () =>import('../views/Home/Home')
const SellerPage = () => import('../views/Seller/SellerPage')
const TrendPage = ()=> import('../views/Trend/TrendPage')
const MapPage = () => import('../views/Map/MapPage')
const RankPage = () => import('../views/Rank/RankPage')
const HotPage = () => import('../views/Hot/HotPage')
const StockPage = () => import('../views/Stock/StockPage')

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
  {
    path: '/RankPage',
    name: 'RankPage',
    component: RankPage
  },
  {
    path: '/HotPage',
    name: 'HotPage',
    component: HotPage
  },
  {
    path: '/StockPage',
    name: 'StockPage',
    component: StockPage
  },

]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
