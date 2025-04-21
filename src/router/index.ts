import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', redirect: '/products' },
  {
    path: '/orders',
    component: () => import('@/pages/OrdersPage.vue'),
  },
  {
    path: '/products',
    component: () => import('@/pages/ProductsPage.vue'),
  },
]

export default createRouter({
  history: createWebHistory(),
  routes,
})
