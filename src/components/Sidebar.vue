<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const isOpen = ref(false)
const active = ref('menu') // menu | profile | support

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
  localStorage.removeItem('user')
  localStorage.removeItem('token')
  window.dispatchEvent(new Event('auth-changed'))
  close()
  router.push('/login')
}

// keep sidebar updated after login/register/logout
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
  <!-- Trigger Button -->
  <button class="sidebar-trigger" @click="open" aria-label="Open menu">
    <span class="trigger-icon">☰</span>
  </button>

  <!-- Overlay -->
  <Transition name="overlay">
    <div v-if="isOpen" class="overlay" @click="close" />
  </Transition>

  <!-- Drawer -->
  <Transition name="drawer">
    <aside v-if="isOpen" class="drawer" role="dialog" aria-modal="true">
      <!-- Header -->
      <div class="drawer-header">
        <div class="header-left">
          <div class="avatar">
            {{ isLoggedIn ? (user?.name?.charAt(0)?.toUpperCase() || 'C') : '👋' }}
          </div>
          <div class="header-text">
            <div class="name">
              {{ isLoggedIn ? (user?.name || 'Customer') : 'Welcome' }}
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
        <button :class="['tab', { active: active === 'menu' }]" @click="active = 'menu'">Menu</button>
        <button :class="['tab', { active: active === 'profile' }]" @click="active = 'profile'">Profile</button>
        <button :class="['tab', { active: active === 'support' }]" @click="active = 'support'">Support</button>
      </div>

      <!-- Content -->
      <div class="content">
        <!-- MENU -->
        <div v-if="active === 'menu'" class="section">
          <button class="row" @click="go('/')">🏠 Home</button>
          <button class="row" @click="go('/mealplan')">🥗 Meal Plans</button>
          <button class="row" @click="go('/cart')">🛒 Cart</button>

          <!-- If you don't have /orders yet, change this route later -->
          <button class="row" v-if="isLoggedIn" @click="go('/orders')">📦 My Orders</button>

          <button class="row" @click="go('/contact')">📬 Contact</button>
        </div>

        <!-- PROFILE -->
        <div v-else-if="active === 'profile'" class="section">
          <div v-if="!isLoggedIn" class="empty">
            <div class="empty-title">Not logged in</div>
            <div class="empty-sub">Login to see your profile & orders.</div>
            <div class="btn-row">
              <button class="btn-green" @click="go('/login')">Login</button>
              <button class="btn-outline" @click="go('/register')">Sign up</button>
            </div>
          </div>

          <div v-else class="profile">
            <div class="info">
              <div class="label">Name</div>
              <div class="value">{{ user?.name }}</div>
            </div>
            <div class="info">
              <div class="label">Email</div>
              <div class="value">{{ user?.email }}</div>
            </div>
            <div class="info">
              <div class="label">Role</div>
              <div class="value"><span class="badge">{{ user?.role || 'USER' }}</span></div>
            </div>
          </div>
        </div>

        <!-- SUPPORT -->
        <div v-else class="section">
          <div class="help">
            <div class="help-title">Need help?</div>
            <div class="help-sub">You can reach us quickly here.</div>

            <button class="row" @click="go('/contact')">📬 Contact Support</button>
            <button class="row" @click="go('/contact')">🕐 Delivery Questions</button>
            <button class="row" @click="go('/contact')">💳 Payment Issues</button>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="footer">
        <button v-if="isLoggedIn" class="logout" @click="logout">🚪 Logout</button>
        <button v-else class="btn-green" @click="go('/login')">Login</button>
      </div>
    </aside>
  </Transition>
</template>

<style scoped>
* { box-sizing: border-box; }

/* Trigger */
.sidebar-trigger{
  position: fixed;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
  z-index: 900;
  background: #2E7D32;
  color: white;
  border: none;
  border-radius: 0 12px 12px 0;
  padding: 14px 10px;
  cursor: pointer;
  box-shadow: 3px 0 15px rgba(46,125,50,0.3);
}
.sidebar-trigger:hover { padding-right: 16px; }
.trigger-icon { font-size: 18px; }

