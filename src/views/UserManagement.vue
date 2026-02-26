<script setup>
import AdminNav from '@/components/AdminNav.vue'
import { ref, onMounted, computed } from 'vue'

const searchQuery = ref('')
const users = ref([])
const currentPage = ref(1)
const usersPerPage = 5
const isLoading = ref(true)

// 🔹 Fetch customers
onMounted(async () => {
  await fetchUsers()
})

const fetchUsers = async () => {
  isLoading.value = true
  try {
    const response = await fetch('http://localhost:2534/api/users')
    const data = await response.json()
    users.value = data.filter(u => u.role?.toLowerCase() === 'user')
  } catch (error) {
    console.error('Error fetching users:', error)
  } finally {
    isLoading.value = false
  }
}

// 🔍 SEARCH
const filteredUsers = computed(() => {
  if (!searchQuery.value) return users.value
  const query = searchQuery.value.toLowerCase()
  return users.value.filter(user => {
    const userName = (user.name || '').toLowerCase()
    return userName.includes(query) || user.email.toLowerCase().includes(query)
  })
})

// 📄 PAGINATION
const totalPages = computed(() => Math.ceil(filteredUsers.value.length / usersPerPage))

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * usersPerPage
  const end = start + usersPerPage
  return filteredUsers.value.slice(start, end)
})

const goToPage = (page) => { currentPage.value = page }
const nextPage = () => { if (currentPage.value < totalPages.value) currentPage.value++ }
const prevPage = () => { if (currentPage.value > 1) currentPage.value-- }

// 🔘 Toggle Status
const toggleStatus = async (user) => {
  const newStatus = user.status === 'active' ? 'inactive' : 'active'
  const originalStatus = user.status
  
  try {
    const response = await fetch(`http://localhost:2534/api/users/${user.id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    })
    
    if (!response.ok) throw new Error('Failed to update')
    user.status = newStatus
  } catch (error) {
    console.error('Error updating status:', error)
    user.status = originalStatus // revert on error
    alert('Failed to update status. Please try again.')
  }
}

// 🗑 Delete User
const deleteUser = async (id) => {
  if (!confirm('Are you sure you want to delete this customer?')) return
  
  try {
    const response = await fetch(`http://localhost:2534/api/users/${id}`, {
      method: 'DELETE'
    })
    
    if (!response.ok) throw new Error('Failed to delete')
    users.value = users.value.filter(user => user.id !== id)
    alert('User deleted successfully')
  } catch (error) {
    console.error('Error deleting user:', error)
    alert('Failed to delete user. Please try again.')
  }
}
</script>

<template>
  <AdminNav />

  <main class="container">
    <!-- Header -->
    <header class="page-header">
      <div class="header-content">
        <h1 class="page-title">Customer Management</h1>
        <p class="page-subtitle">Manage your customer accounts and permissions</p>
      </div>
      
      <div class="search-box">
        <svg class="search-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"/>
          <path d="m21 21-4.35-4.35"/>
        </svg>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search by name or email..."
          class="search-input"
        />
      </div>
    </header>

    <!-- Loading State -->
    <div v-if="isLoading" class="loading-state">
      <div class="spinner"></div>
      <p>Loading customers...</p>
    </div>

    <!-- Customer Table -->
    <div v-else class="table-container">
      <table class="customer-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Status</th>
            <th class="actions-header">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in paginatedUsers" :key="user.id" class="table-row">
            <td class="name-cell">
              <div class="user-info">
                <div class="user-avatar">{{ user.name?.charAt(0)?.toUpperCase() }}</div>
                <span class="user-name">{{ user.name }}</span>
              </div>
            </td>
            <td class="email-cell">{{ user.email }}</td>
            <td>
              <span :class="['status-badge', user.status]">
                <span class="status-dot"></span>
                {{ user.status }}
              </span>
            </td>
            <td class="actions-cell">
              <button class="action-btn toggle-btn" @click="toggleStatus(user)" :title="`Click to ${user.status === 'active' ? 'deactivate' : 'activate'} user`">
                {{ user.status === 'active' ? 'Deactivate' : 'Activate' }}
              </button>
              <button class="action-btn delete-btn" @click="deleteUser(user.id)" title="Delete user">
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Empty State -->
      <div v-if="filteredUsers.length === 0" class="empty-state">
        <svg class="empty-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
        <p>No customers found</p>
        <span v-if="searchQuery">Try adjusting your search</span>
      </div>

      <!-- Stats & Pagination -->
      <footer class="table-footer">
        <p class="total-count">
          Showing <strong>{{ paginatedUsers.length }}</strong> of <strong>{{ filteredUsers.length }}</strong> customers
        </p>
        
        <div v-if="totalPages > 1" class="pagination">
          <button @click="prevPage" :disabled="currentPage === 1" class="page-btn">
            ← Prev
          </button>
          
          <template v-for="page in totalPages" :key="page">
            <button
              @click="goToPage(page)"
              :class="['page-number', { active: currentPage === page }]"
            >
              {{ page }}
            </button>
          </template>
          
          <button @click="nextPage" :disabled="currentPage === totalPages" class="page-btn">
            Next →
          </button>
        </div>
      </footer>
    </div>
  </main>
