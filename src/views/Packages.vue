<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import NavBar from '../components/NavBar.vue'
import Footer from '../components/Footer.vue'
import Sidebar from '../components/Sidebar.vue'

const router = useRouter()
const route = useRoute()

const packages = ref([])
const loading = ref(true)
const error = ref(null)

// i’m not trusting env during a presentation pls 😭
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:2534'

// highlight which card user clicked
const selectedPackageId = ref(null)

/* ---------------------------------------
   SHOW SELECTED GOAL AT THE TOP ✅
---------------------------------------- */

// get selected goal from localStorage (set in MealPlanView)
const selectedGoal = ref(null)

const readSelectedGoal = () => {
  try {
    selectedGoal.value = JSON.parse(localStorage.getItem('selectedGoal') || 'null')
  } catch {
    selectedGoal.value = null
  }
}

// goal name (your DB uses goal_type)
const selectedGoalName = computed(() => {
  return selectedGoal.value?.goal_type || ''
})

const selectedGoalDescription = computed(() => {
  const name = (selectedGoalName.value || '').toLowerCase()

  if (name.includes('weight')) {
    return 'You chose Weight Loss. This plan focuses on portion control + balanced meals to help you stay consistent and reach your goal without extreme dieting.'
  }

  if (name.includes('muscle')) {
    return 'You chose Muscle Gain. These packages are built around higher protein meals and enough fuel to support training and recovery.'
  }

  if (name.includes('health') || name.includes('maintain')) {
    return 'You chose Health Maintenance. This is the balanced option for staying healthy, maintaining weight, and building habits you can actually keep.'
  }

  return 'You chose a goal. Pick a package below to continue.'
})

// small “Step 2 of 2” label
const stepText = computed(() => 'Step 2 of 2')

/* ---------------------------------------
   helpers (small but makes UI feel clean)
---------------------------------------- */

const formatRand = (value) => {
  const num = Number(value || 0)
  return `R${num.toFixed(0)}`
}

const pricePerDay = (pkg) => {
  const days = Number(pkg?.duration_days || 0)
  const price = Number(pkg?.price || 0)
  if (!days) return 0
  return price / days
}

const includesList = (pkg) => {
  const days = Number(pkg?.duration_days || 0)
  return [
    `${days}-day meal plan`,
    'Meals matched to your goal',
    'Simple checkout',
    'Support if you need help'
  ]
}

// best value = cheapest per day (easy to explain)
const bestValueId = computed(() => {
  if (!packages.value.length) return null
  const sorted = [...packages.value].sort((a, b) => pricePerDay(a) - pricePerDay(b))
  return sorted[0]?.package_id || null
})

// most popular = middle priced (common UX trick)
const mostPopularId = computed(() => {
  if (packages.value.length < 2) return null
  const sorted = [...packages.value].sort((a, b) => Number(a.price || 0) - Number(b.price || 0))
  return sorted[Math.floor(sorted.length / 2)]?.package_id || null
})

/* ---------------------------------------
   load packages
---------------------------------------- */

onMounted(async () => {
  readSelectedGoal()

  try {
    const goal_id = route.query.goal_id

    // if they came here with no goal_id, send back
    if (!goal_id) {
      router.push('/mealplan')
      return
    }

    const res = await fetch(`${API_URL}/api/packages?goal_id=${goal_id}`)
    const data = await res.json()

    packages.value = Array.isArray(data) ? data : []

    // auto-select first card so the page doesn’t feel empty
    if (packages.value.length) selectedPackageId.value = packages.value[0].package_id
  } catch (err) {
    console.error(err)
    error.value = 'Failed to load packages.'
  } finally {
    loading.value = false
  }
})

/* ---------------------------------------
   add to cart (your logic, kept the same)
---------------------------------------- */
const addToCart = async (pkg) => {
  try {
    const user = JSON.parse(localStorage.getItem('user'))
    if (!user) {
      router.push('/login')
      return
    }

    const res = await fetch(`${API_URL}/api/subscription`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: user.id,
        package_id: pkg.package_id,
        start_date: new Date().toISOString().split('T')[0],
        status: 'active'
      })
    })

    const data = await res.json()

    if (!res.ok) {
      alert(data.error || 'Failed to create subscription.')
      return
    }

    const updatedUser = { ...user, sub_id: data.sub_id }
    localStorage.setItem('user', JSON.stringify(updatedUser))

    // simple cart for now (1 package)
    localStorage.setItem('cart', JSON.stringify([pkg]))

    router.push('/cart')
  } catch (err) {
    console.error(err)
    alert('Failed to add to cart. Please try again.')
  }
}
</script>

