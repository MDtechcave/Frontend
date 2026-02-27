<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import NavBar from '../components/NavBar.vue'
import Footer from '../components/Footer.vue'
import Sidebar from '../components/Sidebar.vue'

const router = useRouter()

const goals = ref([])
const loading = ref(true)
const errorMsg = ref(null)

// i’m not trusting env to behave during demo so i keep localhost fallback 😭
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:2534'

// quick login check (simple but works)
const isAuthenticated = computed(() => {
  try {
    return !!JSON.parse(localStorage.getItem('user') || 'null')
  } catch {
    return false
  }
})

const getGoalName = (goal) => (goal?.goal_type || '').toLowerCase()

// chips = quick scan info (people don’t read paragraphs first)
const goalTags = (goal) => {
  const name = getGoalName(goal)

  if (name.includes('weight') || name.includes('lose') || name.includes('fat') || name.includes('cut')) {
    return ['🔥 Fat loss', '🥗 Balanced', '🚚 Delivery']
  }

  if (name.includes('muscle') || name.includes('gain') || name.includes('bulk')) {
    return ['🥩 High protein', '💪 Strength', '🍽️ More meals']
  }

  if (name.includes('health') || name.includes('maintain') || name.includes('maintenance')) {
    return ['🌿 Lifestyle', '🥗 Clean meals', '⚡ Easy']
  }

  // fallback just in case someone adds a random goal later
  return ['🥗 Balanced', '✅ Simple', '🚚 Delivery']
}

// ✅ the part you wanted: different paragraph per goal (no more same text)
const goalDescription = (goal) => {
  const name = getGoalName(goal)

  if (name.includes('weight')) {
    return 'This plan is designed to help you lose weight in a healthy and sustainable way. Meals are portion-controlled, balanced, and made to keep you full while staying consistent. No starving yourself — just structure and results.'
  }

  if (name.includes('muscle')) {
    return 'This plan focuses on muscle gain and recovery. It leans higher in protein with enough carbs to fuel training. Basically meals that actually support gym progress.'
  }

  if (name.includes('health') || name.includes('maintain')) {
    return 'This plan is for maintaining your weight while eating clean and staying consistent. It supports energy, balance, and long-term habits — not extreme, just realistic.'
  }

  return 'A clean meal plan that fits your lifestyle and helps you stay consistent.'
}

// “perfect for” line (makes it feel like the app actually understands the user)
const perfectFor = (goal) => {
  const name = getGoalName(goal)

  if (name.includes('weight')) {
    return 'Perfect for: fat loss + portion control + steady progress'
  }

  if (name.includes('muscle')) {
    return 'Perfect for: muscle gain + gym performance + recovery'
  }

  if (name.includes('health') || name.includes('maintain')) {
    return 'Perfect for: clean eating + balance + maintaining'
  }

  return 'Perfect for: getting started + building healthy habits'
}

// recommended goal (i just highlight Health Maintenance to guide users)
const recommendedGoalId = computed(() => {
  const healthy = goals.value.find(g => (g.goal_type || '').toLowerCase().includes('health'))
  return healthy?.goal_id || goals.value[0]?.goal_id || null
})

const fetchGoals = async () => {
  try {
    loading.value = true
    errorMsg.value = null

    const response = await fetch(`${API_URL}/api/goal`)
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)

    const data = await response.json()

    // safety check so the UI doesn’t crash if backend sends nonsense
    goals.value = Array.isArray(data) ? data : []
  } catch (err) {
    console.error('Error fetching goals:', err)
    errorMsg.value = 'Failed to load goals. Please try again later.'
  } finally {
    loading.value = false
  }
}

const selectGoal = (goal) => {
  // no login = no buying 😂 send them to login and bring them back
  if (!isAuthenticated.value) {
    router.push(`/login?redirect=${router.currentRoute.value.fullPath}`)
    return
  }

  // save the goal so we can use it on the next page if needed
  localStorage.setItem('selectedGoal', JSON.stringify(goal))

  // go to packages for the selected goal
  router.push(`/packages?goal_id=${goal.goal_id}`)
}

const handleKeydown = (event, goal) => {
  // keyboard support (looks pro + accessibility)
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    selectGoal(goal)
  }
}

onMounted(fetchGoals)
</script>

