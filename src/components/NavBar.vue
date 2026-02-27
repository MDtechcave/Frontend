<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const isAuthenticated = ref(false)
const userName = ref('')

// ✅ Check auth state from localStorage
const checkAuth = () => {
  const user = localStorage.getItem('user')
  
  console.log('🔍 NavBar checkAuth - localStorage user:', user)
  
  if (user) {
    try {
      const userData = JSON.parse(user)
      console.log('✅ Parsed userData:', userData)
      console.log('✅ Has id?', !!userData?.id)
      
      // ✅ Must have 'id' to be considered logged in
      isAuthenticated.value = !!userData?.id
      userName.value = userData?.name || userData?.username || 'User'
      
      console.log('✅ isAuthenticated:', isAuthenticated.value)
      console.log('✅ userName:', userName.value)
    } catch (e) {
      console.error('❌ Failed to parse user:', e)
      isAuthenticated.value = false
      userName.value = ''
    }
  } else {
    console.log('⚠️ No user in localStorage')
    isAuthenticated.value = false
    userName.value = ''
  }
}

// ✅ Listen for localStorage changes
const handleStorageChange = (e) => {
  console.log('🔄 Storage event:', e.key, e.newValue)
  if (e.key === 'user' || e.key === 'token') {
    checkAuth()
  }
}

// ✅ Logout handler
const handleLogout = () => {
  localStorage.removeItem('user')
  localStorage.removeItem('token')
  isAuthenticated.value = false
  userName.value = ''
  
  window.dispatchEvent(new Event('storage'))
  router.push('/')
}

const handleLogin = () => router.push('/login')
const handleSignup = () => router.push('/register')

// ✅ Lifecycle
onMounted(() => {
  checkAuth()
  window.addEventListener('storage', handleStorageChange)
  
  // ✅ Check auth on every route change
  router.afterEach(() => {
    console.log('🔄 Route changed, checking auth...')
    setTimeout(checkAuth, 100) // Small delay to ensure storage is updated
  })
})

onUnmounted(() => {
  window.removeEventListener('storage', handleStorageChange)
})
</script>

<template>
  <nav class="navbar">
    <div class="nav-container">

      <!-- Logo -->
      <router-link to="/" class="nav-logo">
        <img src="@/assets/logo.png" class="logo-img" alt="Logo">
        Healthy Habits
      </router-link>

      <!-- Navigation Links -->
      <div class="nav-links">
        <router-link to="/" class="nav-link">Home</router-link>
        <router-link to="/mealplan" class="nav-link">Meal Plans</router-link>
        <router-link to="/contact" class="nav-link">Contact</router-link>
        <router-link to="/cart" class="nav-link">Cart</router-link>
        <router-link to="/profile" class="nav-link">Profile</router-link>
      </div>

      <!-- Auth Section -->
      <div class="nav-auth">

        <!-- ✅ LOGGED IN: Show welcome + logout -->
        <template v-if="isAuthenticated">
          <span class="user-greeting">Welcome, {{ userName }} 👋</span>
          <button class="nav-btn logout-btn" @click="handleLogout">
            Logout
          </button>
        </template>

        <!-- ✅ NOT LOGGED IN: Show login + signup -->
        <template v-else>
          <button class="nav-btn login-btn" @click="handleLogin">
            Login
          </button>
          <button class="nav-btn register-btn" @click="handleSignup">
            Sign Up
          </button>
        </template>

      </div>

    </div>
  </nav>
</template>

<style scoped>
.navbar {
  position: sticky;
  top: 0;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
}

.nav-container {
  max-width: 1200px;
  margin: auto;
  padding: 14px 30px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.nav-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  font-weight: 700;
  color: #2E7D32;
}

.logo-img {
  width: 40px;
}

.nav-links {
  display: flex;
  gap: 25px;
}

.nav-link {
  text-decoration: none;
  color: #333;
  font-weight: 500;
}

.nav-link:hover {
  color: #2E7D32;
}

.nav-auth {
  display: flex;
  align-items: center;
  gap: 10px;
}

.user-greeting {
  font-size: 14px;
  color: #555;
  margin-right: 8px;
  font-weight: 500;
}

.nav-btn {
  padding: 8px 18px;
  border-radius: 20px;
  border: none;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: 0.2s;
}

.login-btn {
  border: 2px solid #2E7D32;
  background: transparent;
  color: #2E7D32;
}

.login-btn:hover {
  background: #e8f5e9;
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
    gap: 15px;
  }
  .nav-links {
    width: 100%;
    justify-content: center;
    order: 3;
  }
  .nav-auth {
    order: 2;
    width: 100%;
    justify-content: center;
  }
}
</style>