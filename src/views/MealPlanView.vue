<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import NavBar from '../components/NavBar.vue'
import Footer from '../components/Footer.vue'

const router = useRouter()
const goals = ref([])
const loading = ref(true)
const error = ref(null) 

const isAuthenticated = computed(() => {
  return !!localStorage.getItem('user')
})

const promptLogin = () => {
  
  router.push(`/login?redirect=${router.currentRoute.value.fullPath}`)
}
const fetchGoals = async () => {
  try {
    loading.value = true
    error.value = null
    const response = await fetch('http://localhost:2534/api/goal')
    
  
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    goals.value = data
  } catch (error) {
    console.error('Error fetching goals:', error)
    error.value = 'Failed to load goals. Please try again later.'
  } finally {
    loading.value = false
  }
}

const selectGoal = (goalName) => {
  if (!isAuthenticated.value) {
  
    router.push(`/login?redirect=${router.currentRoute.value.fullPath}`)
    return
  }
  
 
}


const handleKeydown = (event, goalName) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    selectGoal(goalName)
  }
}

onMounted(() => {
  fetchGoals()
})
</script>

<template>
  <div class="goal-page">
    <NavBar />

    <main class="main-content">
   
      <section class="goal-hero">
        <div class="hero-content">
          <h1 class="hero-title">What's Your Fitness Goal?</h1>
          <p class="hero-subtitle">Choose your goal and we'll create the perfect meal plan for you</p>
        </div>
      </section>

      <section class="goals-section">
    
        <div v-if="loading" class="loading-container">
          <div class="loading-spinner"></div>
          <p class="loading-text">Loading your goals...</p>
        </div>

      
        <div v-else-if="error" class="error-container">
          <p class="error-message">{{ error }}</p>
          <button @click="fetchGoals" class="retry-btn">Try Again</button>
        </div>

       
        <div v-else class="goals-grid">
          <div 
            v-for="(goal, index) in goals" 
            :key="goal.id" 
            class="goal-card"
            :style="{ animationDelay: `${index * 0.1}s` }"
            @click="selectGoal(goal.name)"
            @keydown="handleKeydown($event, goal.name)"
            tabindex="0"
            role="button"
            :aria-label="`Select ${goal.display_name} plan`"
          >
            <div class="card-image-wrapper">
              <img 
                :src="goal.image_url || '/placeholder-goal.jpg'" 
                :alt="goal.display_name" 
                class="goal-image"
                @error="$event.target.src = '/placeholder-goal.jpg'"
              />
              <div class="card-overlay"></div>
            </div>
            
            <div class="card-content">
              <span class="goal-icon" aria-hidden="true">{{ goal.icon }}</span>
              <h2 class="goal-title">{{ goal.display_name }}</h2>
              <p class="goal-description">{{ goal.description }}</p>

<button 
  class="select-btn" 
  @click="isAuthenticated ? selectGoal(goal.name) : promptLogin()"
>
  {{ isAuthenticated ? 'Select This Plan' : 'Select meal plan' }}
  <span class="btn-arrow">→</span>
</button>

<!-- Optional: Add a subtle tooltip or hint -->
<p v-if="!isAuthenticated" class="login-hint">
  <small>Login required to place orders!</small>
</p>
            </div>
          </div>
        </div>
      </section>
    </main>

    <Footer />
  </div>
</template>

<style scoped>
/* Page Layout */
.goal-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
}

/* Hero Section - Fixed and Improved */
.goal-hero {
  width: 100%;
  min-height: 50vh;
  background: linear-gradient(135deg, #80df83 0%, #215a24 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 100px 20px;
  position: relative;
  overflow: hidden;
}

/* Added decorative background element */
.goal-hero::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -10%;
  width: 600px;
  height: 600px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  pointer-events: none;
}

.hero-content {
  position: relative;
  z-index: 1;
  max-width: 800px;
  animation: fadeInUp 0.8s ease;
}

.hero-title {
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 700;
  color: white;
  margin-bottom: 1rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
  line-height: 1.2;
}

.hero-subtitle {
  font-size: clamp(1rem, 2vw, 1.25rem);
  color: rgba(255, 255, 255, 0.95);
  font-weight: 300;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
}

/* Goals Section */
.goals-section {
  padding: 80px 5%;
  background: #f8faf8;
}

/* Loading State - Improved */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100px 20px;
  min-height: 400px;
}

.loading-spinner {
  width: 60px;
  height: 60px;
  border: 4px solid #e0e0e0;
  border-top: 4px solid #4CAF50;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

.loading-text {
  color: #666;
  font-size: 1.1rem;
  animation: pulse 1.5s ease-in-out infinite;
}

/* Error State */
.error-container {
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin: 40px auto;
  max-width: 500px;
}

.error-message {
  color: #d32f2f;
  font-size: 1.1rem;
  margin-bottom: 20px;
}

.retry-btn {
  padding: 12px 30px;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 25px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.retry-btn:hover {
  background: #43a047;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
}

/* Goals Grid - Improved */
.goals-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 2.5rem;
  max-width: 1400px;
  margin: 0 auto;
}

/* Goal Card - Major Improvements */
.goal-card {
  position: relative;
  background: white;
  border-radius: 20px;
  overflow: hidden;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  opacity: 0;
  animation: fadeInUp 0.6s ease forwards;
}

.goal-card:hover {
  transform: translateY(-12px) scale(1.02);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

.goal-card:focus {
  outline: 3px solid #4CAF50;
  outline-offset: 3px;
}

/* Card Image Wrapper */
.card-image-wrapper {
  position: relative;
  height: 250px;
  overflow: hidden;
}

.goal-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.goal-card:hover .goal-image {
  transform: scale(1.1);
}

.card-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to bottom, transparent 0%, rgba(0, 0, 0, 0.4) 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.goal-card:hover .card-overlay {
  opacity: 1;
}

/* Card Content */
.card-content {
  padding: 30px;
  position: relative;
}

.goal-icon {
  font-size: 48px;
  display: block;
  margin-bottom: 15px;
  line-height: 1;
}

.goal-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 12px;
  line-height: 1.3;
}

.goal-description {
  font-size: 0.95rem;
  color: #666;
  line-height: 1.6;
  margin-bottom: 25px;
}

/* Select Button - Improved */
.select-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 14px 32px;
  background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
  color: white;
  border: none;
  border-radius: 30px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(76, 175, 80, 0.3);
}

.select-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(76, 175, 80, 0.4);
  background: linear-gradient(135deg, #45a049 0%, #3d8b40 100%);
}

.btn-arrow {
  transition: transform 0.3s ease;
}

.select-btn:hover .btn-arrow {
  transform: translateX(5px);
}

/* Animations */
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .goal-hero {
    padding: 60px 20px;
    min-height: 40vh;
  }

  .goals-section {
    padding: 40px 4%;
  }

  .goals-grid {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .card-content {
    padding: 25px;
  }

  .goal-title {
    font-size: 1.5rem;
  }
}

@media (max-width: 480px) {
  .hero-title {
    font-size: 2rem;
  }

  .goal-icon {
    font-size: 40px;
  }

  .select-btn {
    width: 100%;
    justify-content: center;
  }
}
</style>
