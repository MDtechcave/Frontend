<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const isOpen = ref(false)
const active = ref('profile')

// i used this authTick thing so the sidebar updates immediately when i login/logout
const authTick = ref(0)
const syncAuth = () => authTick.value++

const user = computed(() => {
  authTick.value
  try {
    return JSON.parse(localStorage.getItem('user') || 'null')
  } catch {
    return null
  }
})

const isLoggedIn = computed(() => !!user.value && (!!user.value.email || !!user.value.id))

const open = () => (isOpen.value = true)
const close = () => (isOpen.value = false)
defineExpose({ open })

const go = (path) => {
  close()
  router.push(path)
}

const logout = () => {
  // clear stored auth info then kick user to login
  localStorage.removeItem('user')
  localStorage.removeItem('token')
  window.dispatchEvent(new Event('auth-changed'))
  close()
  router.push('/login')
}

/** Profile edit */
const isEditing = ref(false)
const editName = ref('')
const editEmail = ref('')

const startEdit = () => {
  isEditing.value = true
  editName.value = user.value?.name || ''
  editEmail.value = user.value?.email || ''
}

const cancelEdit = () => {
  isEditing.value = false
}

const saveProfile = () => {
  if (!isLoggedIn.value) return

  // update user info in localStorage (simple edit for now)
  const updated = {
    ...user.value,
    name: editName.value.trim(),
    email: editEmail.value.trim()
  }

  localStorage.setItem('user', JSON.stringify(updated))
  window.dispatchEvent(new Event('auth-changed'))
  isEditing.value = false
}

/** Donations */
const donationAmount = ref(50)
const donate = () => {
  close()
  router.push(`/donations?amount=${donationAmount.value}`)
}

onMounted(() => {
  syncAuth()
  window.addEventListener('auth-changed', syncAuth)
  window.addEventListener('storage', syncAuth)
})

onBeforeUnmount(() => {
  window.removeEventListener('auth-changed', syncAuth)
  window.removeEventListener('storage', syncAuth)
})
</script>

<template>
  <!-- hamburger trigger -->
  <button class="sidebar-trigger" @click="open" aria-label="Open menu">
    <span class="trigger-icon">☰</span>
  </button>

  <Transition name="overlay">
    <div v-if="isOpen" class="overlay" @click="close" />
  </Transition>

  <Transition name="drawer">
    <aside v-if="isOpen" class="drawer" role="dialog" aria-modal="true">
      <!-- Header -->
      <div class="drawer-header">
        <div class="header-left">
          <div class="avatar">
            {{ isLoggedIn ? (user?.name?.charAt(0)?.toUpperCase() || 'U') : '🌿' }}
          </div>
          <div class="header-text">
            <div class="name">
              {{ isLoggedIn ? (user?.name || 'Explorer') : 'Welcome' }}
            </div>
            <div class="email">
              {{ isLoggedIn ? (user?.email || '') : 'Login to continue' }}
            </div>
          </div>
        </div>

        <button class="close-btn" @click="close" aria-label="Close menu">✕</button>
      </div>

      <!-- Tabs -->
      <div class="tabs">
        <button :class="['tab', { active: active === 'profile' }]" @click="active = 'profile'">
          Profile
        </button>
        <button :class="['tab', { active: active === 'events' }]" @click="active = 'events'">
          Events
        </button>
        <button :class="['tab', { active: active === 'donations' }]" @click="active = 'donations'">
          Donations
        </button>
        <button :class="['tab', { active: active === 'support' }]" @click="active = 'support'">
          Support/FAQ
        </button>
      </div>

      <!-- Content -->
      <div class="content">
        <!-- PROFILE -->
        <div v-if="active === 'profile'" class="section">
          <div v-if="!isLoggedIn" class="empty">
            <div class="empty-title">Not logged in</div>
            <div class="empty-sub">Login to view & edit your profile.</div>
            <div class="btn-row">
              <button class="btn-primary" @click="go('/login')">Login</button>
              <button class="btn-outline" @click="go('/register')">Sign up</button>
            </div>
          </div>

          <div v-else class="profile">
            <div v-if="!isEditing" class="stack">
              <div class="info">
                <div class="label">Name</div>
                <div class="value">{{ user?.name || '-' }}</div>
              </div>

              <div class="info">
                <div class="label">Email</div>
                <div class="value">{{ user?.email || '-' }}</div>
              </div>

              <div class="info">
                <div class="label">Role</div>
                <div class="value"><span class="badge">{{ user?.role || 'USER' }}</span></div>
              </div>

              <button class="row row-accent" @click="startEdit">✏️ Edit Profile</button>
            </div>

            <div v-else class="edit">
              <div class="info">
                <div class="label">Name</div>
                <input class="input" v-model="editName" placeholder="Your name" />
              </div>
              <div class="info">
                <div class="label">Email</div>
                <input class="input" v-model="editEmail" placeholder="Your email" />
              </div>

              <div class="btn-row">
                <button class="btn-primary" @click="saveProfile">Save</button>
                <button class="btn-outline" @click="cancelEdit">Cancel</button>
              </div>
            </div>
          </div>
        </div>

        <!-- EVENTS -->
        <div v-else-if="active === 'events'" class="section">
          <div class="card">
            <div class="card-title">Events</div>
            <div class="card-sub">Hiking & running routes, meetups, and maps.</div>
          </div>

          <button class="row" @click="go('/events')">🗺️ Open Events Map</button>
          <button class="row" @click="go('/events?type=hike')">🥾 Hiking Routes</button>
          <button class="row" @click="go('/events?type=run')">🏃 Running Routes</button>
        </div>

        <!-- DONATIONS -->
        <div v-else-if="active === 'donations'" class="section">
          <div class="card">
            <div class="card-title">Donations</div>
            <div class="card-sub">Support trail cleanups, guides, and community runs.</div>
          </div>

          <div class="donation-box">
            <div class="label">Amount (R)</div>
            <input class="input" type="number" min="10" step="10" v-model.number="donationAmount" />
            <button class="btn-primary" @click="donate">Donate</button>
          </div>

          <button class="row" @click="go('/donations')">💚 View Donation Options</button>
        </div>

        <!-- SUPPORT -->
        <div v-else class="section">
          <div class="card">
            <div class="card-title">Support / FAQ</div>
            <div class="card-sub">Quick answers + ways to contact us.</div>
          </div>

          <button class="row" @click="go('/support')">❓ Open FAQ</button>
          <button class="row" @click="go('/support#account')">👤 Account Help</button>
          <button class="row" @click="go('/support#events')">🗺️ Events / Map Issues</button>
          <button class="row" @click="go('/contact')">📬 Contact Support</button>
        </div>
      </div>

      <!-- Footer -->
      <div class="footer">
        <button v-if="isLoggedIn" class="logout" @click="logout">🚪 Logout</button>
        <button v-else class="btn-primary" @click="go('/login')">Login</button>
      </div>
    </aside>
  </Transition>
