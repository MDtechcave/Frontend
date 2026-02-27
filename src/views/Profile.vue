<!-- src/views/Profile.vue -->
<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import NavBar from '@/components/NavBar.vue'
import Footer from '@/components/Footer.vue'

const router = useRouter()

// Form state
const username = ref('')
const email = ref('')
const phone = ref('')
const address = ref('')
const city = ref('')
const notifications = ref({
  email: true,
  sms: false,
  promotions: false
})
const currentGoalId = ref(null)
const passwordForm = ref({
  current: '',
  new: '',
  confirm: ''
})

// Data from API
const goals = ref([])
const userPackages = ref([])
const userSubscription = ref(null)

// UI state
const successMessage = ref('')
const errorMessage = ref('')
const isLoading = ref(false)
const activeTab = ref('profile') // 'profile' | 'package' | 'security'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:2534'

// Load user data + packages from API
const loadUserData = async () => {
  try {
    const stored = localStorage.getItem('user')
    if (!stored) {
      router.push('/login')
      return
    }
    
    const user = JSON.parse(stored)
    
    // ✅ CRITICAL: Check for ID
    if (!user.id && !user.user_id) {
      console.error('User data missing ID - redirecting to login')
      localStorage.removeItem('user')
      router.push('/login')
      return
    }
    
    // Use either user.id or user.user_id
    const userId = user.id || user.user_id
    
    // Load profile data
    username.value = user.name || user.username || ''
    email.value = user.email || ''
    phone.value = user.phone || ''
    address.value = user.address || ''
    city.value = user.city || ''
    notifications.value = {
      email: user.notifications?.email ?? true,
      sms: user.notifications?.sms ?? false,
      promotions: user.notifications?.promotions ?? false
    }
    
    // ✅ Fetch goals (packages) from API
    await loadGoals()
    
    // ✅ Fetch user's subscription/package
    await loadUserSubscription(userId)
    
  } catch (err) {
    console.error('Failed to load user:', err)
    errorMessage.value = 'Failed to load profile. Please login again.'
    setTimeout(() => router.push('/login'), 2000)
  }
}

// Fetch available goals/packages
const loadGoals = async () => {
  try {
    const res = await fetch(`${API_URL}/api/goals`)
    if (!res.ok) throw new Error('Failed to fetch goals')
    
    const data = await res.json()
    goals.value = data
    console.log('✅ Loaded goals:', goals.value)
  } catch (err) {
    console.error('Error loading goals:', err)
    // Fallback to your known goals
    goals.value = [
      { goal_id: 1, goal_type: 'Weight Loss' },
      { goal_id: 2, goal_type: 'Muscle Gain' },
      { goal_id: 3, goal_type: 'Health Maintenance' }
    ]
  }
}

// Fetch user's current subscription
const loadUserSubscription = async (userId) => {
  try {
    const res = await fetch(`${API_URL}/api/subscription/user/${userId}`)
    if (res.ok) {
      const data = await res.json()
      userSubscription.value = data.data || data
      currentGoalId.value = userSubscription.value.goal_id || userSubscription.value.package_id
      
      console.log('✅ User subscription:', userSubscription.value)
      console.log('✅ Current goal ID:', currentGoalId.value)
    }
  } catch (err) {
    console.error('Error loading subscription:', err)
    // No subscription yet - that's okay
  }
}

