<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const email = ref('')
const password = ref('')
const role = ref('')  // 'USER' or 'ADMIN'
const errorMessage = ref('')
const loading = ref(false)
const showPassword = ref(false)

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:2534'

const togglePassword = () => {
  showPassword.value = !showPassword.value
}

const handleLogin = async () => {
  errorMessage.value = ''

  // ✅ Fixed: use email.value (not username)
  if (!email.value || !password.value || !role.value) {
    errorMessage.value = 'Please fill in all fields'
    return
  }

  loading.value = true

  try {
    const res = await fetch(`${API_URL}/api/auth/login`, {  // ✅ Updated endpoint
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: email.value,
        password: password.value,
        role: role.value.toUpperCase()  // Ensure uppercase to match DB
      })
    })

    const data = await res.json()
    
    if (!res.ok || !data.success) {
      errorMessage.value = data.message || 'Login failed.'
      return
    }

    // ✅ Store user info
    localStorage.setItem('user', JSON.stringify(data.user))
    
    // ✅ Role-based redirect
    if (data.user.role === 'ADMIN') {
      router.push('/admin')
    } else {
      router.push('/')  // or '/user/home'
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

      <img src="@/assets/logo.png" alt="Healthy Habits Logo" class="logo" />

      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>

      <!-- Email Input -->
      <input
        type="email"
        placeholder="Email"
        v-model="email"
        :disabled="loading"
        @keyup.enter="handleLogin"
      />

      <!-- Password Input with Toggle -->
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

      <!-- ✅ Role Selection Dropdown -->
      <div class="form-group">
        <label>Login As</label>
        <select 
          v-model="role" 
          :disabled="loading"
          class="role-select"
        >
          <option value="" disabled>Select Your Role</option>
          <option value="USER">Customer</option>
          <option value="ADMIN">Admin</option>
        </select>
      </div>

      <!-- Login Button -->
      <button 
        class="primary-btn" 
        :disabled="loading" 
        @click="handleLogin"
      >
        {{ loading ? 'Logging in...' : 'Login' }}
      </button>

      <hr />

      <p class="redirect-text">Don't have an account?</p>

      <button 
        class="secondary-btn" 
        @click="goToRegister"
        :disabled="loading"
      >
        Sign Up
      </button>
    </div>
  </div>
</template>

<style scoped>
.logo {
  width: 140px;
  margin-bottom: 20px;
}

.auth-container {
  min-height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f4f6f5;
  padding: 20px;
}

.auth-card {
  background: white;
  padding: 40px;
  border-radius: 20px;
  width: 100%;
  max-width: 420px;
  box-shadow: 0 15px 35px rgba(0,0,0,0.1);
  text-align: center;
}

.auth-card h2 {
  margin-bottom: 20px;
  color: #2E7D32;
  font-size: 24px;
}

input, select {
  width: 100%;
  padding: 12px;
  margin-bottom: 15px;
  border-radius: 10px;
  border: 1px solid #ccc;
  font-size: 14px;
  box-sizing: border-box;
}

input:disabled, select:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

.password-wrapper {
  position: relative;
  margin-bottom: 15px;
}

.password-wrapper input {
  margin-bottom: 0;
  padding-right: 60px;
}

.toggle-password {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  font-size: 13px;
  color: #2E7D32;
  font-weight: 600;
  user-select: none;
}

.toggle-password:hover {
  text-decoration: underline;
}

/* ✅ Role Select Styling */
.form-group {
  text-align: left;
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 600;
  color: #333;
  font-size: 14px;
}

.role-select {
  width: 100%;
  padding: 12px;
  border-radius: 10px;
  border: 1px solid #ccc;
  font-size: 14px;
  background: white;
  cursor: pointer;
}

.role-select:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

.primary-btn,
.secondary-btn {
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-size: 15px;
  transition: 0.3s;
}

.primary-btn {
  background: #2E7D32;
  color: white;
  margin-bottom: 15px;
}

.primary-btn:hover:not(:disabled) {
  background: #1b5e20;
}

.primary-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.secondary-btn {
  background: #F57C00;
  color: white;
}

.secondary-btn:hover:not(:disabled) {
  background: #ef6c00;
}

.redirect-text {
  margin: 10px 0;
  color: #555;
  font-size: 14px;
}

hr {
  margin: 20px 0;
  border: none;
  height: 1px;
  background: #eee;
}

.error {
  color: #d32f2f;
  margin-bottom: 15px;
  font-size: 14px;
  background: #ffebee;
  padding: 10px;
  border-radius: 8px;
  border-left: 4px solid #d32f2f;
}

@media (max-width: 480px) {
  .auth-card {
    padding: 25px;
    border-radius: 15px;
  }
  .logo {
    width: 120px;
  }
}
</style>