<template>
  <NavBar />
  <Sidebar />

  <div class="packages-page">
    <!-- top heading -->
    <div class="top">
      <div>
        <p class="step">{{ stepText }}</p>

        <h1>Choose Your Package</h1>
        <p class="sub">Pick a plan, add it to cart, then checkout.</p>

        <!-- ✅ GOAL CONNECTION HERE -->
        <div v-if="selectedGoalName" class="goal-banner">
          <p class="goal-title">You chose: <span>{{ selectedGoalName }}</span></p>
          <p class="goal-desc">{{ selectedGoalDescription }}</p>
        </div>
      </div>

      <button class="back-btn" @click="router.back()">← Back</button>
    </div>

    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      Loading packages...
    </div>

    <div v-else-if="error" class="error">
      {{ error }}
    </div>

    <div v-else class="packages-grid">
      <div
        v-for="pkg in packages"
        :key="pkg.package_id"
        class="package-card"
        :class="{
          selected: selectedPackageId === pkg.package_id,
          best: bestValueId === pkg.package_id
        }"
        @click="selectedPackageId = pkg.package_id"
        tabindex="0"
        role="button"
        :aria-label="`Select ${pkg.package_name}`"
      >
        <!-- badges -->
        <div class="badges">
          <span v-if="bestValueId === pkg.package_id" class="badge badge-best">🔥 Best Value</span>
          <span v-else-if="mostPopularId === pkg.package_id" class="badge badge-pop">⭐ Most Popular</span>
        </div>

        <div class="card-top">
          <h2>{{ pkg.package_name }}</h2>
          <p class="duration">{{ pkg.duration_days }}-day plan</p>
        </div>

        <div class="card-mid">
          <p class="price">{{ formatRand(pkg.price) }}</p>
          <p class="per-day">~ {{ formatRand(pricePerDay(pkg)) }} / day</p>

          <ul class="includes">
            <li v-for="item in includesList(pkg)" :key="item">✅ {{ item }}</li>
          </ul>
        </div>

        <div class="card-bottom">
          <button class="cta" @click.stop="addToCart(pkg)">
            Add to Cart →
          </button>

          <p v-if="selectedPackageId === pkg.package_id" class="selected-hint">
            Selected ✅
          </p>
        </div>
      </div>
    </div>
  </div>

  <Footer />
</template>

<style scoped>
.packages-page {
  max-width: 1100px;
  margin: 60px auto;
  padding: 20px;
  font-family: 'Segoe UI', sans-serif;
}

.top{
  display:flex;
  align-items:flex-start;
  justify-content:space-between;
  gap:16px;
  margin-bottom: 1.8rem;
}

.step{
  margin:0 0 6px;
  font-weight: 1000;
  color: #215a24;
  background: rgba(76,175,80,0.12);
  display:inline-block;
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 12px;
}

h1 {
  margin: 0;
  color: #2E7D32;
  font-size: clamp(1.8rem, 3vw, 2.2rem);
  font-weight: 1000;
}

.sub{
  margin: 8px 0 0;
  color:#667;
  font-weight: 800;
}

/* ✅ goal banner */
.goal-banner{
  margin-top: 14px;
  padding: 14px 14px;
  border-radius: 14px;
  background: rgba(76,175,80,0.08);
  border: 1px solid rgba(76,175,80,0.18);
}
.goal-title{
  margin: 0;
  font-weight: 1000;
  color:#215a24;
}
.goal-title span{
  color:#2E7D32;
}
.goal-desc{
  margin: 8px 0 0;
  color:#4b5563;
  font-weight: 800;
  line-height: 1.4;
}

.back-btn{
  border:none;
  background:#e8f5e9;
  color:#215a24;
  font-weight: 1000;
  padding: 10px 14px;
  border-radius: 999px;
  cursor:pointer;
}
.back-btn:hover{
  transform: translateY(-1px);
}

.loading, .error {
  text-align: center;
  padding: 60px;
  font-size: 1.1rem;
  color: #666;
}
.error { color: #d32f2f; }

.spinner{
  width: 46px;
  height: 46px;
  border: 4px solid #e0e0e0;
  border-top: 4px solid #4CAF50;
  border-radius: 50%;
  margin: 0 auto 16px;
  animation: spin 1s linear infinite;
}
@keyframes spin{
  0%{ transform: rotate(0deg); }
  100%{ transform: rotate(360deg); }
}

.packages-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(290px, 1fr));
  gap: 1.5rem;
}

.package-card {
  position: relative;
  background: white;
  border-radius: 18px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
  border: 2px solid rgba(0,0,0,0.05);
  cursor:pointer;
}

.package-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 30px rgba(0,0,0,0.12);
}

.package-card.selected{
  border-color: rgba(76,175,80,0.55);
  box-shadow: 0 12px 28px rgba(76,175,80,0.18);
}

.package-card.best{
  border-color: rgba(245,124,0,0.35);
}

.badges{
  position:absolute;
  top: 14px;
  right: 14px;
  display:flex;
  gap:8px;
  z-index: 2;
}

.badge{
  font-weight: 1000;
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 12px;
}
.badge-best{
  background: rgba(245,124,0,0.13);
  color:#ef6c00;
}
.badge-pop{
  background: rgba(33,90,36,0.12);
  color:#215a24;
}

.card-top {
  padding: 28px;
  background: linear-gradient(135deg, #e8f5e9, #ffffff);
}

h2 {
  color: #2E7D32;
  font-size: 1.25rem;
  font-weight: 1000;
  margin: 0 0 8px;
}

.duration {
  color: #777;
  font-size: 0.95rem;
  font-weight: 700;
  margin: 0;
}

.card-mid{
  padding: 18px 28px 0;
}

.price {
  font-size: 2.3rem;
  font-weight: 1000;
  color: #2E7D32;
  margin: 0;
}

.per-day{
  margin: 6px 0 14px;
  color:#667;
  font-weight: 900;
}

.includes{
  list-style: none;
  padding: 0;
  margin: 0 0 18px;
  display: grid;
  gap: 8px;
  color:#374151;
  font-weight: 900;
  font-size: 0.95rem;
}

.card-bottom {
  padding: 0 28px 28px;
  text-align: center;
}

.cta {
  background: #4CAF50;
  color: white;
  border: none;
  padding: 12px 22px;
  border-radius: 999px;
  font-weight: 1000;
  cursor: pointer;
  font-size: 1rem;
  transition: background 0.2s, transform 0.2s;
  width: 100%;
}

.cta:hover {
  background: #388E3C;
  transform: translateY(-2px);
}

.selected-hint{
  margin: 10px 0 0;
  font-size: 12px;
  font-weight: 1000;
  color:#2e7d32;
}

@media (max-width: 768px){
  .packages-page{
    margin: 40px auto;
  }
  .top{
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>