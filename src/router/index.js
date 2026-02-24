import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import MealPlanView from '../views/MealPlanView.vue'
import Contact from '../views/Contact.vue'
import CartPage from '../views/CartPage.vue'
import MealCard from '../views/MealCard.vue'
import PaymentPage from '@/views/PaymentPage.vue'
import CheckoutPage from '@/views/CheckoutPage.vue'

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
    path: '/contact',
    name: 'Contact',
    component: Contact
  },
  {
    path: '/cart',
    name: 'Cart',
    component: CartPage
  },
  {
    path: '/checkout',
    name: 'Checkout',
    component: CheckoutPage
  },

  {
    path: '/payment',
    name: 'Payment',
    component: PaymentPage
  },
  {
    path: '/mealcard',
    name: 'MealCard',
    component: MealCard
  },
  {
    path: '/mealplan',
    name: 'mealplan',
    component: MealPlanView,
    
  }
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