</template>

<style scoped>
* { box-sizing: border-box; }

/* earthy palette */
:root{
  --forest:#2f5d3a;
  --moss:#3e7a4b;
  --clay:#8b6b4f;
  --sand:#f3efe7;
  --stone:#5a5f5b;
  --leaf:#dceadf;
}

/*  Trigger (TOP LEFT) */
/* fix: it was overlapping the logo on smaller laptop screens, so i push it down a bit */
.sidebar-trigger{
  position: fixed;
  top: 14px;
  left: 14px;
  z-index: 9999;
  background: var(--forest);
  color: #116c22; 
  border:#111 ;
  border-radius: 14px;
  padding: 12px 12px;
  cursor: pointer;
  box-shadow: 0 10px 25px rgba(47,93,58,0.25);
}
.sidebar-trigger:hover { transform: translateY(-1px); }
.trigger-icon { font-size: 18px; }

/*  push button below navbar area on smaller widths (prevents logo overlap) */
@media (max-width: 1024px){
  .sidebar-trigger{
    top: 78px; /* adjust if your navbar is taller */
  }
}

@media (max-width: 480px){
  .sidebar-trigger{
    top: 70px;
    left: 12px;
  }
}

/* Overlay */
.overlay{
  position: fixed;
  inset: 0;
  background: rgba(25,30,25,0.55);
  z-index: 1000;
  backdrop-filter: blur(3px);
}

/* Drawer */
.drawer{
  position: fixed;
  top: 0;
  left: 0;
  width: 340px;
  height: 100vh;
  background: var(--sand);
  z-index: 1001;
  display: flex;
  flex-direction: column;
  box-shadow: 10px 0 50px rgba(0,0,0,0.18);
  overflow: hidden;
  font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
}

