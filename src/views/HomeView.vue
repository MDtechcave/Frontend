<script setup>
import NavBar from '../components/NavBar.vue'
import Footer from '../components/Footer.vue'
import { ref, onMounted, computed } from 'vue'
import {useRouter} from 'vue-router';
import Sidebar from '@/components/Sidebar.vue'

const router = useRouter()
const meals = ref([])
const loading = ref(true)
const error = ref(null)

const fallbackImage = 'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=600'

function getMealImage(meal) {
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

    const response = await fetch('http://localhost:2534/api/meals')

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    if (Array.isArray(data)) {
      meals.value = data
    } else {
      throw new Error('Data is not an array')
    }

  } catch (err) {
    console.error('Error fetching meals:', err)
    error.value = `Could not load meals: ${err.message}`
  } finally {
    loading.value = false
  }
}

const goToMealPlan = () => {
  router.push('/mealplan')
}

const mealsByType = computed(() => {
  const grouped = { Breakfast: [], Lunch: [], Supper: [], Snack: [] }

  meals.value.forEach(meal => {
    const type = meal.meal_type || 'Snack'
    if (grouped[type]) grouped[type].push(meal)
  })

  return grouped
})

onMounted(fetchRandomMeals)
</script>

<template>
  <NavBar />
  <Sidebar />

  <section class="home-section">
    <div class="home-content">
      <h1>Healthy Meals by Healthy Habits</h1>
      <p>Fresh, nutritious meals delivered to your door</p>

      <button class="home-button primary" @click="goToMealPlan">
        Choose Your Meal Plan
      </button>
    </div>
  </section>

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
      </div>

      <div v-else>
        <template v-for="(mealGroup, type) in mealsByType" :key="type">
          <div v-if="mealGroup.length" class="meal-type-section">

            <h3 class="meal-type-title">{{ type }}</h3>

            <div class="meals-grid">

              <div v-for="meal in mealGroup"
                   :key="meal.meal_id"
                   class="meal-card">

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

                </div>
              </div>

            </div>

          </div>
        </template>
      </div>

    </section>

    <section class="why-choose-us">

      <h2>Why Choose Us</h2>

      <div class="features-grid">

        <div class="feature-card">
          <h3>Safe and Registered</h3>
          <p>We are fully licensed and have an inspected kitchen</p>
        </div>

        <div class="feature-card">
          <h3>Fresh Healthy Meals</h3>
          <p>Made with only fresh and quality ingredients</p>
        </div>

        <div class="feature-card">
          <h3>Fast Delivery</h3>
          <p>Hot meals delivered to your door</p>
        </div>

      </div>

    </section>
  </main>

  <Footer />
</template>

<style scoped>

.home-section{
  width:100%;
  min-height:60vh;

  background-image:url('@/assets/background.avif');
  background-size:cover;
  background-position:center;

  display:flex;
  align-items:center;
  justify-content:center;

  padding-top:100px;

  position:relative;
}

.home-section::before{
  content:"";
  position:absolute;
  inset:0;
  background:rgba(0,0,0,0.4);
}

.home-content{
  position:relative;
  text-align:center;
  color:white;
  max-width:800px;
}

.home-content h1{
  font-size:clamp(28px,5vw,48px);
  font-weight:700;
}

.home-content p{
  margin-top:10px;
  font-size:18px;
}

.home-button{
  margin-top:20px;
  padding:12px 28px;
  border-radius:25px;
  border:none;
  background:#4CAF50;
  color:white;
  font-weight:600;
  cursor:pointer;
}

.home-button:hover{
  background:#43a047;
}

main{
  padding:60px 10%;
  background:#f9f9f9;
}

.meals-grid{
  display:grid;
  grid-template-columns:repeat(auto-fit,minmax(280px,1fr));
  gap:2rem;
}

.meal-card{
  background:white;
  border-radius:12px;
  overflow:hidden;
  box-shadow:0 4px 15px rgba(0,0,0,0.1);
}

.meal-image{
  width:100%;
  height:220px;
  object-fit:cover;
}

.meal-info{
  padding:20px;
}

.nutrition-info{
  display:flex;
  gap:10px;
  margin-top:10px;
}

.nutrient{
  background:#eee;
  padding:5px 10px;
  border-radius:20px;
  font-size:12px;
}

.features-grid{
  margin-top:40px;
  display:grid;
  grid-template-columns:repeat(auto-fit,minmax(250px,1fr));
  gap:2rem;
}

.feature-card{
  background:white;
  padding:30px;
  border-radius:12px;
}

</style>
