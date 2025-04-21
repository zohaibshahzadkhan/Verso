import { createRouter, createWebHistory } from 'vue-router'
import OrdersPage from '@/pages/OrdersPage.vue'
import ProductsPage from '@/pages/ProductsPage.vue'

const routes = [
  { path: '/', redirect: '/products' },
  { path: '/orders', component: OrdersPage },
  { path: '/products', component: ProductsPage },
]

export default createRouter({
  history: createWebHistory(),
  routes,
})
