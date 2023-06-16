import { createRouter, createWebHistory } from 'vue-router'
import GunttChart from '../views/GunttChart.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: GunttChart
    }
  ]
})

export default router
