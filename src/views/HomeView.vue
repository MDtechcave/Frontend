<script setup>
import NavBar from '../components/NavBar.vue'
import Footer from '../components/Footer.vue'
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import Sidebar from '../components/Sidebar.vue'

const router = useRouter()

// meals state
const meals = ref([])
const loading = ref(true)
const error = ref(null)

// fallback image so cards don't look broken if api image is missing
const fallbackImage = 'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=600'

function getMealImage(meal) {
  // i check if meal has an image_url, otherwise i use a fallback
  if (meal && meal.image_url) {
    const trimmedUrl = meal.image_url.trim()
    console.log(`${meal.meal_name}:`, trimmedUrl)
    return trimmedUrl
  }
  return fallbackImage
}

const fetchRandomMeals = async () => {
  try {
    loading.value = true
    error.value = null

    // i fetch all meals then i group them by type (breakfast/lunch/supper/snack)
  const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:2534'}/api/meals`)
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
  // grouped view so the page looks organised
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

  <!-- HERO -->
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
    <!-- BROWSE -->
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
              <div
                v-for="meal in mealGroup"
                :key="meal.meal_id"
                class="meal-card"
              >
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

    <!-- WHY CHOOSE US -->
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
* { box-sizing: border-box; }

:root{
  --green:#4CAF50;
  --green-dark:#43a047;
  --green-soft:rgba(76,175,80,0.05);
  --green-border:rgba(76,175,80,0.08);
  --bg:#f9f9f9;
  --card:#ffffff;
  --text:#1f2937;
  --muted:#6b7280;

  --shadow: 0 4px 15px rgba(0,0,0,0.10);
  --shadow-hover: 0 18px 45px rgba(0,0,0,0.15);
}

/* ================= HERO ================= */

.home-section{
  width:100%;
  min-height:60vh;
  background-image:url('@/assets/background.avif');
  background-size:cover;
  background-position:center;
  display:flex;
  align-items:center;
  justify-content:center;

  /* keeps it away from the sticky navbar */
  padding-top:100px;

  position:relative;
}

.home-section::before{
  content:"";
  position:absolute;
  inset:0;
  background:rgba(0,0,0,0.45);
}

.home-content{
  position:relative;
  text-align:center;
  color:white;
  max-width:800px;
  padding:0 16px;
}

/*
  FIX:
  my h1 was getting way too big when i resized laptop screen.
  so i toned down the vw scaling + added line-height.
*/
.home-content h1{
  font-size: clamp(26px, 3.2vw, 44px);
  font-weight: 900;
  letter-spacing: .4px;
  line-height: 1.08;
  margin: 0;
}

.home-content p{
  margin-top:12px;
  font-size:18px;
}

.home-button{
  margin-top:24px;
  padding:14px 30px;
  border-radius:30px;
  border:none;
  background:var(--green);
  color:white;
  font-weight:800;
  cursor:pointer;
  transition:all .2s ease;
}

.home-button:hover{
  background:var(--green-dark);
  transform:translateY(-2px);
  box-shadow:0 10px 25px rgba(67,160,71,0.35);
}

/* ================= MAIN ================= */

main{
  padding:70px 10%;
  background:var(--bg);
}

/* Section Headings */
.meals-section{
  text-align:center;
}

.meals-section h2,
.why-choose-us h2{
  font-size:clamp(26px,3vw,36px);
  font-weight:900;
  margin-bottom:8px;
}

.subtitle{
  color:var(--muted);
  margin-bottom:30px;
}

/* ================= CATEGORY BLOCKS ================= */

.meal-type-section{
  margin-top:70px;
  padding:45px 35px;
  border-radius:20px;
  background:linear-gradient(180deg,var(--green-soft),rgba(76,175,80,0.02));
  border:1px solid var(--green-border);
  transition:all .25s ease;
}

/* category block hover (just to make the page feel alive) */
.meal-type-section:hover{
  transform:translateY(-4px);
  box-shadow:0 20px 50px rgba(0,0,0,0.08);
}

.meal-type-title{
  text-align:center;
  font-size:clamp(22px,2.5vw,28px);
  font-weight:900;
  letter-spacing:1px;
  margin-bottom:25px;
  color:#2e7d32;
  position:relative;
}

.meal-type-title::after{
  content:"";
  display:block;
  width:180px;
  max-width:60%;
  height:3px;
  background:var(--green);
  margin:10px auto 0;
  border-radius:4px;
}

/* ================= GRIDS ================= */

.meals-grid{
  display:grid;
  grid-template-columns:repeat(auto-fit,minmax(280px,1fr));
  gap:2rem;
  max-width:1150px;
  margin:0 auto;
}

.features-grid{
  margin-top:50px;
  display:grid;
  grid-template-columns:repeat(auto-fit,minmax(250px,1fr));
  gap:2rem;
  max-width:1100px;
  margin-left:auto;
  margin-right:auto;
}

/* ================= CARDS ================= */

.meal-card,
.feature-card{
  background:var(--card);
  border-radius:14px;
  overflow:hidden;
  box-shadow:var(--shadow);
  border:1px solid rgba(0,0,0,0.04);
  transition:all .25s ease;
}

.meal-card:hover,
.feature-card:hover{
  transform:translateY(-6px);
  box-shadow:var(--shadow-hover);
  border-color:rgba(76,175,80,0.25);
}

/* Image zoom effect */
.meal-image{
  width:100%;
  height:230px;
  object-fit:cover;
  transition:transform .3s ease;
}

.meal-card:hover .meal-image{
  transform:scale(1.05);
}

.meal-info{
  padding:22px;
}

.meal-info h3{
  font-weight:900;
  font-size:18px;
  margin-bottom:8px;
  color: var(--text);
}

.meal-info p{
  color:var(--muted);
  line-height:1.4;
}

/* Nutrition chips */
.nutrition-info{
  display:flex;
  flex-wrap:wrap;
  gap:8px;
  margin-top:12px;
}

.nutrient{
  background:#eee;
  padding:6px 12px;
  border-radius:20px;
  font-size:12px;
  font-weight:700;
}

/* Feature cards */
.feature-card{
  padding:35px;
}

.feature-card h3{
  font-size:18px;
  font-weight:900;
  margin-bottom:8px;
  color: var(--text);
}

.feature-card p{
  color:var(--muted);
  line-height:1.4;
}

/* ================= RESPONSIVE ================= */

@media (max-width: 1024px){
  /* keeps hero comfortable on half laptop screens */
  .home-section{
    padding-top: 80px;
  }
  .home-content p{
    font-size: 16px;
  }
}

@media (max-width:900px){
  main{
    padding:50px 6%;
  }

  .meal-type-section{
    padding:35px 25px;
  }
}

@media (max-width:480px){
  main{
    padding:35px 16px;
  }

  .home-section{
    padding-top:80px;
    min-height:55vh;
  }

  .meals-grid{
    grid-template-columns:1fr;
  }

  .meal-image{
    height:190px;
  }

  .meal-type-section{
    padding:25px 18px;
    margin-top:50px;
  }

  .meal-type-title::after{
    width:140px;
  }

  .feature-card{
    padding:22px;
  }
}

/* Accessibility */
@media (prefers-reduced-motion: reduce){
  .meal-card,
  .feature-card,
  .meal-image,
  .home-button,
  .meal-type-section{
    transition:none;
  }
}
</style>