const saveProfile = async () => {
  if (!username.value.trim()) {
    errorMessage.value = 'Username is required'
    return
  }

  isLoading.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    const stored = localStorage.getItem('user')
    const user = stored ? JSON.parse(stored) : {}
    
    // ✅ CRITICAL: Get numeric user_id, NOT email
    const userId = user.id || user.user_id
    
    // ✅ Debug log to verify we have the right ID
    console.log('🔍 Saving profile for userId:', userId, 'Type:', typeof userId)
    
    // ✅ Ensure userId is a number
    const numericUserId = parseInt(userId)
    if (isNaN(numericUserId)) {
      throw new Error('Invalid user ID - please login again')
    }

    const updateData = {
      name: username.value.trim(),
      email: email.value.trim(),
      address: address.value.trim() || null
    }

    // ✅ Use numeric ID in URL: /api/users/123 NOT /api/users/email@test.com
    const res = await fetch(`${API_URL}/api/users/${numericUserId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData)
    })

    const data = await res.json()

    if (!res.ok) {
      throw new Error(data.error || 'Failed to update profile')
    }

    // ✅ Update localStorage with new profile - PRESERVE ID!
    const updatedUser = {
      ...user,
      id: numericUserId,  // ✅ Always keep numeric ID
      name: data.data?.name || username.value.trim(),
      email: data.data?.email || email.value.trim(),
      address: data.data?.address || address.value.trim()
    }
    
    localStorage.setItem('user', JSON.stringify(updatedUser))

    // ✅ Notify NavBar and other components
    window.dispatchEvent(new Event('storage'))

    successMessage.value = 'Profile updated successfully!'
    setTimeout(() => { successMessage.value = '' }, 3000)

  } catch (err) {
    console.error('Save profile error:', err)
    errorMessage.value = err.message || 'Failed to save profile'
  } finally {
    isLoading.value = false
  }
}



// Update user's package/goal
const updatePackage = async () => {
  if (!currentGoalId.value) {
    errorMessage.value = 'Please select a package'
    return
  }
  
  isLoading.value = true
  errorMessage.value = ''
  successMessage.value = ''
  
  try {
    const stored = localStorage.getItem('user')
    const user = stored ? JSON.parse(stored) : {}
    const userId = user.id || user.user_id
    
    // ✅ Call API to update subscription
    const res = await fetch(`${API_URL}/api/subscription`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: userId,
        goal_id: parseInt(currentGoalId.value),
        status: 'active',
        updated_at: new Date().toISOString()
      })
    })
    
    if (!res.ok) {
      // If subscription doesn't exist, create it
      const createRes = await fetch(`${API_URL}/api/subscription`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          goal_id: parseInt(currentGoalId.value),
          start_date: new Date().toISOString().split('T')[0],
          status: 'active'
        })
      })
      
      if (!createRes.ok) throw new Error('Failed to update subscription')
    }
    
    // Update localStorage
    const updatedUser = {
      ...user,
      id: userId,  // ✅ Preserve ID!
      goal_id: parseInt(currentGoalId.value)
    }
    
    localStorage.setItem('user', JSON.stringify(updatedUser))
    window.dispatchEvent(new Event('storage'))
    
    const selectedGoal = goals.value.find(g => g.goal_id === currentGoalId.value)
    successMessage.value = `Package updated to ${selectedGoal?.goal_type}!`
    setTimeout(() => { successMessage.value = '' }, 3000)
    
    // Reload subscription
    await loadUserSubscription(userId)
    
  } catch (err) {
    console.error('Package update error:', err)
    errorMessage.value = 'Failed to update package. Please try again.'
  } finally {
    isLoading.value = false
  }
}

// Change password
const changePassword = async () => {
  const { current, new: newPassword, confirm } = passwordForm.value
  
  if (!current || !newPassword || !confirm) {
    errorMessage.value = 'All password fields are required'
    return
  }
  
  if (newPassword.length < 6) {
    errorMessage.value = 'New password must be at least 6 characters'
    return
  }
  
  if (newPassword !== confirm) {
    errorMessage.value = 'New passwords do not match'
    return
  }
  
  isLoading.value = true
  errorMessage.value = ''
  successMessage.value = ''
  
  try {
    const stored = localStorage.getItem('user')
    const user = stored ? JSON.parse(stored) : {}
    const userId = user.id || user.user_id
    
    // 🔐 Call API to change password
    const res = await fetch(`${API_URL}/api/users/change-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: userId,
        current_password: current,
        new_password: newPassword
      })
    })
    
    if (!res.ok) {
      const data = await res.json()
      throw new Error(data.error || 'Failed to change password')
    }
    
    successMessage.value = 'Password changed successfully!'
    passwordForm.value = { current: '', new: '', confirm: '' }
    setTimeout(() => { successMessage.value = '' }, 3000)
    
  } catch (err) {
    console.error('Password change error:', err)
    errorMessage.value = err.message || 'Failed to change password. Please try again.'
  } finally {
    isLoading.value = false
  }
}

