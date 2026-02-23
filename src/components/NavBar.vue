<!-- src/components/NavBar.vue -->
<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const isAuthenticated = ref(false)

// 🛠️ DEV MODE: Set to true to force logout on every load (for testing)
const DEV_MODE_FORCE_LOGOUT = true

const checkAuth = () => {
  // 🛠️ DEV MODE: Clear localStorage if enabled
  if (DEV_MODE_FORCE_LOGOUT) {
    console.log('🧹 DEV MODE: Clearing localStorage')
    localStorage.removeItem('user')
  }

  const user = localStorage.getItem('user')
  console.log('🔍 localStorage user:', user)
  
  if (user) {
    try {
      const userData = JSON.parse(user)
      // Only authenticate if userData has actual content
      isAuthenticated.value = userData && userData.id ? true : false
      console.log('✅ Auth state:', isAuthenticated.value ? 'LOGGED IN' : 'LOGGED OUT')
    } catch (e) {
      console.error('❌ Invalid user data:', e)
      localStorage.removeItem('user')
      isAuthenticated.value = false
    }
  } else {
    isAuthenticated.value = false
    console.log('🚫 No user - showing Login/Signup')
  }
}

const handleLogout = () => {
  localStorage.removeItem('user')
  isAuthenticated.value = false
  window.dispatchEvent(new Event('storage'))
  router.push('/')
}

const handleLogin = () => {
  router.push('/login')
}

const handleSignup = () => {
  router.push('/register')
}

onMounted(() => {
  checkAuth()
  window.addEventListener('storage', checkAuth)
})

onUnmounted(() => {
  window.removeEventListener('storage', checkAuth)
})
</script>

<template>
  <nav class="navbar">
    <div class="nav-container">
      <!-- Logo -->
      <router-link to="/" class="nav-logo">
        <img src="@/assets/logo.png" alt="Logo" class="logo-img" />
        <span>Healthy Habits</span>
      </router-link>

      <!-- Links -->
      <div class="nav-links">
        <router-link to="/" class="nav-link">Home</router-link>
        <router-link to="/mealplan" class="nav-link">Meal Plans</router-link>
        <!--<router-link to="/about" class="nav-link">About Us</router-link>-->
        <!-- ✅ Fixed: Added leading slash -->
        <router-link to="/mealcard" class="nav-link">Meal Card</router-link>
        <router-link to="/contact" class="nav-link">Contact Us</router-link>
        <router-link to="/cart" class="nav-link">Cart</router-link>
      </div>

      <!-- Auth Buttons -->
      <div class="nav-auth">
        <!-- Logged IN -->
        <template v-if="isAuthenticated">
          <span class="welcome-text">Welcome!</span>
          <button @click="handleLogout" class="nav-btn logout-btn">
            Logout
          </button>
        </template>
        
        <!-- Logged OUT (DEFAULT) -->
        <template v-else>
          <button @click="handleLogin" class="nav-btn login-btn">
            Login
          </button>
          <button @click="handleSignup" class="nav-btn register-btn">
            Sign Up
          </button>
        </template>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  background: rgba(255, 255, 255, 0.91);
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  color: #2E7D32;
  font-weight: 700;
  font-size: 1.2rem;
}

.logo-img {
  width: 40px;
  height: 40px;
  object-fit: contain;
}

.nav-links {
  display: flex;
  gap: 1.5rem;
}

.nav-link {
  text-decoration: none;
  color:#333 ;
  font-weight: 500;
  transition: color 0.3s;
}

.nav-link:hover,
.nav-link.router-link-active {
  color: #2E7D32;
}

.nav-auth {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.welcome-text {
  color: #666;
  font-size: 0.9rem;
}

.nav-btn {
  padding: 8px 20px;
  border: none;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.login-btn {
  background: transparent;
  border: 2px solid #2E7D32;
  color: #2E7D32;
}
.login-btn:hover {
  background: #2E7D32;
  color: white;
}

.register-btn {
  background: #F57C00;
  color: white;
}
.register-btn:hover {
  background: #ef6c00;
}

.logout-btn {
  background: #d32f2f;
  color: white;
}
.logout-btn:hover {
  background: #c62828;
}

/* Mobile */
@media (max-width: 768px) {
  .nav-container {
    flex-wrap: wrap;
    gap: 1rem;
  }
  
  .nav-links {
    order: 3;
    width: 100%;
    justify-content: center;
    padding-top: 1rem;
    border-top: 1px solid #eee;
  }
}
</style>