import { createRouter, createWebHistory } from 'vue-router'
import CurrencySelector from '@/components/CurrencySelector.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: CurrencySelector
    },

  ]
})

export default router
