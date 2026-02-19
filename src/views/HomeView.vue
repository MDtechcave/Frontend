<script setup>
import NavBar from '../components/NavBar.vue'
import Footer from '../components/Footer.vue'
import { ref, onMounted, computed } from 'vue'
import {useRouter} from 'vue-router';

const router = useRouter()
const meals = ref([])
const loading = ref(true)
const error = ref(null)

// Simple fallback image (only used if database has no image)
const fallbackImage = 'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=600'

function getMealImage(meal) {
  // Return database image_url, or fallback if none exists
  if (meal && meal.image_url) {
    const trimmedUrl = meal.image_url.trim()
    console.log(`🖼️ ${meal.meal_name}:`, trimmedUrl)
    return trimmedUrl
  }
  return fallbackImage
}



const fetchRandomMeals = async () => {
  try {
    loading.value = true
    error.value = null
    
    console.log('🔄 Starting fetch...')

    const response = await fetch('http://localhost:2534/api/home/data', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    
    console.log('📡 Response status:', response.status)
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    console.log('✅ Received', data.length, 'meals')
    
    // Log first few meals to verify
    data.slice(0, 3).forEach(meal => {
      console.log(`🍽️ ${meal.meal_name}:`, {
        meal_id: meal.meal_id,
        image_url: meal.image_url,
        meal_type: meal.meal_type
      })
    })
    
    if (Array.isArray(data)) {
      meals.value = data
    } else {
      throw new Error('Data is not an array')
    }
  } catch (err) {
    console.error('❌ Error fetching meals:', err)
    error.value = `Could not load meals: ${err.message}. Please make sure the backend server is running.`
  } finally {
    loading.value = false
  }
}

const goToMealPlan = () => {
  router.push('/mealplan')
}

const handleLogout = () => {
  localStorage.removeItem('user')
  router.push('/')

}
const mealsByType = computed(() => {
  const mealList = meals.value || []
  
  if (!Array.isArray(mealList) || mealList.length === 0) {
    return { Breakfast: [], Lunch: [], Supper: [], Snack: [] }
  }

  const grouped = { Breakfast: [], Lunch: [], Supper: [], Snack: [] }

  mealList.forEach(meal => {
    if (!meal) return
    const type = meal.meal_type || 'Snack'
    if (grouped.hasOwnProperty(type)) {
      grouped[type].push(meal)
    } else {
      grouped['Snack'].push(meal)
    }
  })

  return grouped
})

onMounted(() => {
  console.log('🚀 Component mounted, fetching meals...')
  fetchRandomMeals()
})
</script>

<template>
  <div class="home-section">
    <NavBar />
    
    <div class="home-content">
      <h1>Healthy Meals by Health Habits</h1>
      <p>Fresh, nutritious meals delivered to your door</p>
      <div class="button-group">
        <button class="home-button primary" @click="goToMealPlan">
  Choose Your Meal Plan
</button>
      </div>
    </div>
  </div>

  <main>
    <section class="meals-section">
      <h2>Browse through our random weekly picks</h2>
      <p class="subtitle">Fresh meals selected just for you!</p>

      <div v-if="loading" class="loading-container">
        <div class="spinner"></div>
        <p>Loading delicious meals...</p>
      </div>

      <div v-else-if="error" class="error-container">
        <p>{{ error }}</p>
        <button @click="fetchRandomMeals" class="retry-button">Try Again</button>
      </div>

      <div v-else-if="meals && meals.length > 0">
        <template v-for="(mealGroup, type) in mealsByType" :key="type">
          <div v-if="mealGroup && mealGroup.length > 0" class="meal-type-section">
            <h3 class="meal-type-title">{{ type }}</h3>
            <div class="meals-grid">
              <div v-for="meal in mealGroup" :key="meal.meal_id" class="meal-card">
                <img 
                  :src="getMealImage(meal)" 
                  :alt="meal.meal_name"
                  class="meal-image"
                />
                <div class="meal-info">
                  <h3>{{ meal.meal_name }}</h3>
                  <p>{{ meal.description }}</p>
                  <div class="nutrition-info">
                    <span class="nutrient">{{ meal.calories }} cal</span>
                    <span class="nutrient">{{ meal.carbs }}g carbs</span>
                    <span class="nutrient">{{ meal.protein }}g protein</span>
                  </div>
                  <div v-if="meal.ingredients" class="ingredients">
                    <strong>Ingredients:</strong> {{ meal.ingredients }}
                  </div>
                  <div v-if="meal.drinks" class="drinks">
                    <strong>Pair with:</strong> {{ meal.drinks }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>
      
      <div v-else-if="!loading" class="no-meals">
        <p>No meals available at the moment.</p>
      </div>
    </section>

    <!-- Why Choose Us Section -->
    <section class="why-choose-us">
      <h2>Why Choose Us</h2>
      <div class="features-grid">
        <div class="feature-card">
          <div class="feature-icon"></div>
          <h3>Safe and Registered</h3>
          <p>We are fully licensed and have an inspected kitchen</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon"></div>
          <h3>Fresh Healthy Meals</h3>
          <p>Made with only fresh and quality ingredients</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon"></div>
          <h3>Fast Delivery</h3>
          <p>Hot meals delivered to your door</p>
        </div>
      </div>
    </section>
  </main>

  <Footer />
</template>

<style scoped>
.home-section {
  width: 100%;
  height: 60vh;
  background-image: url('@/assets/background.avif'); 
  background-size: cover;
  background-position: center;
  position: relative;
  margin: 0;
  padding: 0;
}

.home-section::before {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(
    rgba(0, 0, 0, 0.45),
    rgba(0, 0, 0, 0.25)
  );
  z-index: 1;
}

.home-content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: white;
  z-index: 2;
}

.home-content h1 {
  font-size: 48px;
  font-weight: 700;
  margin-bottom: 10px;
}

.home-content p {
  font-size: 18px;
  opacity: 0.9;
  margin-bottom: 20px;
}

.button-group {
  display: flex;
  gap: 15px;
  justify-content: center;
  margin-top: 20px;
}

.home-button {
  padding: 12px 28px;
  border: none;
  border-radius: 25px;
  font-size: 14px;
  cursor: pointer;
  transition: 0.3s ease;
  font-weight: 600;
}

.home-button.primary {
  background: #4CAF50;
  color: white;
}

.home-button.primary:hover {
  background: #43a047;
}

.home-button.secondary {
  background: transparent;
  border: 2px solid white;
  color: white;
}

.home-button.secondary:hover {
  background: white;
  color: #333;
}

main {
  padding: 60px 10%;
  text-align: center;
  background: #f9f9f9;
}

main h2 {
  font-size: 32px;
  margin-bottom: 20px;
  color: #333;
}

.meals-section {
  margin-bottom: 60px;
}

.subtitle {
  color: #666;
  margin-bottom: 40px;
  font-size: 16px;
}

.meal-type-section {
  margin-bottom: 50px;
  text-align: left;
}

.meal-type-title {
  font-size: 24px;
  color: #333;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 3px solid #4CAF50;
  display: inline-block;
}

.meals-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 30px;
}

