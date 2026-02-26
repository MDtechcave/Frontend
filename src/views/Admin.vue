<!-- src/views/Admin.vue -->
<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import AdminNav from '@/components/AdminNav.vue'

const router = useRouter()

// State
const adminName = ref('Admin')
const isLoading = ref(true)
const error = ref('')
const stats = ref({
  totalCustomers: 0,
  totalMeals: 0,
  totalOrders: 0
})
const recentOrders = ref([])

// API Configuration
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:2534'

// Format currency (South African Rand)
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR'
  }).format(amount || 0)
}

// Get status badge class
const getStatusClass = (status) => {
  const map = {
    'pending': 'status-pending',
    'confirmed': 'status-confirmed', 
    'delivered': 'status-delivered',
    'cancelled': 'status-cancelled'
  }
  return map[status?.toLowerCase()] || 'status-default'
}

// Fetch dashboard data from backend
const fetchDashboardData = async () => {
  try {
    error.value = ''
    
    // Fetch stats
    const statsRes = await axios.get(`${API_BASE}/api/admin/stats`)
    if (statsRes.data.success) {
      stats.value = statsRes.data.data
    }
    
    // Fetch recent orders (limit 5)
    const ordersRes = await axios.get(`${API_BASE}/api/admin/orders/recent`)
    if (ordersRes.data.success) {
      recentOrders.value = ordersRes.data.data
    }
    
  } catch (err) {
    console.error('Dashboard fetch error:', err)
    error.value = err.response?.data?.message || 'Failed to load dashboard data'
  } finally {
    isLoading.value = false
  }
}

// Logout handler
const handleLogout = () => {
  localStorage.removeItem('user')
  localStorage.removeItem('token')
  router.push('/login')
}

// Navigation helpers
const goToUsers = () => router.push('/admin/users')
const goToMeals = () => router.push('/admin/meals')
const goToOrders = () => router.push('/admin/orders')
const goToSettings = () => router.push('/admin/settings')

// Lifecycle: Check auth + load data
onMounted(() => {
  // Security check: ensure user is admin
  const user = JSON.parse(localStorage.getItem('user'))
  
  if (!user || user.role !== 'ADMIN') {
    router.push('/login')
    return
  }
  
  adminName.value = user.name || 'Admin'
  fetchDashboardData()
})
</script>

<template>
  <AdminNav />

    <!-- ✅ Main Content Area -->
    <main class="main-content">
      
      <!-- Header -->
      <header class="admin-header">
        <div>
          <h1>Admin Dashboard</h1>
          <p class="subtitle">Overview of Healthy Habits</p>
        </div>
        <div class="user-info">
          <span>Welcome, {{ adminName }}</span>
        </div>
      </header>

      <!-- Error Message -->
      <div v-if="error" class="error-banner">
        {{ error }}
        <button @click="fetchDashboardData">Retry</button>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="loading-state">
        <div class="spinner"></div>
        <p>Loading dashboard data...</p>
      </div>

      <!-- ✅ Stats Cards -->
      <div v-else class="stats-grid">
        
        <!-- Total Customers -->
        <div class="stat-card customers">
          <div class="stat-icon"></div>
          <div class="stat-details">
            <h3>Total Customers</h3>
            <p class="stat-number">{{ stats.totalCustomers }}</p>
            <span class="stat-label">Registered users</span>
          </div>
        </div>

        <!-- Total Meals -->
        <div class="stat-card meals">
          <div class="stat-icon"></div>
          <div class="stat-details">
            <h3>Total Meals</h3>
            <p class="stat-number">{{ stats.totalMeals }}</p>
            <span class="stat-label">Available menu items</span>
          </div>
        </div>

        <!-- Total Orders -->
        <div class="stat-card orders">
          <div class="stat-icon"></div>
          <div class="stat-details">
            <h3>Total Orders</h3>
            <p class="stat-number">{{ stats.totalOrders }}</p>
            <span class="stat-label">All time orders</span>
          </div>
        </div>

      </div>

      <!-- ✅ Recent Orders Table -->
      <section class="recent-orders-section" v-if="!isLoading">
        <div class="section-header">
          <h2> Recent Orders</h2>
          <button @click="goToOrders" class="view-all-btn">
            View All →
          </button>
        </div>

        <div class="table-wrapper">
          <table class="orders-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="recentOrders.length === 0">
                <td colspan="6" class="empty-state">
                  No recent orders found
                </td>
              </tr>
              <tr v-for="order in recentOrders" :key="order.order_id">
                <td><strong>#{{ order.order_id }}</strong></td>
                <td>{{ order.customer_name || 'Guest' }}</td>
                <td>{{ formatCurrency(order.total_amount) }}</td>
                <td>
                  <span :class="['status-badge', getStatusClass(order.status)]">
                    {{ order.status || 'pending' }}
                  </span>
                </td>
                <td>{{ order.created_at }}</td>
                <td>
                  <button class="action-btn" title="View details">👁️</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

    </main>
  <
</template>

<style scoped>
/* ===== LAYOUT ===== */
.admin-layout {
  display: flex;
  min-height: 100vh;
  background: #f8f9fa;
}

/* ===== SIDEBAR ===== */
.sidebar {
  width: 240px;
  background: #2E7D32;
  color: white;
  display: flex;
  flex-direction: column;
  position: fixed;
  height: 100vh;
  overflow-y: auto;
  z-index: 100;
}

.sidebar-header {
  padding: 20px;
  text-align: center;
  border-bottom: 1px solid rgba(255,255,255,0.2);
}

