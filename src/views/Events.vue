<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import NavBar from '../components/NavBar.vue'
import Footer from '../components/Footer.vue'
import Sidebar from '../components/Sidebar.vue'

const route = useRoute()
const router = useRouter()

/*
  okay so i made this events page STATIC on purpose:
  - so it ALWAYS shows something (no api / backend stress)
  - map works with OpenStreetMap iframe (no API key drama)
  - clicking an event updates the map automatically
*/

const events = ref([
  {
    id: 1,
    type: 'hike',
    title: "Lion’s Head Sunrise Hike",
    date: 'Saturday',
    time: '06:30',
    distance: '5 km',
    difficulty: 'Medium',
    meet: "Lion’s Head Parking Area",
    notes: 'Sunrise hike with insane views. Bring water + a light jacket.',
    lat: -33.9409,
    lon: 18.3930
  },
  {
    id: 2,
    type: 'hike',
    title: 'Table Mountain Platteklip Gorge',
    date: 'Sunday',
    time: '07:00',
    distance: '6 km',
    difficulty: 'Hard',
    meet: 'Platteklip Gorge Starting Point',
    notes: 'Steep but worth it. This one will test your legs 😭',
    lat: -33.9628,
    lon: 18.4098
  },
  {
    id: 3,
    type: 'run',
    title: 'Sea Point Promenade Run',
    date: 'Saturday',
    time: '06:00',
    distance: '5 km',
    difficulty: 'Easy',
    meet: 'Sea Point Promenade',
    notes: 'Flat route, ocean views, perfect pace run.',
    lat: -33.9100,
    lon: 18.3900
  },
  {
    id: 4,
    type: 'run',
    title: 'Green Point Park Run',
    date: 'Sunday',
    time: '07:30',
    distance: '7 km',
    difficulty: 'Medium',
    meet: 'Green Point Park Entrance',
    notes: 'Nice safe route inside the park. Good mix of pace + chill.',
    lat: -33.9045,
    lon: 18.4110
  }
])

// when user clicks event we highlight it + update map
const selectedId = ref(null)

const selectedEvent = computed(() => {
  return events.value.find(e => e.id === selectedId.value) || null
})

// filter based on url: /events?type=hike or /events?type=run
const activeFilter = computed(() => {
  const t = (route.query.type || '').toString().toLowerCase()
  if (t === 'hike' || t === 'run') return t
  return 'all'
})

const filteredEvents = computed(() => {
  if (activeFilter.value === 'all') return events.value
  return events.value.filter(e => e.type === activeFilter.value)
})

// buttons to switch filters
const setFilter = (type) => {
  if (type === 'all') router.push('/events')
  else router.push(`/events?type=${type}`)
}

// static map src (OpenStreetMap)
const mapSrc = computed(() => {
  const e = selectedEvent.value

  // default view = CAPE TOWN (not Durban)
  if (!e) {
    return `https://www.openstreetmap.org/export/embed.html?bbox=18.30%2C-34.05%2C18.55%2C-33.80&layer=mapnik`
  }

  // zoom around selected event
  const pad = 0.02
  const left = (e.lon - pad).toFixed(5)
  const bottom = (e.lat - pad).toFixed(5)
  const right = (e.lon + pad).toFixed(5)
  const top = (e.lat + pad).toFixed(5)

  return `https://www.openstreetmap.org/export/embed.html?bbox=${left}%2C${bottom}%2C${right}%2C${top}&layer=mapnik`
})

const googleMapsLink = computed(() => {
  const e = selectedEvent.value
  if (!e) return 'https://www.google.com/maps?q=Cape+Town'
  return `https://www.google.com/maps?q=${e.lat},${e.lon}`
})

const typeBadge = (type) => (type === 'hike' ? '🥾 Hike' : '🏃 Run')

// when filter changes, auto-select first card so it never looks empty
watch(
  () => activeFilter.value,
  () => {
    const first = filteredEvents.value[0]
    selectedId.value = first ? first.id : null
  },
  { immediate: true }
)

onMounted(() => {
  const first = filteredEvents.value[0]
  selectedId.value = first ? first.id : null
})
</script>

<template>
  <NavBar />
  <Sidebar />

  <div class="events-page">
    <header class="header">
      <div>
        <h1>Events</h1>
        <p class="sub">
          Hiking & running meetups 
        </p>
      </div>

      <div class="filters">
        <button class="filter-btn" :class="{ active: activeFilter === 'all' }" @click="setFilter('all')">
          All
        </button>
        <button class="filter-btn" :class="{ active: activeFilter === 'hike' }" @click="setFilter('hike')">
          Hikes
        </button>
        <button class="filter-btn" :class="{ active: activeFilter === 'run' }" @click="setFilter('run')">
          Runs
        </button>
      </div>
    </header>

    <main class="layout">
      <!-- LEFT: list -->
      <section class="list">
        <div
          v-for="ev in filteredEvents"
          :key="ev.id"
          class="event-card"
          :class="{ selected: ev.id === selectedId }"
          @click="selectedId = ev.id"
          role="button"
          tabindex="0"
        >
          <div class="top">
            <div class="title-row">
              <h2>{{ ev.title }}</h2>
              <span class="badge">{{ typeBadge(ev.type) }}</span>
            </div>

            <div class="meta">
              <span>📅 {{ ev.date }}</span>
              <span>🕒 {{ ev.time }}</span>
              <span>📍 {{ ev.meet }}</span>
            </div>
          </div>

          <div class="bottom">
            <div class="chips">
              <span class="chip">📏 {{ ev.distance }}</span>
              <span class="chip">⚡ {{ ev.difficulty }}</span>
            </div>

            <p class="notes">{{ ev.notes }}</p>
          </div>
        </div>
      </section>

      <!-- RIGHT: map -->
      <section class="map-panel">
        <div class="map-box">
          <iframe
            class="map"
            :src="mapSrc"
            title="Events map"
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>

        <div v-if="selectedEvent" class="selected-box">
          <h3>Selected Event</h3>
          <p class="selected-title">{{ selectedEvent.title }}</p>

          <div class="selected-meta">
            <span>📅 {{ selectedEvent.date }}</span>
            <span>🕒 {{ selectedEvent.time }}</span>
            <span>📏 {{ selectedEvent.distance }}</span>
          </div>

          <a class="maps-btn" :href="googleMapsLink" target="_blank" rel="noreferrer">
            Open in Google Maps →
          </a>

          <!-- <p class="small">
            *Map is static (OpenStreetMap iframe) because i’m not trying to fight API keys today.*
          </p> -->
        </div>
      </section>
    </main>
  </div>

  <Footer />
