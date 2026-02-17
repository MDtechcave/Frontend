<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const errorMessage = ref('')

const router = useRouter()

const handleRegister = () => {
  if (!name.value || !email.value || !password.value || !confirmPassword.value) {
    errorMessage.value = 'Please complete all fields.'
    return
  }

  if (password.value !== confirmPassword.value) {
    errorMessage.value = 'Passwords do not match.'
    return
  }

  alert('Registration successful! Please login.')
  router.push('/')
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

      <button class="primary-btn" @click="handleRegister">
        Register
      </button>

      <p class="redirect">
        Already have an account?
        <span class="login-link" @click="router.push('/')">Login</span>
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
}

.primary-btn:hover {
  background: #1b5e20;
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
}
</style>