.meal-card {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  background: white;
}

.meal-card:hover {
  transform: translateY(-5px);
}

.meal-image {
  width: 100%;
  height: 220px;
  object-fit: cover;
}

.meal-info {
  padding: 1.5rem;
  text-align: left;
}

.meal-info h3 {
  margin: 0 0 0.5rem 0;
  color: #333;
  font-size: 20px;
}

.meal-info p {
  color: #666;
  margin: 0 0 1rem 0;
  font-size: 14px;
  line-height: 1.5;
}

.nutrition-info {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 1rem;
}

.nutrient {
  background: #f0f0f0;
  padding: 5px 10px;
  border-radius: 15px;
  font-size: 13px;
}

.ingredients, .drinks {
  font-size: 13px;
  color: #666;
  margin-bottom: 8px;
  padding: 8px;
  background: #f9f9f9;
  border-radius: 8px;
}

.loading-container,
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 0;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid #4CAF50;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.retry-button {
  margin-top: 20px;
  padding: 12px 28px;
  background: #4CAF50;
  border: none;
  color: white;
  border-radius: 25px;
  font-size: 14px;
  cursor: pointer;
  transition: 0.3s ease;
}

.retry-button:hover {
  background: #43a047;
}

.why-choose-us {
  padding-top: 40px;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-top: 40px;
}

.feature-card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
}

.feature-icon {
  font-size: 48px;
  margin-bottom: 1rem;
}

.feature-card h3 {
  margin: 0 0 0.5rem 0;
  color: #333;
}

.feature-card p {
  color: #666;
  margin: 0;
}

.no-meals {
  padding: 40px;
  text-align: center;
  color: #666;
  font-size: 18px;
}

.logout-btn {
  background: #F57C00;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: 0.3s;
}

.logout-btn:hover {
  background: #ef6c00;
}

</style>