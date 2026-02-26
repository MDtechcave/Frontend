import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import MealPlanView from '../views/MealPlanView.vue'
import CartPage from '../views/CartPage.vue'
import CheckoutPage from '../views/CheckoutPage.vue'
import PaymentPage from '../views/PaymentPage.vue'
import Packages from '../views/Packages.vue'
import Admin from '@/views/Admin.vue'
import UserManagement from '@/views/UserManagement.vue'
import MealManagement from '@/views/MealManagement.vue'
import Success from '../views/Success.vue'

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
    path: '/admin',
    name: 'admin',
    component: Admin
  },
  
  {
    path: '/mealplan',
    name: 'mealplan',
    component: MealPlanView,
  },

  {
    path: '/user',
    name: 'user',
    component: UserManagement,
  },
  {
    path: '/meal',
    name: 'meal',
    component: MealManagement,
  },
  {
    path: '/packages',   
    name: 'packages',
    component: Packages,
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
{
  path: '/register',
  name: 'register',
  component: Register,
},
  {
    path: '/success',
    name: 'success',
     component: Success,
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