/* Overlay */
.overlay{
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.45);
  z-index: 1000;
  backdrop-filter: blur(3px);
}

/* Drawer */
.drawer{
  position: fixed;
  top: 0;
  left: 0;
  width: 320px;
  height: 100vh;
  background: white;
  z-index: 1001;
  display: flex;
  flex-direction: column;
  box-shadow: 6px 0 40px rgba(0,0,0,0.15);
  overflow: hidden;
  font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
}

/* Header */
.drawer-header{
  background: linear-gradient(135deg, #1b5e20, #2E7D32);
  color: white;
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.header-left{ display: flex; align-items: center; gap: 12px; }
.avatar{
  width: 42px;
  height: 42px;
  border-radius: 14px;
  background: rgba(255,255,255,0.18);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
}
.name{ font-weight: 800; font-size: 14px; }
.email{ font-size: 12px; opacity: 0.85; max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
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
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  padding: 10px 14px;
  background: #f8faf8;
  border-bottom: 1px solid #eef3ee;
}
.tab{
  border: 1.5px solid #e2e7e2;
  background: white;
  border-radius: 12px;
  padding: 9px 10px;
  font-weight: 800;
  font-size: 12px;
  cursor: pointer;
  color: #444;
}
.tab.active{
  border-color: #2E7D32;
  color: #2E7D32;
}

/* Content */
.content{
  flex: 1;
  overflow-y: auto;
  padding: 12px 14px;
}
.section{ display: flex; flex-direction: column; gap: 8px; }

.row{
  width: 100%;
  text-align: left;
  border: 1px solid #eef3ee;
  background: white;
  border-radius: 12px;
  padding: 12px 12px;
  font-weight: 700;
  cursor: pointer;
}
.row:hover{ border-color: #a5d6a7; background: #fbfdfb; }

/* Profile */
.profile .info{
  border: 1px solid #eef3ee;
  border-radius: 12px;
  padding: 12px;
  background: #fbfdfb;
}
.label{ font-size: 12px; color: #666; font-weight: 700; text-transform: uppercase; letter-spacing: .04em; }
.value{ margin-top: 6px; font-weight: 700; color: #111; }
.badge{
  background: #e8f5e9;
  color: #2E7D32;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 800;
}

/* Empty */
.empty{ padding: 6px; }
.empty-title{ font-weight: 900; font-size: 14px; }
.empty-sub{ color: #666; font-size: 12px; margin-top: 4px; }

/* Buttons */
.btn-row{ display: flex; gap: 10px; margin-top: 12px; }
.btn-green{
  flex: 1;
  padding: 12px;
  background: #2E7D32;
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 900;
  cursor: pointer;
}
.btn-green:hover{ background: #1b5e20; }
.btn-outline{
  flex: 1;
  padding: 12px;
  background: transparent;
  color: #2E7D32;
  border: 1.5px solid #2E7D32;
  border-radius: 12px;
  font-weight: 900;
  cursor: pointer;
}
.btn-outline:hover{ background: #e8f5e9; }

/* Footer */
.footer{
  padding: 14px;
  border-top: 1px solid #eef3ee;
  background: #fafafa;
}
.logout{
  width: 100%;
  padding: 12px;
  background: #ffebee;
  color: #c62828;
  border: none;
  border-radius: 12px;
  font-weight: 900;
  cursor: pointer;
}
.logout:hover{ background: #ffcdd2; }

/* Transitions */
.overlay-enter-active, .overlay-leave-active { transition: opacity 0.3s; }
.overlay-enter-from, .overlay-leave-to { opacity: 0; }

.drawer-enter-active, .drawer-leave-active { transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1); }
.drawer-enter-from, .drawer-leave-to { transform: translateX(-100%); }

@media (max-width: 480px) {
  .drawer { width: 100vw; }
}
</style>