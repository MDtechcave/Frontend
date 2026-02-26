<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import NavBar from '../components/NavBar.vue'
import Footer from '../components/Footer.vue'
import Sidebar from '@/components/Sidebar.vue'

const route = useRoute()
const meals = ref([])
const loading = ref(true)
const goalName = ref('')
const goalDisplayName = ref('')

const fetchMealsByGoal = async () => {
  try {
    loading.value = true
    goalName.value = route.params.goal
    goalDisplayName.value = route.params.goal.replace(/_/g, ' ')
    
    const response = await fetch(`http://localhost:2534/api/goals/${route.params.goal}/meals`)
    const data = await response.json()
    meals.value = data
  } catch (error) {
    console.error('Error fetching meals:', error)
  } finally {
    loading.value = false
  }
}

const refreshMeals = () => {
  fetchMealsByGoal()
}

onMounted(() => {
  fetchMealsByGoal()
})
</script>

<template>
  <div class="meal-plans-page">
    <NavBar />
    <Sidebar />

    <section class="plans-hero">
      <h1>{{ goalDisplayName }} Meal Plan</h1>
      <p>Here are the best meals for your {{ goalDisplayName }} journey</p>
      <button @click="refreshMeals" class="refresh-btn">Show Different Meals</button>
    </section>

    <section class="meals-section">
      <div v-if="loading" class="loading">
        <div class="spinner"></div>
        <p>Loading meals...</p>
      </div>

      <div v-else-if="meals.length === 0" class="no-meals">
        <p> No meals available for this goal yet.</p>
        <p>Check back later or try a different goal!</p>
      </div>

      <div v-else class="meals-grid">
        <div v-for="meal in meals" :key="meal.meal_id" class="meal-card">
          <img 
            :src="meal.image_url || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500'" 
            :alt="meal.meal_name"
            class="meal-image"
          />
          <div class="meal-info">
            <span class="meal-type">{{ meal.meal_type }}</span>
            <h3>{{ meal.meal_name }}</h3>
            <p>{{ meal.description }}</p>
            
            <div class="nutrition-info">
              <span class="nutrient"> {{ meal.calories }} cal</span>
              <span class="nutrient"> {{ meal.carbs }}g carbs</span>
              <span class="nutrient"> {{ meal.protein }}g protein</span>
            </div>

            <div v-if="meal.ingredients" class="ingredients">
              <strong>Ingredients:</strong> {{ meal.ingredients }}
            </div>

            <div v-if="meal.drinks" class="drinks">
              <strong>Pair with:</strong> {{ meal.drinks }}
            </div>

            <button class="add-btn">Add to Plan</button>
          </div>
        </div>
      </div>
    </section>

    <Footer />
  </div>
</template>

<style scoped>
.meal-plans-page {
  min-height: 100vh;
}

.plans-hero {
  text-align: center;
  padding: 60px 20px;
  background: linear-gradient(135deg, #80df83 0%, #215a24 100%);
  color: white;
}

.plans-hero h1 {
  font-size: 36px;
  margin-bottom: 10px;
}

.plans-hero p {
  font-size: 16px;
  opacity: 0.9;
  margin-bottom: 20px;
}

.refresh-btn {
  padding: 12px 30px;
  background: white;
  color: #4CAF50;
  border: none;
  border-radius: 25px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.3s ease;
}

.refresh-btn:hover {
  transform: scale(1.05);
}

.meals-section {
  padding: 60px 10%;
  background: #f9f9f9;
}

.meals-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 2rem;
  margin-top: 40px;
}

.meal-card {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  background: white;
  transition: transform 0.3s ease;
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
}

.meal-type {
  display: inline-block;
  background: #667eea;
  color: white;
  padding: 4px 12px;
  border-radius: 15px;
  font-size: 12px;
  margin-bottom: 10px;
}

.meal-info h3 {
  margin: 0 0 0.5rem 0;
  color: #333;
  font-size: 20px;
}

.meal-info p {
  color: #666;
  font-size: 14px;
  margin-bottom: 1rem;
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

.add-btn {
  width: 100%;
  padding: 12px;
  background: #4CAF50;
  border: none;
  color: white;
  border-radius: 25px;
  cursor: pointer;
  transition: 0.3s ease;
  font-size: 14px;
  font-weight: 600;
  margin-top: 10px;
}

.add-btn:hover {
  background: #43a047;
}

.loading, .no-meals {
  text-align: center;
  padding: 60px 0;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid #4CAF50;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