</template>

<style scoped>
/* ===== VARIABLES ===== */
:root {
  --primary: #43a047;
  --primary-dark: #2e7d32;
  --primary-light: #e8f5e9;
  --danger: #e53935;
  --danger-hover: #b71c1c;
  --text-primary: #1a1a2e;
  --text-secondary: #666;
  --bg-card: #ffffff;
  --bg-page: #f8fafc;
  --border: #e2e8f0;
  --shadow: 0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06);
  --radius: 12px;
  --transition: all 0.2s ease;
}

/* ===== LAYOUT ===== */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  background: var(--bg-page);
  min-height: 100vh;
}

/* ===== HEADER ===== */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
  position: sticky;
  top: 0;
  background: var(--bg-page);
  padding-top: 1rem;
  z-index: 10;
}

.header-content {
  flex: 1;
  min-width: 300px;
}

.page-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 0.25rem 0;
}

.page-subtitle {
  color: var(--text-secondary);
  margin: 0;
  font-size: 0.95rem;
}

/* ===== SEARCH BOX ===== */
.search-box {
  position: relative;
  width: 100%;
  max-width: 320px;
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 18px;
  height: 18px;
  color: var(--text-secondary);
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 2px solid var(--border);
  border-radius: var(--radius);
  font-size: 0.95rem;
  transition: var(--transition);
  background: var(--bg-card);
}

.search-input:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(67, 160, 71, 0.15);
}

.search-input::placeholder {
  color: var(--text-secondary);
}

/* ===== LOADING STATE ===== */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  color: var(--text-secondary);
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--border);
  border-top-color: var(--primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* ===== TABLE CONTAINER ===== */
.table-container {
  background: var(--bg-card);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  overflow: hidden;
  max-height: calc(100vh - 280px); /* ✅ Prevents full page scroll */
  display: flex;
  flex-direction: column;
}

/* ===== TABLE ===== */
.customer-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed; /* ✅ Ensures columns don't shift */
}

.customer-table thead {
  position: sticky; /* ✅ STICKY HEADERS */
  top: 0;
  background: linear-gradient(135deg, var(--primary), var(--primary-dark));
  color: black;
  z-index: 5; /* ✅ Stays above rows */
  box-shadow: 0 2px 4px rgba(0,0,0,0.1); /* ✅ Visual separation */
}

.customer-table th {
  padding: 1rem 1.25rem;
  text-align: left;
  font-weight: 600;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  position: relative;
}

/* Column widths */
.customer-table th:nth-child(1) { width: 30%; } /* Name */
.customer-table th:nth-child(2) { width: 35%; } /* Email */
.customer-table th:nth-child(3) { width: 15%; } /* Status */
.customer-table th:nth-child(4) { width: 20%; } /* Actions */

.actions-header {
  text-align: right;
}

.customer-table td {
  padding: 1rem 1.25rem;
  border-bottom: 1px solid var(--border);
  color: var(--text-primary);
  vertical-align: middle;
}

.customer-table tbody tr:last-child td {
  border-bottom: none;
}

/* ✅ SUBTLE HOVER: Border highlight instead of background change */
.table-row:hover {
  background: transparent; /* ✅ No light background */
}

