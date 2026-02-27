import { createRouter, createWebHistory } from 'vue-router'

// Views
import HomeView from '../views/HomeView.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import MealPlanView from '../views/MealPlanView.vue'
import CartPage from '../views/CartPage.vue'
import CheckoutPage from '../views/CheckoutPage.vue'
import PaymentPage from '../views/PaymentPage.vue'
import Packages from '../views/Packages.vue'
import Admin from '../views/Admin.vue'
import UserManagement from '../views/UserManagement.vue'
import MealManagement from '../views/MealManagement.vue'
import Success from '../views/Success.vue'
import Contact from '../views/Contact.vue'
import Profile from '../views/Profile.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: { requiresAuth: true, role: 'USER' }
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: { guestOnly: true }
  },
  {
    path: '/register',
    name: 'register',
    component: Register,
  },
  {
    path: '/profile',
    name: 'profile',
    component: Profile,
  },
  {
    path: '/success',
    name: 'success',
    component: Success,
    meta: { public: true }
  },
  {
    path: '/mealplan',
    name: 'mealplan',
    component: MealPlanView,
    meta: { requiresAuth: true, role: 'USER' }
  },
  {
    path: '/packages',
    name: 'packages',
    component: Packages,
    meta: { requiresAuth: true, role: 'USER' }
  },
  {
    path: '/cart',
    name: 'cart',
    component: CartPage,
    meta: { requiresAuth: true, role: 'USER' }
  },
  {
    path: '/checkout',
    name: 'checkout',
    component: CheckoutPage,
    meta: { requiresAuth: true, role: 'USER' }
  },
  {
    path: '/payment',
    name: 'payment',
    component: PaymentPage,
    meta: { requiresAuth: true, role: 'USER' }
  },
  {
    path: '/contact',
    name: 'contact',
    component: Contact,
    meta: { requiresAuth: true, role: 'USER' }
  },
  {
    path: '/events',
    name: 'events',
    component: () => import('../views/Events.vue')
  },

  // Admin routes
  {
    path: '/admin',
    name: 'admin',
    component: Admin,
    meta: { requiresAuth: true, role: 'ADMIN' }
  },
  {
    path: '/admin/users',      // ✅ fixed from '/user'
    name: 'user',
    component: UserManagement,
    meta: { requiresAuth: true, role: 'ADMIN' }
  },
  {
    path: '/admin/meals',      // ✅ fixed from '/meal'
    name: 'meal',
    component: MealManagement,
    meta: { requiresAuth: true, role: 'ADMIN' }
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const stored = localStorage.getItem('user')
  const user = stored ? JSON.parse(stored) : null

  if (to.meta.requiresAuth && !user) {
    return next('/login')
  }

  if (to.meta.guestOnly && user) {
    return next(user.role === 'ADMIN' ? '/admin' : '/')
  }

  if (to.meta.role && user && user.role !== to.meta.role) {
    return next(user.role === 'ADMIN' ? '/admin' : '/')
  }

  next()
})

export default router