<template>
  <div class="goal-page">
    <NavBar />
    <Sidebar />

    <main class="main-content">
      <!-- hero -->
      <section class="goal-hero">
        <div class="hero-content">
          <!-- step indicator just so it feels like a real flow -->
          <div class="steps">
            <span class="step active">1</span>
            <span class="line"></span>
            <span class="step">2</span>
          </div>

          <p class="step-text">Step 1 of 2</p>

          <h1 class="hero-title">What's Your Fitness Goal?</h1>
          <p class="hero-subtitle">Choose your goal and we’ll match you with the best meal plan.</p>
        </div>
      </section>

      <!-- goals -->
      <section class="goals-section">
        <div v-if="loading" class="loading-container">
          <div class="loading-spinner"></div>
          <p class="loading-text">Loading your goals...</p>
        </div>

        <div v-else-if="errorMsg" class="error-container">
          <p class="error-message">{{ errorMsg }}</p>
          <button @click="fetchGoals" class="retry-btn">Try Again</button>
        </div>

        <div v-else class="goals-grid">
          <div
            v-for="(goal, index) in goals"
            :key="goal.goal_id"
            class="goal-card"
            :class="{ recommended: goal.goal_id === recommendedGoalId }"
            :style="{ animationDelay: `${index * 0.08}s` }"
            @click="selectGoal(goal)"
            @keydown="handleKeydown($event, goal)"
            tabindex="0"
            role="button"
            :aria-label="`Select ${goal.goal_type} plan`"
          >
            <!-- highlight recommended -->
            <div v-if="goal.goal_id === recommendedGoalId" class="badge">
              ⭐ Recommended
            </div>

            <div class="card-image-wrapper">
              <img
                :src="goal.image_url || '/placeholder-goal.jpg'"
                :alt="goal.goal_type"
                class="goal-image"
                @error="$event.target.src = '/placeholder-goal.jpg'"
              />
              <div class="card-overlay"></div>
            </div>

            <div class="card-content">
              <span class="goal-icon" aria-hidden="true">{{ goal.icon || '🥗' }}</span>

              <!-- ✅ DB field -->
              <h2 class="goal-title">{{ goal.goal_type }}</h2>

              <!-- ✅ different per goal -->
              <p class="goal-description">{{ goalDescription(goal) }}</p>

              <!-- ✅ different per goal -->
              <p class="perfect-for">{{ perfectFor(goal) }}</p>

              <!-- chips -->
              <div class="chips">
                <span v-for="t in goalTags(goal)" :key="t" class="chip">{{ t }}</span>
              </div>

              <!-- main action -->
              <button class="select-btn" @click.stop="selectGoal(goal)">
                Select this goal <span class="btn-arrow">→</span>
              </button>

              <p v-if="!isAuthenticated" class="login-hint">
                <small>Login required to place orders.</small>
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
.goal-page { min-height: 100vh; display: flex; flex-direction: column; }
.main-content { flex: 1; }