.table-row:hover td {
  border-left: 3px solid var(--primary); /* ✅ Subtle visual cue */
  padding-left: calc(1.25rem - 3px); /* Adjust for border */
  transition: var(--transition);
}

/* ===== USER INFO ===== */
.user-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--primary), var(--primary-dark));
  color: black;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.9rem;
  flex-shrink: 0;
}

.user-name {
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.email-cell {
  color: var(--text-secondary);
  font-size: 0.9rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* ===== STATUS BADGE ===== */
.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.35rem 0.85rem;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: capitalize;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: currentColor;
}

.status-badge.active {
  background: #dcfce7;
  color: #166534;
}

.status-badge.inactive {
  background: #fee2e2;
  color: #991b1b;
}

/* ===== ACTION BUTTONS ===== */
.actions-cell {
  text-align: right;
  white-space: nowrap;
}

.action-btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition);
  margin-left: 0.5rem;
}

.toggle-btn {
  background: var(--primary-light);
  color: var(--primary-dark);
}

.toggle-btn:hover {
  background: var(--primary);
  color: #43a047;
  transform: translateY(-1px);
}

.delete-btn {
  background: #fef2f2;
  color: var(--danger);
}

.delete-btn:hover {
  background: var(--danger);
  color: red;
  transform: translateY(-1px);
}

.action-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none !important;
}

/* ===== EMPTY STATE ===== */
.empty-state {
  text-align: center;
  padding: 3rem 2rem;
  color: var(--text-secondary);
}

.empty-icon {
  width: 64px;
  height: 64px;
  margin: 0 auto 1rem;
  color: var(--border);
}

.empty-state p {
  font-weight: 500;
  margin: 0 0 0.25rem 0;
}

.empty-state span {
  font-size: 0.9rem;
}

/* ===== FOOTER ===== */
.table-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.25rem;
  background: var(--bg-card);
  border-top: 1px solid var(--border);
  flex-wrap: wrap;
  gap: 1rem;
  position: sticky;
  bottom: 0;
  z-index: 5;
}

.total-count {
  margin: 0;
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.total-count strong {
  color: var(--text-primary);
}

/* ===== PAGINATION ===== */
.pagination {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.page-btn,
.page-number {
  padding: 0.5rem 0.85rem;
  border: 1px solid var(--border);
  background: var(--bg-card);
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--text-primary);
  cursor: pointer;
  transition: var(--transition);
}

.page-btn:hover:not(:disabled),
.page-number:hover:not(.active) {
  border-color: var(--primary);
  color: var(--primary-dark);
  background: #fafafa;
}

.page-number.active {
  background: var(--primary);
  border-color: var(--primary);
  color: white;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* ===== SCROLLBAR STYLING ===== */
.table-container::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.table-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.table-container::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

.table-container::-webkit-scrollbar-thumb:hover {
  background: #a1a1a1;
}

/* ===== RESPONSIVE ===== */
@media (max-width: 768px) {
  .container {
    padding: 1rem;
  }
  
  .page-header {
    flex-direction: column;
    align-items: stretch;
    position: static; /* Disable sticky on mobile */
    padding-top: 0;
  }
  
  .search-box {
    max-width: 100%;
  }
  
  .customer-table {
    font-size: 0.9rem;
    display: block;
    overflow-x: auto; /* ✅ Horizontal scroll on mobile */
  }
  
  .customer-table th,
  .customer-table td {
    padding: 0.75rem;
  }
  
  .actions-cell {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    align-items: stretch;
  }
  
  .action-btn {
    margin-left: 0;
    width: 100%;
  }
  
  .table-footer {
    flex-direction: column;
    text-align: center;
    position: static;
  }
  
  /* Stack columns on very small screens */
  @media (max-width: 480px) {
    .customer-table thead {
      display: none; /* Hide header on tiny screens */
    }
    
    .customer-table tbody tr {
      display: block;
      margin-bottom: 1rem;
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 1rem;
    }
    
    .customer-table td {
      display: flex;
      justify-content: space-between;
      padding: 0.5rem 0;
      border-bottom: 1px dashed var(--border);
    }
    
    .customer-table td::before {
      content: attr(data-label);
      font-weight: 600;
      color: var(--text-secondary);
    }
    
    .customer-table td:last-child {
      border-bottom: none;
    }
  }
}
</style>