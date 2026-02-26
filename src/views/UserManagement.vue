<script setup>
import AdminNav from '@/components/AdminNav.vue'
import { ref, onMounted, computed } from 'vue'

const searchQuery = ref("")
const users = ref([])
const currentPage = ref(1)
const usersPerPage = 5

// 🔹 Fetch customers
// UserManagement.vue - onMounted
// UserManagement.vue - inside onMounted
// UserManagement.vue - onMounted
onMounted(async () => {
  try {
    const response = await fetch("http://localhost:2534/api/users")
    const data = await response.json()
    
    console.log("All users from API:", data)
    
    // ✅ Filter out ADMIN, show only USER roles
    users.value = data.filter(u => u.role?.toLowerCase() === "user")
    
    console.log("Customers found:", users.value.length)
    
  } catch (error) {
    console.error("Error fetching users:", error)
  }
})

// 🔍 SEARCH
const filteredUsers = computed(() => {
  if (!searchQuery.value) return users.value

  const query = searchQuery.value.toLowerCase()

  return users.value.filter(user => {
    const name = `${user.first_name} ${user.last_name}`.toLowerCase()

    return (
      name.includes(query) ||
      user.email.toLowerCase().includes(query)
    )
  })
})

// 📄 PAGINATION
const totalPages = computed(() =>
  Math.ceil(filteredUsers.value.length / usersPerPage)
)

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * usersPerPage
  const end = start + usersPerPage
  return filteredUsers.value.slice(start, end)
})

const goToPage = (page) => {
  currentPage.value = page
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

// 🔘 Toggle Status
const toggleStatus = (user) => {
  user.status = user.status === "active" ? "inactive" : "active"
}

// 🗑 Delete User
const deleteUser = (id) => {
  if (confirm("Are you sure you want to delete this customer?")) {
    users.value = users.value.filter(user => user.id !== id)
  }
}
</script>



<template>
  <AdminNav />

  <main>
    <div class="user-header">
      <h2>Customer Management</h2>

      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search by name or email"
      />
    </div>

    <div class="customer-table">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="user in paginatedUsers" :key="user.id">
            <td>{{ user.name }}</td>
            <

            <td>
              <span :class="user.status === 'active' ? 'active' : 'inactive'">
                {{ user.status }}
              </span>
            </td>

            <td>
              <button @click="toggleStatus(user)">
                {{ user.status === 'active' ? 'Deactivate' : 'Activate' }}
              </button>

              <button class="delete-btn" @click="deleteUser(user.id)">
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- No results -->
      <p v-if="filteredUsers.length === 0">
        No customers found.
      </p>

      <!-- Total -->
      <p class="total-users">
        Total Customers: {{ filteredUsers.length }}
      </p>

      <!-- Pagination -->
      <div class="pagination" v-if="totalPages > 1">

        <button 
          @click="prevPage"
          :disabled="currentPage === 1">
          Previous
        </button>

        <button
          v-for="page in totalPages"
          :key="page"
          @click="goToPage(page)"
          :class="{ activePage: currentPage === page }"
        >
          {{ page }}
        </button>

        <button
          @click="nextPage"
          :disabled="currentPage === totalPages">
          Next
        </button>

      </div>
    </div>
  </main>
</template>

    <style scoped>
    .search input{
        margin-bottom: 15px;
        padding: 8px;
        width: 300px;
    }
  
    .active {
  color: green;
  font-weight: bold;
}

.inactive {
  color: red;
  font-weight: bold;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 10px;
  border-bottom: 1px solid #ddd;
}

th {
  padding-top: 12px;
  padding-bottom: 12px;
  text-align: left;
  background-color: #43a047;
  color: white;
}

tr:nth-child(even){
    background-color: #f2f2f2;

}
tr:hover {
    background-color: #ddd;
}

.total-users {
  margin-top: 15px;
  font-weight: bold;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  gap: 15px;
}

.pagination button {
  padding: 6px 12px;
  background-color: #43a047;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 5px;
}

.pagination button:hover {
  background-color: #2e7d32;
}

button {
  padding: 5px 10px;
  margin-right: 5px;
  border: none;
  background-color: #43a047;
  color: white;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #2e7d32;
}

.delete-btn {
  background-color: #e53935;
}

.delete-btn:hover {
  background-color: #b71c1c;
}

.pagination button:disabled {
  background-color: #9e9e9e;
  cursor: not-allowed;
}

.activePage {
  background-color: #1b5e20 !important;
}

</style>