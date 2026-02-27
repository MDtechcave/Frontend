<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

/*
  i kept this navbar auth check SIMPLE:
  - user is stored in localStorage
  - whenever login/logout happens we trigger a refresh with authTick
  - no random “checkAuth” spaghetti 😭
*/

const authTick = ref(0)
const syncAuth = () => authTick.value++

// read user from localStorage safely
const user = computed(() => {
  authTick.value // dependency so computed re-runs when we tick
  try {
    return JSON.parse(localStorage.getItem('user') || 'null')
  } catch {
    return null
  }
})

// logged in if we have id OR email (some backends return email only)
const isAuthenticated = computed(() => !!user.value?.id || !!user.value?.email)
const userName = computed(() => user.value?.name || user.value?.username || 'User')

// logout
const handleLogout = () => {
  localStorage.removeItem('user')
  localStorage.removeItem('token')

  // tell other components like sidebar/navbar that auth changed
  window.dispatchEvent(new Event('auth-changed'))

  // update navbar state
  syncAuth()

  router.push('/')
}

const handleLogin = () => router.push('/login')
const handleSignup = () => router.push('/register')

onMounted(() => {
  // initial load
  syncAuth()

  // ✅ our own custom event (we dispatch this after login/logout)
  window.addEventListener('auth-changed', syncAuth)

  // ✅ storage event (helps if they login in another tab)
  window.addEventListener('storage', syncAuth)
})

onBeforeUnmount(() => {
  window.removeEventListener('auth-changed', syncAuth)
  window.removeEventListener('storage', syncAuth)
})
</script>

<template>
  <nav class="navbar">
    <div class="nav-container">
      <!-- Logo -->
      <router-link to="/" class="nav-logo">
        <img src="@/assets/logo.png" class="logo-img" alt="Logo" />
        Healthy Habits
      </router-link>

      <!-- Links -->
      <div class="nav-links">
        <router-link to="/" class="nav-link">Home</router-link>
        <router-link to="/mealplan" class="nav-link">Meal Plans</router-link>
        <router-link to="/events" class="nav-link">Events</router-link>
        <router-link to="/contact" class="nav-link">Contact</router-link>
        <router-link to="/cart" class="nav-link">Cart</router-link>
      </div>

      <!-- Auth -->
      <div class="nav-auth">
        <template v-if="isAuthenticated">
          <span class="user-greeting">Welcome, {{ userName }} 👋</span>
          <button class="nav-btn logout-btn" @click="handleLogout">Logout</button>
        </template>

        <template v-else>
          <button class="nav-btn login-btn" @click="handleLogin">Login</button>
          <button class="nav-btn register-btn" @click="handleSignup">Sign Up</button>
        </template>
      </div>
    </div>
  </nav>
</template>

<style>
/*
  navbar notes:
  - sticky on top
  - wraps nicely on small screens
  - z-index is below sidebar drawer (9999) but above page content
*/
.navbar {
  position: sticky;
  top: 0;
  z-index: 2000;
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
  gap: 14px;
}

.nav-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  font-weight: 900;
  color: #2E7D32;
  white-space: nowrap;
}

.logo-img {
  width: 40px;
  height: 40px;
  object-fit: contain;
}

.nav-links {
  display: flex;
  gap: 22px;
  flex-wrap: wrap;
  justify-content: center;
}

.nav-link {
  text-decoration: none;
  color: #333;
  font-weight: 700;
}

.nav-link:hover {
  color: #2E7D32;
}

.nav-auth {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.user-greeting {
  font-size: 14px;
  color: #555;
  font-weight: 700;
}

.nav-btn {
  padding: 8px 18px;
  border-radius: 20px;
  border: none;
  cursor: pointer;
  font-size: 14px;
  font-weight: 800;
  transition: 0.2s;
}

.login-btn {
  border: 2px solid #2E7D32;
  background: transparent;
  color: #2E7D32;
}
.login-btn:hover { background: #e8f5e9; }

.register-btn {
  background: #F57C00;
  color: white;
}
.register-btn:hover { background: #ef6c00; }

.logout-btn {
  background: #d32f2f;
  color: white;
}
.logout-btn:hover { background: #c62828; }

@media (max-width: 768px) {
  .nav-container {
    flex-wrap: wrap;
    justify-content: center;
    padding: 12px 16px;
  }

  .nav-links {
    width: 100%;
    justify-content: center;
    order: 3;
    gap: 14px;
  }

  .nav-auth {
    order: 2;
    width: 100%;
    justify-content: center;
  }

  .nav-logo {
    order: 1;
  }
}
</style>