<template>
  <Teleport to="body">
    <div>
      <!-- Overlay -->
      <div
        v-if="isOpen"
        class="sidebar-overlay"
        @click="toggleSidebar"
      ></div>

      <!-- Sidebar -->
      <aside :class="['sidebar', { open: isOpen }]">
        <div class="sidebar-header">
          <h2>Healthy Habits</h2>
          <button class="close-btn" @click="toggleSidebar">✕</button>
        </div>

        <nav class="sidebar-links">
          <!-- Easy placeholders to edit/add -->
          <router-link to="/" class="sidebar-item">🏠 Home</router-link>
          <router-link to="/cart" class="sidebar-item">🛒 Cart</router-link>
          <router-link to="/checkout" class="sidebar-item">💳 Checkout</router-link>
          <router-link to="/contact" class="sidebar-item">📞 Contact</router-link>

          <div class="divider"></div>

          <router-link to="#" class="sidebar-item placeholder">
            🥗 New Category
          </router-link>
          <router-link to="#" class="sidebar-item placeholder">
            🔥 Promotions
          </router-link>
        </nav>
      </aside>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const isOpen = ref(false)

const toggleSidebar = () => {
  isOpen.value = !isOpen.value
}

const logoClickListener = (e) => {
  const logo = e.target.closest('.nav-logo')

  if (logo) {
    // Completely kill router-link behavior
    e.preventDefault()
    e.stopImmediatePropagation()
    e.stopPropagation()

    toggleSidebar()
  }
}

onMounted(() => {
  document.addEventListener('click', logoClickListener, true)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', logoClickListener, true)
})
</script>

<style scoped>
.sidebar-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
  z-index: 999;
  animation: fadeIn 0.3s ease forwards;
}

.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 300px;
  background: linear-gradient(160deg, #2e7d32, #1b5e20);
  box-shadow: 4px 0 25px rgba(0, 0, 0, 0.3);
  transform: translateX(-100%);
  transition: transform 0.4s cubic-bezier(.25,.8,.25,1);
  z-index: 1000;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
}

.sidebar.open {
  transform: translateX(0);
}

.sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;
  margin-bottom: 2rem;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.3rem;
  color: white;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.close-btn:hover {
  transform: rotate(90deg) scale(1.2);
}

.sidebar-links {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.sidebar-item {
  text-decoration: none;
  color: white;
  font-weight: 600;
  padding: 0.8rem 1rem;
  border-radius: 12px;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.08);
}

.sidebar-item:hover {
  transform: translateX(8px) scale(1.03);
  background: linear-gradient(135deg, #66bb6a, #43a047);
  box-shadow: 0 6px 15px rgba(0,0,0,0.2);
}

.placeholder {
  opacity: 0.7;
}

.divider {
  height: 1px;
  background: rgba(255,255,255,0.3);
  margin: 1rem 0;
}

@keyframes fadeIn {
  from { opacity: 0 }
  to { opacity: 1 }
}
</style>