</template>

<style scoped>
.events-page{
  max-width: 1200px;
  margin: 40px auto;
  padding: 0 16px 40px;
  font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
}

.header{
  display:flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 16px;
  margin-bottom: 18px;
}

h1{
  margin: 0;
  color: #215a24;
  font-weight: 1000;
  font-size: clamp(1.8rem, 3vw, 2.4rem);
}

.sub{
  margin: 8px 0 0;
  color:#556;
  font-weight: 800;
}

.filters{
  display:flex;
  gap: 10px;
  flex-wrap: wrap;
}

.filter-btn{
  border: 2px solid rgba(33,90,36,0.2);
  background: #fff;
  color:#215a24;
  padding: 10px 14px;
  border-radius: 999px;
  cursor:pointer;
  font-weight: 1000;
}
.filter-btn.active{
  background: rgba(76,175,80,0.15);
  border-color: rgba(76,175,80,0.55);
}

.layout{
  display:grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 18px;
}

.list{
  display:flex;
  flex-direction: column;
  gap: 14px;
}

.event-card{
  background:#fff;
  border-radius: 16px;
  border: 2px solid rgba(0,0,0,0.05);
  box-shadow: 0 6px 18px rgba(0,0,0,0.06);
  padding: 16px;
  cursor:pointer;
  transition: transform .2s ease, box-shadow .2s ease, border-color .2s ease;
}
.event-card:hover{
  transform: translateY(-4px);
  box-shadow: 0 14px 28px rgba(0,0,0,0.10);
  border-color: rgba(76,175,80,0.25);
}
.event-card.selected{
  border-color: rgba(76,175,80,0.65);
  box-shadow: 0 14px 28px rgba(76,175,80,0.14);
}

.title-row{
  display:flex;
  align-items:flex-start;
  justify-content: space-between;
  gap: 12px;
}

.event-card h2{
  margin: 0;
  font-size: 1.05rem;
  font-weight: 1000;
  color:#1f2937;
}

.badge{
  background: rgba(76,175,80,0.12);
  border: 1px solid rgba(76,175,80,0.25);
  color:#215a24;
  padding: 6px 10px;
  border-radius: 999px;
  font-weight: 1000;
  font-size: 12px;
  white-space: nowrap;
}

.meta{
  margin-top: 10px;
  display:grid;
  gap: 6px;
  color:#556;
  font-weight: 800;
  font-size: 0.92rem;
}

.chips{
  margin-top: 12px;
  display:flex;
  gap: 8px;
  flex-wrap: wrap;
}
.chip{
  background:#f1f6f1;
  border: 1px solid rgba(76,175,80,0.22);
  color:#215a24;
  padding: 6px 10px;
  border-radius: 999px;
  font-weight: 1000;
  font-size: 12px;
}

.notes{
  margin: 10px 0 0;
  color:#4b5563;
  font-weight: 800;
  line-height: 1.4;
}

.map-panel{
  display:flex;
  flex-direction: column;
  gap: 14px;
}

.map-box{
  background:#fff;
  border-radius: 16px;
  border: 2px solid rgba(0,0,0,0.05);
  box-shadow: 0 6px 18px rgba(0,0,0,0.06);
  overflow:hidden;
}

.map{
  width: 100%;
  height: 360px;
  border: 0;
}

.selected-box{
  background:#fff;
  border-radius: 16px;
  border: 2px solid rgba(0,0,0,0.05);
  box-shadow: 0 6px 18px rgba(0,0,0,0.06);
  padding: 16px;
}

.selected-box h3{
  margin: 0;
  color:#215a24;
  font-weight: 1000;
}

.selected-title{
  margin: 8px 0 0;
  font-weight: 1000;
  color:#1f2937;
}

.selected-meta{
  margin-top: 10px;
  display:flex;
  gap: 10px;
  flex-wrap: wrap;
  color:#556;
  font-weight: 900;
  font-size: 0.92rem;
}

.maps-btn{
  display:block;
  margin-top: 14px;
  text-align:center;
  background:#4CAF50;
  color:#fff;
  padding: 12px 14px;
  border-radius: 999px;
  font-weight: 1000;
  text-decoration:none;
}
.maps-btn:hover{
  background:#388E3C;
}

.small{
  margin: 10px 0 0;
  color:#6b7280;
  font-weight: 800;
  font-size: 12px;
  line-height: 1.4;
}

@media (max-width: 900px){
  .layout{
    grid-template-columns: 1fr;
  }
  .map{
    height: 300px;
  }
  .header{
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>