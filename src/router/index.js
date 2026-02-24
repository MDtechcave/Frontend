import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import MealPlanView from '../views/MealPlanView.vue'
import CartPage from '../views/CartPage.vue'
import CheckoutPage from '../views/CheckoutPage.vue'
import PaymentPage from '../views/PaymentPage.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
   
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/register',
    name: 'register',
    component: Register
  },
  {
    path: '/mealplan',
    name: 'mealplan',
    component: MealPlanView,
    
  },

 {
    path: '/cart',
    name: 'cart',
    component: CartPage,
    
  },

   {
    path: '/checkout',
    name: 'checkout',
    component: CheckoutPage,
    
  },
  
   {
    path: '/payment',
    name: 'payment',
    component: PaymentPage,
    
  },

  
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 🔐 Route Guard
router.beforeEach((to, from, next) => {
  const user = localStorage.getItem('user')

  if (to.meta.requiresAuth && !user) {
    next('/login')
  } else {
    next()
  }
})

export default router
