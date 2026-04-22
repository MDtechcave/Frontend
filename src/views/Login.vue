<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const email = ref('')
const password = ref('')
const errorMessage = ref('')
const loading = ref(false)
const showPassword = ref('')

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:2534'

const togglePassword = () => {
  showPassword.value = !showPassword.value
}

const handleLogin = async () => {
  errorMessage.value = ''

  // quick validation 
  if (!email.value || !password.value) {
    errorMessage.value = 'Please fill in all fields'
    return
  }

  loading.value = true

  try {
    const res = await fetch(`${API_URL}/api/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: email.value.trim(),
        password: password.value
      })
    })

    const data = await res.json()

    if (!res.ok || !data.success) {
      errorMessage.value = data.message || 'Login failed.'
      return
    }

    // ✅ backend usually returns { user, token }
    const user = data.user || {}

    // ✅ normalize the user object so navbar/sidebar don’t panic
    const userToStore = {
      id: user.id || user.user_id || null,        // prefer real numeric id
      name: user.name || user.username || 'User',
      email: user.email || email.value.trim(),
      role: (user.role || 'USER').toUpperCase()
    }

    // ✅ store user + token ONCE
    localStorage.setItem('user', JSON.stringify(userToStore))
    localStorage.setItem('token', data.token || '')

    // ✅ this is the MAIN thing that updates navbar + sidebar instantly
    window.dispatchEvent(new Event('auth-changed'))

    // ✅ if they were redirected here from a protected page, take them back
    const redirect = route.query.redirect ? String(route.query.redirect) : null

    // ✅ role-based redirect (simple and clean)
    if (userToStore.role === 'ADMIN') {
      router.push('/admin')
    } else if (redirect) {
      router.push(redirect)
    } else {
      router.push('/')
    }

  } catch (err) {
    console.error('Login error:', err)
    errorMessage.value = 'Server error. Please try again.'
  } finally {
    loading.value = false
  }
}

const goToRegister = () => {
  router.push('/register')
}
</script>

<template>
  <div class="auth-container">
    <div class="auth-card">
      <h2>Welcome Back!</h2>
      <img src="@/assets/logo.png" alt="Logo" class="logo" />

      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>

      <input
        type="email"
        placeholder="Email address"
        v-model="email"
        :disabled="loading"
        @keyup.enter="handleLogin"
      />

      <div class="password-wrapper">
        <input
          :type="showPassword ? 'text' : 'password'"
          placeholder="Password"
          v-model="password"
          :disabled="loading"
          @keyup.enter="handleLogin"
        />
        <span class="toggle-password" @click="togglePassword">
          {{ showPassword ? 'Hide' : 'Show' }}
        </span>
      </div>

      <button class="primary-btn" :disabled="loading" @click="handleLogin">
        {{ loading ? 'Logging in...' : 'Login' }}
      </button>

      <hr />

      <p class="redirect-text">Don't have an account?</p>
      <button class="secondary-btn" @click="goToRegister" :disabled="loading">
        Sign Up
      </button>
    </div>
  </div>
</template>

<style scoped>
.logo { width: 140px; margin-bottom: 20px; }

.auth-container {
  min-height: 100vh; display: flex; justify-content: center;
  align-items: center; background: #f4f6f5; padding: 20px;
}
.auth-card {
  background: white; padding: 40px; border-radius: 20px;
  width: 100%; max-width: 420px; box-shadow: 0 15px 35px rgba(0,0,0,0.1);
  text-align: center;
}

.auth-card h2 { margin-bottom: 20px; color: #2E7D32; font-size: 24px; font-weight: 1000; }

input {
  width: 100%;
  padding: 12px;
  margin-bottom: 15px;
  border-radius: 10px;
  border: 1px solid #ccc;
  font-size: 14px;
  box-sizing: border-box;
  font-weight: 700;
}

input:disabled { background-color: #f5f5f5; cursor: not-allowed; }

.password-wrapper { position: relative; margin-bottom: 15px; }
.password-wrapper input { margin-bottom: 0; padding-right: 70px; }

.toggle-password {
  position: absolute; right: 12px; top: 50%;
  transform: translateY(-50%); cursor: pointer;
  font-size: 13px; color: #2E7D32; font-weight: 900;
}

.toggle-password:hover { text-decoration: underline; }

.primary-btn, .secondary-btn {
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-size: 15px;
  transition: 0.3s;
  font-weight: 1000;
}

.primary-btn { background: #2E7D32; color: white; margin-bottom: 15px; }
.primary-btn:hover:not(:disabled) { background: #1b5e20; }
.primary-btn:disabled { opacity: 0.6; cursor: not-allowed; }

.secondary-btn { background: #F57C00; color: white; }
.secondary-btn:hover:not(:disabled) { background: #ef6c00; }

.redirect-text { margin: 10px 0; color: #555; font-size: 14px; font-weight: 800; }
hr { margin: 20px 0; border: none; height: 1px; background: #eee; }

.error {
  color: #d32f2f; margin-bottom: 15px; font-size: 14px;
  background: #ffebee; padding: 10px; border-radius: 8px;
  border-left: 4px solid #d32f2f;
  font-weight: 800;
}

@media (max-width: 480px) {
  .auth-card { padding: 25px; border-radius: 15px; }
  .logo { width: 120px; }
}
</style>