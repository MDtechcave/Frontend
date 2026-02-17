import { createRouter, createWebHistory } from 'vue-router';
import Login from './components/Login.vue';

import NavBar from './components/NavBar.vue';
import Footer from './components/Footer.vue';
import MealView from '../views/MealView.vue';
import Register from '../views/Register.vue';
import Contact from '../views/Contact.vue';
import Order from '../views/Order.vue';

const routes = [
  { path: '/login', components: Login },
  {path: '/Register', components: Register,
    meta: {requiresAuth: true}
   },
  { path: '/',
     component:NavBar ,
    meta:{requiresAuth: true}
  },
    {path: '/MealView', components: MealView,
    meta: {requiresAuth: true}
   },
  {path: '/GoalView', components: GoalView,
    meta: {requiresAuth: true}
   },
  {path: '/Footer', components: Footer,
    meta: {requiresAuth: true}
   },
    {path: '/Order', components: Order,
    meta: {requiresAuth: true}
   },
     {path: '/Contact', components: Contact,
    meta: {requiresAuth: true}
   },


];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const isloggedIn = localStorage.getItem("user");

  if (to.meta.requiresAuth && !isloggedIn) {
    next('/login'); //sends you to login
  } else {
    next(); //allows access
  }
});

export default router;
