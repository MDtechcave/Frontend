import { createRouter, createWebHistory } from 'vue-router';

import Login from '../views/Login.vue';
import Register from '../views/Register.vue';
import HomeView from '@/views/HomeView.vue';
import MealView from '../views/MealView.vue';
import MealPlanView from '../views/MealPlanView.vue';
import Order from '../views/Order.vue';
import Contact from '../views/Contact.vue';

const routes = [
  { path: '/', redirect: '/login' },

  { path: '/login', component: Login },

  { 
    path: '/register', 
    component: Register
    // ✅ removed requiresAuth
  },

  { 
    path: '/homeview', 
    component: HomeView,
   
  },
  { 
    path: '/mealview', 
    component: MealView,
    meta: { requiresAuth: true }
  },

  { 
    path: '/mealplanview', 
    component: MealPlanView,
    meta: { requiresAuth: true }
  },

  { 
    path: '/order', 
    component: Order,
    meta: { requiresAuth: true }
  },

  { 
    path: '/contact', 
    component: Contact,
    meta: { requiresAuth: true }
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const isLoggedIn = localStorage.getItem('user');

  if (to.meta.requiresAuth && !isLoggedIn) {
    next('/login');
  } else if (to.path === '/login' && isLoggedIn) {
    next('/mealview');
  } else {
    next();
  }
});

export default router;
