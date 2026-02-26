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
import Admin from '@/views/Admin.vue'
import UserManagement from '@/views/UserManagement.vue'
import MealManagement from '@/views/MealManagement.vue'
import Success from '../views/Success.vue'

const routes = [
  // Public routes
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
    
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
    meta: { public: true }
  },
  
  // Customer routes (any authenticated user)
  {
    path: '/mealplan',
    name: 'mealplan',
    component: MealPlanView,
    meta: { requiresAuth: true }
  },
  {
    path: '/packages',
    name: 'packages',
    component: Packages,
    meta: { requiresAuth: true }
  },
  {
    path: '/cart',
    name: 'cart',
    component: CartPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/checkout',
    name: 'checkout',
    component: CheckoutPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/payment',
    name: 'payment',
    component: PaymentPage,
    meta: { requiresAuth: true }
  },
  
  // Admin-only routes
  {
    path: '/admin',
    name: 'admin',
    component: Admin,
    meta: { requiresAuth: true, role: 'admin' }
  },
  {
    path: '/admin/users',
    name: 'userManagement',
    component: UserManagement,
    meta: { requiresAuth: true, role: 'admin' }
  },
  {
    path: '/admin/meals',
    name: 'mealManagement',
    component: MealManagement,
    meta: { requiresAuth: true, role: 'admin' }
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 🔐 Navigation Guard
router.beforeEach((to, from, next) => {
  const user = JSON.parse(localStorage.getItem('user'))
  const isAuthenticated = !!user
  const userRole = user?.role?.toLowerCase()
  
  // ✅ Public routes - anyone can access
  if (to.meta.public) {
    // If already logged in, redirect to appropriate dashboard
    if (isAuthenticated) {
      if (userRole === 'admin') {
        next('/admin')
      } else {
        next('/')
      }
    } else {
      next()
    }
    return
  }
  
  // ✅ Protected routes - require authentication
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login')
    return
  }
  
  // ✅ Admin-only routes - check role
  if (to.meta.role === 'admin' && userRole !== 'admin') {
    // Not an admin - redirect to customer home
    next('/')
    return
  }
  
  // ✅ Customer trying to access admin routes
  if (to.meta.role && userRole && to.meta.role !== userRole) {
    // Redirect to their appropriate dashboard
    next(userRole === 'admin' ? '/admin' : '/')
    return
  }
  
  // ✅ All checks passed
  next()
})

export default router