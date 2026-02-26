<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import NavBar from '../components/NavBar.vue'
import Sidebar from '@/components/Sidebar.vue'

const router = useRouter()
const orderCode = ref('')

onMounted(() => {
  orderCode.value = localStorage.getItem('orderCode') || 'N/A'
  localStorage.removeItem('orderCode')
})
</script>

<template>
  <NavBar />
  <Sidebar />
  <div class="success-page">
    <div class="success-card">
      <div class="icon">✅</div>
      <h1>Payment Successful!</h1>
      <p class="message">Your order has been received and will be delivered shortly.</p>

      <div class="order-code-box">
        <p class="code-label">Your Order Code</p>
        <p class="code">{{ orderCode }}</p>
        <p class="code-hint">Show this code to the driver upon delivery</p>
      </div>

      <button @click="router.push('/')">Back to Home</button>
    </div>
  </div>
</template>

<style scoped>
.success-page {
  min-height: 100vh;
  background: #f4f6f5;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  font-family: 'Segoe UI', sans-serif;
}

.success-card {
  background: white;
  border-radius: 20px;
  padding: 50px 40px;
  max-width: 480px;
  width: 100%;
  text-align: center;
  box-shadow: 0 15px 40px rgba(0,0,0,0.1);
}

.icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

h1 {
  color: #2E7D32;
  font-size: 1.8rem;
  margin-bottom: 1rem;
}

.message {
  color: #555;
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 2rem;
}

.order-code-box {
  background: #f0faf0;
  border: 2px dashed #4CAF50;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 2rem;
}

.code-label {
  font-size: 0.8rem;
  color: #777;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 8px;
}

.code {
  font-size: 2rem;
  font-weight: 800;
  color: #2E7D32;
  letter-spacing: 0.15em;
}

.code-hint {
  font-size: 0.78rem;
  color: #999;
  margin-top: 8px;
}

button {
  background: #4CAF50;
  color: white;
  border: none;
  padding: 12px 40px;
  border-radius: 25px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s;
}

button:hover {
  background: #388E3C;
}
</style>