.goal-hero{
  width: 100%;
  min-height: 48vh;
  background: linear-gradient(135deg, #80df83 0%, #215a24 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 95px 20px 65px;
  position: relative;
  overflow: hidden;
}
.goal-hero::before{
  content:'';
  position:absolute;
  top:-50%;
  right:-10%;
  width:600px;
  height:600px;
  background: rgba(255,255,255,0.1);
  border-radius: 50%;
  pointer-events:none;
}
.hero-content{ position:relative; z-index:1; max-width: 900px; }

.steps{ display:flex; align-items:center; justify-content:center; gap:10px; margin-bottom: 10px; }
.step{
  width: 34px; height: 34px; border-radius: 999px;
  display:flex; align-items:center; justify-content:center;
  background: rgba(255,255,255,0.25);
  color: #fff;
  font-weight: 900;
}
.step.active{ background: rgba(255,255,255,0.95); color:#215a24; }
.line{ width: 60px; height: 3px; border-radius: 99px; background: rgba(255,255,255,0.35); }
.step-text{ color: rgba(255,255,255,0.9); margin: 0 0 10px; font-weight: 800; }

.hero-title{
  font-size: clamp(1.9rem, 3.6vw, 3.2rem);
  font-weight: 1000;
  color: #fff;
  margin: 0 0 10px;
  line-height: 1.1;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
}
.hero-subtitle{
  font-size: clamp(1rem, 1.5vw, 1.2rem);
  color: rgba(255,255,255,0.95);
  line-height: 1.6;
  margin: 0 auto;
  max-width: 650px;
}

.goals-section{ padding: 70px 5%; background:#f8faf8; }

.loading-container{
  display:flex;
  flex-direction:column;
  align-items:center;
  justify-content:center;
  padding: 100px 20px;
  min-height: 380px;
}
.loading-spinner{
  width:60px; height:60px;
  border:4px solid #e0e0e0;
  border-top:4px solid #4CAF50;
  border-radius:50%;
  animation: spin 1s linear infinite;
  margin-bottom: 18px;
}
.loading-text{ color:#666; font-size: 1.05rem; }

.error-container{
  text-align:center;
  padding: 60px 20px;
  background:#fff;
  border-radius: 14px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
  margin: 40px auto;
  max-width: 520px;
}
.error-message{ color:#d32f2f; font-size: 1.1rem; margin-bottom: 18px; }
.retry-btn{
  padding: 12px 28px;
  background:#4CAF50;
  color:#fff;
  border:none;
  border-radius: 999px;
  cursor:pointer;
  font-weight: 1000;
}

.goals-grid{
  display:grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 2.3rem;
  max-width: 1400px;
  margin: 0 auto;
}

.goal-card{
  position:relative;
  background:#fff;
  border-radius: 20px;
  overflow:hidden;
  cursor:pointer;
  box-shadow: 0 4px 15px rgba(0,0,0,0.10);
  transition: all .28s ease;
  border: 1px solid rgba(0,0,0,0.04);
}
.goal-card:hover{
  transform: translateY(-10px);
  box-shadow: 0 20px 40px rgba(0,0,0,0.14);
}

.goal-card.recommended{
  border-color: rgba(76,175,80,0.35);
  box-shadow: 0 10px 25px rgba(76,175,80,0.18);
}

.badge{
  position:absolute;
  top: 14px;
  left: 14px;
  z-index: 2;
  background: rgba(255,255,255,0.92);
  color: #215a24;
  font-weight: 1000;
  padding: 7px 12px;
  border-radius: 999px;
  font-size: 12px;
}

.card-image-wrapper{ position:relative; height: 240px; overflow:hidden; }
.goal-image{ width:100%; height:100%; object-fit:cover; transition: transform .45s ease; }
.goal-card:hover .goal-image{ transform: scale(1.08); }
.card-overlay{
  position:absolute;
  inset:0;
  background: linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.35) 100%);
  opacity:0;
  transition: opacity .25s ease;
}
.goal-card:hover .card-overlay{ opacity:1; }

.card-content{ padding: 26px; }
.goal-icon{ font-size: 44px; display:block; margin-bottom: 10px; }
.goal-title{ font-size: 1.55rem; font-weight: 1000; color:#2c3e50; margin: 0 0 10px; }

.goal-description{
  font-size: .98rem;
  color:#4b5563;
  line-height: 1.6;
  margin: 0 0 10px;
  font-weight: 700;
}

.perfect-for{
  margin: 0 0 14px;
  color:#215a24;
  font-weight: 1000;
  font-size: 0.92rem;
}

.chips{ display:flex; flex-wrap:wrap; gap: 8px; margin-bottom: 18px; }
.chip{
  background: #eef6ee;
  color: #215a24;
  border: 1px solid rgba(76,175,80,0.25);
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 900;
}

.select-btn{
  display:inline-flex;
  align-items:center;
  justify-content:center;
  gap: 8px;
  padding: 14px 28px;
  background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
  color:#fff;
  border:none;
  border-radius: 999px;
  font-weight: 1000;
  cursor:pointer;
  transition: all .25s ease;
  width: 100%;
}
.select-btn:hover{ transform: translateY(-2px); }
.btn-arrow{ transition: transform .25s ease; }
.select-btn:hover .btn-arrow{ transform: translateX(5px); }

.login-hint{ margin-top: 10px; color:#6b7280; font-weight: 800; text-align:center; }

@keyframes spin{ 0%{transform:rotate(0)} 100%{transform:rotate(360deg)} }

@media (max-width:768px){
  .goal-hero{ padding: 75px 16px 55px; min-height: 40vh; }
  .goals-section{ padding: 45px 4%; }
  .goals-grid{ grid-template-columns: 1fr; gap: 1.8rem; }
  .card-content{ padding: 22px; }
}
</style>