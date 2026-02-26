<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import NavBar from '../components/NavBar.vue'
import Footer from '../components/Footer.vue'
import Sidebar from '@/components/Sidebar.vue'

const router = useRouter()
const route = useRoute()
const packages = ref([])
const loading = ref(true)
const error = ref(null)

const API_URL = import.meta.env.VITE_API_URL

onMounted(async () => {
  try {
    const goal_id = route.query.goal_id
    if (!goal_id) {
      router.push('/mealplan')
      return
    }
    const res = await fetch(`${API_URL}/api/packages?goal_id=${goal_id}`)
    const data = await res.json()
    packages.value = data
  } catch (err) {
    error.value = 'Failed to load packages.'
  } finally {
    loading.value = false
  }
})

const addToCart = async (pkg) => {
  try {
    const user = JSON.parse(localStorage.getItem('user'))
    if (!user) {
      router.push('/login')
      return
    }

    // Create subscription in DB
    const res = await fetch(`${API_URL}/api/subscription`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: user.user_id,
        package_id: pkg.package_id,
        start_date: new Date().toISOString().split('T')[0],
        status: 'active'
      })
    })

    const data = await res.json()

    // Save sub_id to user in localStorage so payment works
    const updatedUser = { ...user, sub_id: data.data?.insertId }
    localStorage.setItem('user', JSON.stringify(updatedUser))

    // Save package to cart
    localStorage.setItem('cart', JSON.stringify([pkg]))

    router.push('/cart')
  } catch (err) {
    alert('Failed to add to cart. Please try again.')
  }
}
</script>

<template>
  <NavBar />
  <Sidebar />
  <div class="packages-page">
    <h1>Choose Your Package</h1>

    <div v-if="loading" class="loading">Loading packages...</div>
    <div v-else-if="error" class="error">{{ error }}</div>

    <div v-else class="packages-grid">
      <div
        v-for="pkg in packages"
        :key="pkg.package_id"
        class="package-card"
      >
        <div class="card-top">
          <h2>{{ pkg.package_name }}</h2>
          <p class="duration">{{ pkg.duration_days }}-day plan</p>
        </div>
        <div class="card-bottom">
          <p class="price">R{{ pkg.price }}</p>
          <button @click="addToCart(pkg)">Add to Cart →</button>
        </div>
      </div>
    </div>
  </div>
  <Footer />
</template>

<style scoped>
.packages-page {
  max-width: 1000px;
  margin: 60px auto;
  padding: 20px;
  font-family: 'Segoe UI', sans-serif;
}

h1 {
  text-align: center;
  color: #2E7D32;
  font-size: 2rem;
  margin-bottom: 2.5rem;
}

.packages-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.package-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: transform 0.2s, box-shadow 0.2s;
}

.package-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 30px rgba(0,0,0,0.12);
}

.card-top {
  padding: 30px;
  background: linear-gradient(135deg, #e8f5e9, #ffffff);
}

.card-bottom {
  padding: 20px 30px 30px;
  text-align: center;
}

h2 {
  color: #2E7D32;
  font-size: 1.3rem;
  margin-bottom: 8px;
}

.duration {
  color: #777;
  font-size: 0.9rem;
}

.price {
  font-size: 2.5rem;
  font-weight: 800;
  color: #2E7D32;
  margin-bottom: 16px;
}

button {
  background: #4CAF50;
  color: white;
  border: none;
  padding: 12px 30px;
  border-radius: 25px;
  font-weight: 700;
  cursor: pointer;
  font-size: 1rem;
  transition: background 0.2s;
  width: 100%;
}

button:hover {
  background: #388E3C;
}

.loading, .error {
  text-align: center;
  padding: 60px;
  font-size: 1.1rem;
  color: #666;
}

.error { color: #d32f2f; }
</style>
