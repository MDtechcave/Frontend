<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const isAuthenticated = ref(false)

const checkAuth = () => {
  const user = localStorage.getItem('user')

  if(user){
    const userData = JSON.parse(user)
    isAuthenticated.value = !!userData?.id
  }else{
    isAuthenticated.value = false
  }
}

const handleLogout = () => {
  localStorage.removeItem('user')
  isAuthenticated.value = false
  router.push('/')
}

const handleLogin = () => router.push('/login')
const handleSignup = () => router.push('/register')

onMounted(checkAuth)
</script>

<template>
<nav class="navbar">

  <div class="nav-container">

    <router-link to="/" class="nav-logo">
      <img src="@/assets/logo.png" class="logo-img">
      Healthy Habits
    </router-link>

    <div class="nav-links">

      <router-link to="/" class="nav-link">Home</router-link>
      <router-link to="/mealplan" class="nav-link">Meal Plans</router-link>
      <router-link to="/contact" class="nav-link">Contact</router-link>
      <router-link to="/cart" class="nav-link">Cart</router-link>

    </div>

    <div class="nav-auth">

      <template v-if="isAuthenticated">

        <button class="nav-btn logout-btn"
        @click="handleLogout">
          Logout
        </button>

      </template>

      <template v-else>

        <button class="nav-btn login-btn"
        @click="handleLogin">
          Login
        </button>

        <button class="nav-btn register-btn"
        @click="handleSignup">
          Sign Up
        </button>

      </template>

    </div>

  </div>

</nav>
</template>

<style scoped>

.navbar{
  position:sticky;
  top:0;
  z-index:1000;

  background:rgba(255,255,255,0.95);
  backdrop-filter:blur(10px);

  box-shadow:0 2px 10px rgba(0,0,0,0.08);
}

.nav-container{
  max-width:1200px;
  margin:auto;
  padding:14px 30px;

  display:flex;
  align-items:center;
  justify-content:space-between;
}

.nav-logo{
  display:flex;
  align-items:center;
  gap:10px;

  text-decoration:none;
  font-weight:700;
  color:#2E7D32;
}

.logo-img{
  width:40px;
}

.nav-links{
  display:flex;
  gap:25px;
}

.nav-link{
  text-decoration:none;
  color:#333;
  font-weight:500;
}

.nav-link:hover{
  color:#2E7D32;
}

.nav-auth{
  display:flex;
  gap:10px;
}

.nav-btn{
  padding:8px 18px;
  border-radius:20px;
  border:none;
  cursor:pointer;
}

.login-btn{
  border:2px solid #2E7D32;
  background:transparent;
  color:#2E7D32;
}

.register-btn{
  background:#F57C00;
  color:white;
}

.logout-btn{
  background:#d32f2f;
  color:white;
}

/* Mobile */

@media (max-width:768px){

.nav-container{
  flex-wrap:wrap;
  gap:15px;
}

.nav-links{
  width:100%;
  justify-content:center;
}

}

</style>