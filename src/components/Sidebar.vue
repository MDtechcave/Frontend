<template>
<Teleport to="body">

  <div>

    <!-- Overlay -->
    <div
      v-if="isOpen"
      class="sidebar-overlay"
      @click="$emit('close')"
    ></div>

    <!-- Sidebar -->
    <aside :class="['sidebar', { open: isOpen }]">

      <div class="particles" v-if="isOpen">
        <span v-for="n in 20" :key="n"></span>
      </div>

      <nav class="sidebar-links">
        <router-link to="/" class="sidebar-item magnetic">🏠 Home</router-link>
        <router-link to="/cart" class="sidebar-item magnetic">🛒 Cart</router-link>
        <router-link to="/checkout" class="sidebar-item magnetic">💳 Checkout</router-link>
        <router-link to="/contact" class="sidebar-item magnetic">📞 Contact</router-link>

        <div class="divider"></div>

        <router-link to="#" class="sidebar-item magnetic placeholder">
          🥗 New Category
        </router-link>
        <router-link to="#" class="sidebar-item magnetic placeholder">
          🔥 Promotions
        </router-link>
      </nav>

    </aside>

  </div>

</Teleport>
</template>

<script setup>
defineProps({
  isOpen: Boolean
})

import { onMounted } from 'vue'

onMounted(() => {
  const magneticItems = document.querySelectorAll('.magnetic')

  magneticItems.forEach(item => {
    item.addEventListener('mousemove', e => {
      const rect = item.getBoundingClientRect()
      const x = e.clientX - rect.left - rect.width / 2
      const y = e.clientY - rect.top - rect.height / 2
      item.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`
    })

    item.addEventListener('mouseleave', () => {
      item.style.transform = 'translate(0,0)'
    })
  })
})
</script>

<style scoped>

/* Overlay */
.sidebar-overlay{
  position:fixed;
  inset:0;
  background:rgba(0,0,0,0.45);
  backdrop-filter:blur(6px);
  z-index:999;
  animation:fadeIn 0.3s ease forwards;
}

/* Sidebar */
.sidebar{
  position:fixed;
  top:0;
  left:0;
  height:100%;
  width:320px;
  background:linear-gradient(-45deg,#2e7d32,#1b5e20,#43a047,#66bb6a);
  background-size:400% 400%;
  animation:gradientShift 12s ease infinite;
  box-shadow:4px 0 30px rgba(0,0,0,0.4);
  transform:translateX(-110%);
  transition:transform 0.6s cubic-bezier(.34,1.56,.64,1);
  z-index:1000;
  padding:2rem 1.5rem;
  display:flex;
  flex-direction:column;
}

.sidebar.open{
  transform:translateX(0);
}

/* Links */
.sidebar-links{
  display:flex;
  flex-direction:column;
  gap:1rem;
  position:relative;
  z-index:2;
}

.sidebar-item{
  text-decoration:none;
  color:white;
  font-weight:600;
  padding:0.9rem 1rem;
  border-radius:14px;
  transition:all 0.3s ease;
  background:rgba(255,255,255,0.08);
}

.sidebar-item:hover{
  transform:translateX(12px) scale(1.05);
  background:linear-gradient(135deg,#66bb6a,#43a047);
  box-shadow:0 8px 18px rgba(0,0,0,0.25);
}

.placeholder{ opacity:0.7; }

.divider{
  height:1px;
  background:rgba(255,255,255,0.3);
  margin:1rem 0;
}

/* Animations */
@keyframes fadeIn{
  from{opacity:0}
  to{opacity:1}
}

@keyframes gradientShift{
  0%{background-position:0% 50%;}
  50%{background-position:100% 50%;}
  100%{background-position:0% 50%;}
}

</style>