// Logout
const handleLogout = () => {
  localStorage.removeItem('user')
  localStorage.removeItem('token')
  window.dispatchEvent(new Event('storage'))
  router.push('/login')
}

// Get current package name
const currentPackageName = computed(() => {
  if (!currentGoalId.value) return 'No Package Selected'
  const goal = goals.value.find(g => g.goal_id === currentGoalId.value)
  return goal?.goal_type || 'Unknown Package'
})

// Lifecycle
onMounted(() => {
  loadUserData()
})
</script>

<template>
  <NavBar />
  
  <div class="profile-page">
    <div class="profile-container">
      
      <!-- Header -->
      <div class="profile-header">
        <div class="avatar">
          <span>{{ username.charAt(0).toUpperCase() }}</span>
        </div>
        <div class="header-info">
          <h1>{{ username || 'My Profile' }}</h1>
          <p class="user-email">{{ email }}</p>
          <span class="package-badge">{{ currentPackageName }}</span>
        </div>
      </div>

      <!-- Tabs -->
      <div class="tabs">
        <button 
          :class="['tab-btn', { active: activeTab === 'profile' }]"
          @click="activeTab = 'profile'"
        >
          Profile
        </button>
        <button 
          :class="['tab-btn', { active: activeTab === 'package' }]"
          @click="activeTab = 'package'"
        >
          My Package
        </button>
        <button 
          :class="['tab-btn', { active: activeTab === 'security' }]"
          @click="activeTab = 'security'"
        >
          Security
        </button>
      </div>

      <!-- Messages -->
      <transition name="fade">
        <div v-if="successMessage" class="message success">
          {{ successMessage }}
        </div>
      </transition>
      <transition name="fade">
        <div v-if="errorMessage" class="message error">
          {{ errorMessage }}
        </div>
      </transition>

      <!-- PROFILE TAB -->
      <div v-if="activeTab === 'profile'" class="tab-content">
        <div class="card">
          <h2>Personal Information</h2>
          
          <div class="form-grid">
            <div class="form-group">
              <label>Username *</label>
              <input 
                v-model="username" 
                type="text" 
                placeholder="Your name"
                :disabled="isLoading"
              />
            </div>
            
            <div class="form-group">
              <label>Email Address</label>
              <input 
                v-model="email" 
                type="email" 
                placeholder="your@email.com"
                :disabled="isLoading"
              />
            </div>
            
            <div class="form-group">
              <label>Phone Number</label>
              <input 
                v-model="phone" 
                type="tel" 
                placeholder="+27 XX XXX XXXX"
                :disabled="isLoading"
              />
            </div>
            
            <div class="form-group">
              <label>City</label>
              <input 
                v-model="city" 
                type="text" 
                placeholder="e.g., Cape Town"
                :disabled="isLoading"
              />
            </div>
          </div>
          
          <div class="form-group full-width">
            <label>Street Address</label>
            <input 
              v-model="address" 
              type="text" 
              placeholder="123 Main Street"
              :disabled="isLoading"
            />
          </div>
          
          <button 
            class="save-btn" 
            @click="saveProfile" 
            :disabled="isLoading"
          >
            {{ isLoading ? 'Saving...' : 'Save Changes' }}
          </button>
        </div>
      </div>

      <!-- PACKAGE TAB -->
      <div v-if="activeTab === 'package'" class="tab-content">
        <div class="card">
          <h2>Manage Your Meal Package</h2>
          
          <!-- Current Package Display -->
          <div class="current-package">
            <p><strong>Current Package:</strong></p>
            <div class="package-display">
              <span class="package-name">{{ currentPackageName }}</span>
            </div>
          </div>
          
          <!-- Available Packages -->
          <div class="package-options">
            <h4>Available Packages</h4>
            
            <div 
              v-for="goal in goals" 
              :key="goal.goal_id"
              :class="['package-card', { selected: currentGoalId === goal.goal_id }]"
              @click="currentGoalId = goal.goal_id"
            >
              <div class="package-header">
                <h5>{{ goal.goal_type }}</h5>
              </div>
              <p class="package-desc">
                {{ goal.goal_type === 'Weight Loss' ? 'Calorie-controlled meals to help you reach your goals' :
                   goal.goal_type === 'Muscle Gain' ? 'Protein-rich meals to support muscle growth' :
                   'Balanced meals to maintain a healthy lifestyle' }}
              </p>
              <div class="package-radio">
                <input 
                  type="radio" 
                  :id="'goal-' + goal.goal_id" 
                  :value="goal.goal_id" 
                  v-model="currentGoalId"
                />
                <label :for="'goal-' + goal.goal_id">Select</label>
              </div>
            </div>
          </div>
          
          <button 
            class="save-btn" 
            @click="updatePackage" 
            :disabled="isLoading || !currentGoalId"
          >
            {{ isLoading ? 'Updating...' : ' Update Package' }}
          </button>
        </div>
      </div>

      <!-- SECURITY TAB -->
      <div v-if="activeTab === 'security'" class="tab-content">
        <div class="card">
          <h2>Change Password</h2>
          
          <div class="form-group">
            <label>Current Password</label>
            <input 
              v-model="passwordForm.current" 
              type="password" 
              placeholder="••••••••"
              :disabled="isLoading"
            />
          </div>
          
          <div class="form-group">
            <label>New Password</label>
            <input 
              v-model="passwordForm.new" 
              type="password" 
              placeholder="Minimum 6 characters"
              :disabled="isLoading"
            />
          </div>
          
          <div class="form-group">
            <label>Confirm New Password</label>
            <input 
              v-model="passwordForm.confirm" 
              type="password" 
              placeholder="Re-enter new password"
              :disabled="isLoading"
            />
          </div>
          
          <button 
            class="save-btn" 
            @click="changePassword" 
            :disabled="isLoading"
          >
            {{ isLoading ? 'Updating...' : 'Change Password' }}
          </button>
        </div>
        
        
          <button class="logout-btn" @click="handleLogout">
            Logout
          </button>
        </div>
      </div>

    </div>

  
  <Footer />
