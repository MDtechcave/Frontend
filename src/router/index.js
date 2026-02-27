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
import Contact from '../views/Contact.vue'
import Sidebar from '../components/Sidebar.vue'
import Events from '../views/Events.vue'
import Donations from '../views/Donations.vue'
import Support from '../views/Support.vue'

const routes = [

  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: { guestOnly: true } // logged-in users get redirected away
  },
  {
    path: '/register',
    name: 'register',
    component: Register,
    meta: { guestOnly: true } // customers only, admins don't register
  },

  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: { requiresAuth: true, role: 'USER' }
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
    name: 'Contact',
    component: Contact,
    meta: { requiresAuth: true, role: 'USER' }
  },
  {
    path: '/success',
    name: 'success',
    component: Success,
    meta: { requiresAuth: true, role: 'USER' }
  },

  {
    path: '/admin',
    name: 'admin',
    component: Admin,
    meta: { requiresAuth: true, role: 'ADMIN' }
  },
  {
    path: '/user',
    name: 'user',
    component: UserManagement,
    meta: { requiresAuth: true, role: 'ADMIN' }
  },
  {
    path: '/meal',
    name: 'meal',
    component: MealManagement,
    meta: { requiresAuth: true, role: 'ADMIN' }
  },
  {
    path: '/sidebar',
    name: 'SideBar',
    component: Sidebar,
    meta: { requiresAuth: true, role: 'ADMIN' }
  },

{
  path: '/events',
  name: 'events',
  component: () => import('../views/Events.vue')
},
{
  path: '/donations',
  name: 'Donations',
  component: Donations,
  meta: { requiresAuth: true, role: 'ADMIN' }

},
{
  path: '/support',
  name: 'Support',
  component: Support,
  meta: { requiresAuth: true, role: 'ADMIN' }

}
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