.sidebar-logo {
  width: 45px;
  height: 45px;
  object-fit: contain;
  margin-bottom: 10px;
}

.sidebar-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}

.admin-badge {
  display: inline-block;
  background: rgba(255,255,255,0.2);
  padding: 3px 10px;
  border-radius: 12px;
  font-size: 11px;
  margin-top: 8px;
  font-weight: 600;
}

.sidebar-nav {
  flex: 1;
  padding: 15px 10px;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 15px;
  background: none;
  border: none;
  color: rgba(255,255,255,0.9);
  text-decoration: none;
  border-radius: 8px;
  cursor: pointer;
  text-align: left;
  font-size: 14px;
  transition: 0.2s;
}

.nav-item:hover,
.nav-item.active,
.nav-item.router-link-active {
  background: rgba(255,255,255,0.15);
  color: white;
  font-weight: 500;
}

.sidebar-footer {
  padding: 15px 20px;
  border-top: 1px solid rgba(255,255,255,0.2);
}

.logout-btn {
  width: 100%;
  padding: 12px;
  background: rgba(255,255,255,0.2);
  border: none;
  border-radius: 8px;
  color: white;
  cursor: pointer;
  font-size: 14px;
  transition: 0.2s;
}

.logout-btn:hover {
  background: rgba(255,255,255,0.3);
}

/* ===== MAIN CONTENT ===== */
.main-content {
  flex: 1;
  margin-left: 240px;
  padding: 30px;
}

.admin-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e0e0e0;
}

.admin-header h1 {
  margin: 0;
  color: #2E7D32;
  font-size: 24px;
}

.subtitle {
  margin: 5px 0 0 0;
  color: #666;
  font-size: 14px;
}

.user-info span {
  background: #e8f5e9;
  color: #2E7D32;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
}

/* ===== ERROR BANNER ===== */
.error-banner {
  background: #ffebee;
  color: #c62828;
  padding: 12px 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-left: 4px solid #c62828;
}

.error-banner button {
  background: #c62828;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  margin-left: 15px;
}

/* ===== LOADING STATE ===== */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px;
  color: #666;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e0e0e0;
  border-top-color: #2E7D32;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 15px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* ===== STATS GRID ===== */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.stat-card {
  background: white;
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
  display: flex;
  align-items: center;
  gap: 15px;
  transition: transform 0.2s;
}

.stat-card:hover {
  transform: translateY(-3px);
}

.stat-icon {
  font-size: 32px;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
}

.stat-card.customers .stat-icon { background: #e3f2fd; }
.stat-card.meals .stat-icon { background: #fff3e0; }
.stat-card.orders .stat-icon { background: #e8f5e9; }

.stat-details h3 {
  margin: 0 0 5px 0;
  color: #666;
  font-size: 13px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-number {
  font-size: 28px;
  font-weight: bold;
  color: #2E7D32;
  margin: 0 0 3px 0;
}

.stat-label {
  font-size: 12px;
  color: #999;
}

/* ===== RECENT ORDERS ===== */
.recent-orders-section {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
  padding: 25px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-header h2 {
  margin: 0;
  color: #333;
  font-size: 18px;
}

.view-all-btn {
  background: none;
  border: none;
  color: #2E7D32;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
}

.view-all-btn:hover {
  text-decoration: underline;
}

/* ===== TABLE ===== */
.table-wrapper {
  overflow-x: auto;
}

.orders-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.orders-table th {
  text-align: left;
  padding: 14px 15px;
  background: #f8f9fa;
  color: #666;
  font-weight: 600;
  border-bottom: 2px solid #e0e0e0;
}

.orders-table td {
  padding: 15px;
  border-bottom: 1px solid #eee;
  color: #333;
}

.orders-table tr:hover {
  background: #f8f9fa;
}

.orders-table .empty-state {
  text-align: center;
  color: #999;
  padding: 30px;
}

/* ===== STATUS BADGES ===== */
.status-badge {
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  text-transform: capitalize;
}

.status-pending { background: #fff3e0; color: #ef6c00; }
.status-confirmed { background: #e3f2fd; color: #1976d2; }
.status-delivered { background: #e8f5e9; color: #2e7d32; }
.status-cancelled { background: #ffebee; color: #c62828; }
.status-default { background: #f5f5f5; color: #666; }

/* ===== ACTION BUTTONS ===== */
.action-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
  padding: 5px;
  border-radius: 4px;
}

.action-btn:hover {
  background: #f0f0f0;
}

/* ===== RESPONSIVE ===== */
@media (max-width: 992px) {
  .sidebar {
    width: 70px;
  }
  .sidebar-header h3,
  .admin-badge,
  .nav-item span,
  .logout-btn {
    display: none;
  }
  .nav-item {
    justify-content: center;
    padding: 15px;
  }
  .main-content {
    margin-left: 70px;
  }
}

@media (max-width: 768px) {
  .admin-layout {
    flex-direction: column;
  }
  .sidebar {
    width: 100%;
    height: auto;
    position: relative;
    flex-direction: row;
    padding: 10px;
  }
  .sidebar-header {
    padding: 0 10px;
    border: none;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .sidebar-logo {
    width: 35px;
    height: 35px;
    margin: 0;
  }
  .sidebar-nav {
    flex-direction: row;
    gap: 5px;
    padding: 0;
    margin-left: auto;
  }
  .nav-item {
    padding: 10px;
    font-size: 12px;
  }
  .sidebar-footer {
    display: none;
  }
  .main-content {
    margin-left: 0;
    padding: 20px;
  }
  .stats-grid {
    grid-template-columns: 1fr;
  }
  .admin-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }
}
</style>