</template>

<style scoped>
/* ===== PAGE LAYOUT ===== */
.profile-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7f9 0%, #e8f5e9 100%);
  padding: 20px;
}

.profile-container {
  max-width: 700px;
  margin: 0 auto;
  padding: 20px;
}

/* ===== HEADER ===== */
.profile-header {
  display: flex;
  align-items: center;
  gap: 20px;
  background: white;
  padding: 25px;
  border-radius: 16px;
  margin-bottom: 25px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.avatar {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background: linear-gradient(135deg, #2E7D32, #4CAF50);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 28px;
  font-weight: 700;
  flex-shrink: 0;
}

.header-info h1 {
  margin: 0 0 5px 0;
  color: #1b5e20;
  font-size: 24px;
}

.user-email {
  margin: 0 0 10px 0;
  color: #666;
  font-size: 14px;
}

.package-badge {
  display: inline-block;
  background: linear-gradient(135deg, #2E7D32, #4CAF50);
  color: white;
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
}

/* ===== TABS ===== */
.tabs {
  display: flex;
  gap: 5px;
  background: white;
  padding: 8px;
  border-radius: 12px;
  margin-bottom: 25px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.tab-btn {
  flex: 1;
  padding: 12px;
  border: none;
  background: transparent;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  color: #666;
  transition: all 0.2s;
}

.tab-btn:hover {
  background: #f5f5f5;
  color: #2E7D32;
}

.tab-btn.active {
  background: #2E7D32;
  color: white;
}

/* ===== CARDS ===== */
.card {
  background: white;
  padding: 25px;
  border-radius: 16px;
  margin-bottom: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.card h2 {
  margin: 0 0 20px 0;
  color: #1b5e20;
  font-size: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
}

/* ===== FORMS ===== */
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

label {
  display: block;
  margin-bottom: 6px;
  font-weight: 500;
  color: #333;
  font-size: 14px;
}

input, select {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 10px;
  font-size: 14px;
  transition: border-color 0.2s, box-shadow 0.2s;
  background: #fafafa;
}

input:focus, select:focus {
  outline: none;
  border-color: #2E7D32;
  box-shadow: 0 0 0 3px rgba(46, 125, 50, 0.1);
  background: white;
}

input:disabled {
  background: #f5f5f5;
  cursor: not-allowed;
}

/* ===== CHECKBOXES ===== */
.checkbox-grid {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
  background: #fafafa;
}

.checkbox-label:hover {
  border-color: #2E7D32;
  background: #f1f8f1;
}

.checkbox-label input {
  width: auto;
  margin: 0;
  accent-color: #2E7D32;
}

/* ===== PACKAGE DISPLAY ===== */
.current-package {
  background: linear-gradient(135deg, #e8f5e9, #c8e6c9);
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 25px;
  border-left: 4px solid #2E7D32;
}

.package-display {
  margin-top: 10px;
}

.package-name {
  font-weight: 700;
  color: #1b5e20;
  font-size: 20px;
}

/* ===== PACKAGE OPTIONS ===== */
.package-options h4 {
  margin: 0 0 15px 0;
  color: #333;
}

.package-card {
  border: 2px solid #eee;
  border-radius: 12px;
  padding: 18px;
  margin-bottom: 12px;
  cursor: pointer;
  transition: all 0.2s;
  background: #fafafa;
}

.package-card:hover {
  border-color: #2E7D32;
  background: #f1f8f1;
}

.package-card.selected {
  border-color: #2E7D32;
  background: #e8f5e9;
  box-shadow: 0 4px 15px rgba(46, 125, 50, 0.15);
}

.package-header {
  margin-bottom: 8px;
}

.package-header h5 {
  margin: 0;
  color: #1b5e20;
  font-size: 16px;
  font-weight: 600;
}

.package-desc {
  margin: 0 0 12px 0;
  color: #555;
  font-size: 14px;
  line-height: 1.4;
}

.package-radio {
  display: flex;
  align-items: center;
  gap: 8px;
}

.package-radio input {
  width: auto;
  accent-color: #2E7D32;
}

.package-radio label {
  margin: 0;
  font-weight: 500;
  color: #2E7D32;
  cursor: pointer;
}

/* ===== BUTTONS ===== */
.save-btn {
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #2E7D32, #4CAF50);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  margin-top: 10px;
}

.save-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(46, 125, 50, 0.3);
}

.save-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

/* ===== MESSAGES ===== */
.message {
  padding: 12px 20px;
  border-radius: 10px;
  margin-bottom: 20px;
  font-weight: 500;
  animation: slideIn 0.3s ease;
}

.message.success {
  background: #e8f5e9;
  color: #1b5e20;
  border-left: 4px solid #2E7D32;
}

.message.error {
  background: #ffebee;
  color: #c62828;
  border-left: 4px solid #d32f2f;
}

@keyframes slideIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* ===== DANGER ZONE ===== */
.danger-zone {
  border: 2px solid #ffcdd2;
  background: #ffebee;
}

.danger-zone h3 {
  color: #c62828;
  margin: 0 0 10px 0;
}

.danger-zone p {
  color: #666;
  margin: 0 0 15px 0;
  font-size: 14px;
}

.logout-btn {
  width: 100%;
  padding: 12px;
  background: #d32f2f;
  color: white;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.logout-btn:hover {
  background: #c62828;
}

/* ===== RESPONSIVE ===== */
@media (max-width: 600px) {
  .profile-header {
    flex-direction: column;
    text-align: center;
  }
  
  .form-grid {
    grid-template-columns: 1fr;
  }
  
  .tabs {
    flex-wrap: wrap;
  }
  
  .tab-btn {
    padding: 10px;
    font-size: 13px;
  }
}
</style>