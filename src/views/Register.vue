<!-- <script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const errorMessage = ref('')
const loading = ref(false)
const street = ref('')
const city = ref('')
const postalCode = ref('')

const API_URL = import.meta.env.VITE_API_URL

const handleRegister = async () => {
  errorMessage.value = ''

  if (!name.value || !email.value || !password.value || !confirmPassword.value) {
    errorMessage.value = 'Please complete all fields.'
    return
  }

  if (password.value !== confirmPassword.value) {
    errorMessage.value = 'Passwords do not match.'
    return
  }

  try {
    loading.value = true
    const res = await fetch(`${API_URL}/api/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: name.value,
        email: email.value,
        password: password.value,
        address: `${street.value}, ${city.value}, ${postalCode.value}`
      })
    })

    const data = await res.json()
    if (!res.ok) {
      errorMessage.value = data.error || 'Registration failed.'
      return
    }

    alert('Registration successful! Please login.')
    router.push('/login')
  } catch (err) {
    errorMessage.value = 'Server error. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="auth-container">
    <div class="auth-card">
      <h2>Create Account</h2>

      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>

      <input type="text" placeholder="Full Name" v-model="name" />
      <input type="email" placeholder="Email" v-model="email" />
      <input type="password" placeholder="Password" v-model="password" />
      <input type="password" placeholder="Confirm Password" v-model="confirmPassword" />
      <input type="text" placeholder="Street Address e.g. 12 Long Street" v-model="street" />
      <input type="text" placeholder="City e.g. Cape Town" v-model="city" />
      <input type="text" placeholder="Postal Code e.g. 8001" v-model="postalCode" />

      <button class="primary-btn" :disabled="loading" @click="handleRegister">
        {{ loading ? 'Registering...' : 'Register' }}
      </button>

      <p class="redirect">
        Already have an account?
        <span class="login-link" @click="router.push('/login')">Login</span>
      </p>
    </div>
  </div>
</template>

<style scoped>
.auth-container {
  min-height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f4f6f5;
}

.auth-card {
  background: white;
  padding: 40px;
  border-radius: 20px;
  width: 400px;
  box-shadow: 0 15px 35px rgba(0,0,0,0.1);
  text-align: center;
}

.auth-card h2 {
  margin-bottom: 25px;
  color: #2E7D32;
}

input {
  width: 100%;
  padding: 12px;
  margin-bottom: 15px;
  border-radius: 10px;
  border: 1px solid #ccc;
  font-size: 14px;
}

.primary-btn {
  width: 100%;
  padding: 12px;
  background: #2E7D32;
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  margin-bottom: 15px;
  font-size: 15px;
  transition: 0.3s;
}

.primary-btn:hover:not(:disabled) {
  background: #1b5e20;
}

.primary-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.redirect {
  margin-top: 18px;
  color: #666;
  font-size: 14px;
}

.login-link {
  color: #2E7D32;
  font-weight: 600;
  cursor: pointer;
  margin-left: 5px;
  transition: 0.2s;
}

.login-link:hover {
  color: #1b5e20;
  text-decoration: underline;
}

.error {
  color: red;
  margin-bottom: 10px;
  font-size: 14px;
}
</style> -->

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const errorMessage = ref('')
const loading = ref(false)
const street = ref('')
const city = ref('')
const postalCode = ref('')

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:2534'

const handleRegister = async () => {
  errorMessage.value = ''

  if (!name.value || !email.value || !password.value || !confirmPassword.value || !street.value || !city.value || !postalCode.value) {
    errorMessage.value = 'Please complete all fields.'
    return
  }

  if (password.value !== confirmPassword.value) {
    errorMessage.value = 'Passwords do not match.'
    return
  }

  try {
    loading.value = true
    const res = await fetch(`${API_URL}/api/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: name.value,
        email: email.value,
        password: password.value,
        address: `${street.value}, ${city.value}, ${postalCode.value}`
        // ✅ No role sent — backend always registers as USER
      })
    })

    const data = await res.json()
    if (!res.ok) {
      errorMessage.value = data.error || 'Registration failed.'
      return
    }

    alert('Registration successful! Please login.')
    router.push('/login')
  } catch (err) {
    errorMessage.value = 'Server error. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="auth-container">
    <div class="auth-card">
      <h2>Create Account</h2>

      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>

      <input type="text" placeholder="Full Name" v-model="name" :disabled="loading" />
      <input type="email" placeholder="Email" v-model="email" :disabled="loading" />
      <input type="password" placeholder="Password" v-model="password" :disabled="loading" />
      <input type="password" placeholder="Confirm Password" v-model="confirmPassword" :disabled="loading" />
      <input type="text" placeholder="Street Address e.g. 12 Long Street" v-model="street" :disabled="loading" />
      <input type="text" placeholder="City e.g. Cape Town" v-model="city" :disabled="loading" />
      <input type="text" placeholder="Postal Code e.g. 8001" v-model="postalCode" :disabled="loading" />

      <button class="primary-btn" :disabled="loading" @click="handleRegister">
        {{ loading ? 'Registering...' : 'Register' }}
      </button>

      <p class="redirect">
        Already have an account?
        <span class="login-link" @click="router.push('/login')">Login</span>
      </p>
    </div>
  </div>
</template>

<style scoped>
.auth-container {
  min-height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f4f6f5;
}

.auth-card {
  background: white;
  padding: 40px;
  border-radius: 20px;
  width: 400px;
  box-shadow: 0 15px 35px rgba(0,0,0,0.1);
  text-align: center;
}

.auth-card h2 {
  margin-bottom: 25px;
  color: #2E7D32;
}

input {
  width: 100%;
  padding: 12px;
  margin-bottom: 15px;
  border-radius: 10px;
  border: 1px solid #ccc;
  font-size: 14px;
  box-sizing: border-box;
}

input:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

.primary-btn {
  width: 100%;
  padding: 12px;
  background: #2E7D32;
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  margin-bottom: 15px;
  font-size: 15px;
  transition: 0.3s;
}

.primary-btn:hover:not(:disabled) {
  background: #1b5e20;
}

.primary-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.redirect {
  margin-top: 18px;
  color: #666;
  font-size: 14px;
}

.login-link {
  color: #2E7D32;
  font-weight: 600;
  cursor: pointer;
  margin-left: 5px;
  transition: 0.2s;
}

.login-link:hover {
  color: #1b5e20;
  text-decoration: underline;
}

.error {
  color: #d32f2f;
  margin-bottom: 10px;
  font-size: 14px;
  background: #ffebee;
  padding: 10px;
  border-radius: 8px;
  border-left: 4px solid #d32f2f;
}
</style>