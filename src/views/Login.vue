<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const username = ref('')
const password = ref('')
const errorMessage = ref('')
const router = useRouter()
const showPassword = ref(false)

const handleLogin = async () => {
  errorMessage.value = ''
  
  try {
    const response = await fetch('http://localhost:2534/api/user/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: username.value,
        password: password.value
      })
    });

    const showPassword = ref(false)

const togglePassword = () => {
  showPassword.value = !showPassword.value
}


    const data = await response.json();
    
    if (!response.ok) {
      errorMessage.value = data.message || "Login failed";
      return;
    }

    // Save user
    localStorage.setItem('user', JSON.stringify(data.user));
    
    
    const redirect = router.currentRoute.value.query.redirect || '/';
    
  
    router.push(redirect);

  } catch (err) {
    console.error('Login error:', err);
    errorMessage.value = "Server error";
  }
};

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

      <input
        type="text"
        placeholder="Username or Email"
        v-model="username"
      />

      <div class="password-wrapper">
  <input
    :type="showPassword ? 'text' : 'password'"
    placeholder="Password"
    v-model="password"
  />
  <span class="toggle-password" @click="togglePassword">
    {{ showPassword ? 'Hide' : 'Show' }}
  </span>
</div>

      <button class="primary-btn" @click="handleLogin">
        Login
      </button>
      

      <hr />

      <p class="redirect-text">Don't have an account?</p>

      <button class="secondary-btn" @click="goToRegister">
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

input {
  width: 100%;
  padding: 12px;
  margin-bottom: 15px;
  border-radius: 10px;
  border: 1px solid #ccc;
  font-size: 14px;
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

.primary-btn:hover {
  background: #1b5e20;
}

.secondary-btn {
  background: #F57C00;
  color: white;
}

.secondary-btn:hover {
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
  color: red;
  margin-bottom: 10px;
  font-size: 14px;
}


@media (max-width: 480px) {
  .auth-card {
    padding: 25px;
    border-radius: 15px;
  }

  .auth-card h2 {
    font-size: 20px;
  }

  .logo {
    width: 120px;
  }
}


</style>