/* Header */
.drawer-header{
  background: linear-gradient(135deg, var(--forest), var(--moss));
  color: white;
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.header-left{ display: flex; align-items: center; gap: 12px; }
.avatar{
  width: 44px;
  height: 44px;
  border-radius: 16px;
  background: rgba(255,255,255,0.18);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 900;
}
.name{ font-weight: 900; font-size: 14px; }
.email{ font-size: 12px; opacity: 0.88; max-width: 210px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.close-btn{
  background: rgba(255,255,255,0.18);
  border: none;
  color: white;
  width: 34px;
  height: 34px;
  border-radius: 12px;
  cursor: pointer;
}
.close-btn:hover{ background: rgba(255,255,255,0.28); }

/* Tabs */
.tabs{
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  padding: 10px 14px;
  background: #f7f2ea;
  border-bottom: 1px solid rgba(90,95,91,0.15);
}
.tab{
  border: 1.5px solid rgba(90,95,91,0.18);
  background: #fff;
  border-radius: 12px;
  padding: 9px 8px;
  font-weight: 900;
  font-size: 12px;
  cursor: pointer;
  color: #3b3b3b;
}
.tab.active{
  border-color: var(--forest);
  color: var(--forest);
  background: var(--leaf);
}

/* Content */
.content{
  flex: 1;
  overflow-y: auto;
  padding: 12px 14px;
}
.section{ display: flex; flex-direction: column; gap: 10px; }

.row{
  width: 100%;
  text-align: left;
  border: 1px solid rgba(90,95,91,0.15);
  background: white;
  border-radius: 14px;
  padding: 12px 12px;
  font-weight: 800;
  cursor: pointer;
}
.row:hover{ border-color: rgba(62,122,75,0.35); background: #fffdf9; }
.row-accent{
  border-color: rgba(139,107,79,0.35);
}
.row-accent:hover{
  border-color: rgba(139,107,79,0.6);
}

/* cards */
.card{
  border: 1px solid rgba(90,95,91,0.15);
  border-radius: 16px;
  background: #fff;
  padding: 12px;
}
.card-title{ font-weight: 1000; color: #1f2a20; }
.card-sub{ margin-top: 4px; color: #5a5f5b; font-size: 12px; }

/* Profile */
.stack{ display: flex; flex-direction: column; gap: 10px; }
.profile .info{
  border: 1px solid rgba(90,95,91,0.12);
  border-radius: 14px;
  padding: 12px;
  background: #fff;
}
.label{ font-size: 12px; color: #5a5f5b; font-weight: 900; text-transform: uppercase; letter-spacing: .04em; }
.value{ margin-top: 6px; font-weight: 800; color: #111; }
.badge{
  background: var(--leaf);
  color: var(--forest);
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 1000;
}

/* Inputs */
.input{
  width: 100%;
  margin-top: 8px;
  padding: 11px 12px;
  border-radius: 12px;
  border: 1.5px solid rgba(90,95,91,0.22);
  outline: none;
  font-weight: 700;
  background: #fff;
}
.input:focus{
  border-color: rgba(62,122,75,0.7);
  box-shadow: 0 0 0 4px rgba(62,122,75,0.12);
}

/* Empty */
.empty{ padding: 6px; }
.empty-title{ font-weight: 1000; font-size: 14px; }
.empty-sub{ color: #5a5f5b; font-size: 12px; margin-top: 4px; }

/* Buttons */
.btn-row{ display: flex; gap: 10px; margin-top: 12px; }
.btn-primary{
  flex: 1;
  padding: 12px;
  background: var(--forest);
  color: white;
  border: none;
  border-radius: 14px;
  font-weight: 1000;
  cursor: pointer;
}
.btn-primary:hover{ background: #244a2e; }
.btn-outline{
  flex: 1;
  padding: 12px;
  background: transparent;
  color: var(--forest);
  border: 1.8px solid var(--forest);
  border-radius: 14px;
  font-weight: 1000;
  cursor: pointer;
}
.btn-outline:hover{ background: var(--leaf); }

.donation-box{
  border: 1px solid rgba(90,95,91,0.15);
  border-radius: 16px;
  background: #fff;
  padding: 12px;
  display: grid;
  gap: 10px;
}

/* Footer */
.footer{
  padding: 14px;
  border-top: 1px solid rgba(90,95,91,0.15);
  background: #fbf7f0;
}
.logout{
  width: 100%;
  padding: 12px;
  background: #fbe9e2;
  color: #8a2b19;
  border: none;
  border-radius: 14px;
  font-weight: 1000;
  cursor: pointer;
}
.logout:hover{ background: #f7d6ca; }

/* Transitions */
.overlay-enter-active, .overlay-leave-active { transition: opacity 0.3s; }
.overlay-enter-from, .overlay-leave-to { opacity: 0; }

.drawer-enter-active, .drawer-leave-active { transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1); }
.drawer-enter-from, .drawer-leave-to { transform: translateX(-100%); }

@media (max-width: 480px) {
  .drawer { width: 100vw; }
}
</style>