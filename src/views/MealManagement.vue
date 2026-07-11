<template>
    <AdminNav />
  <div class="admin-meals">
    <h1 class="page-title">Meal Management</h1>

    <!-- ADD MEAL -->
    <div class="card">
      <h2>Add New Meal</h2>

      <div class="form-grid">
        <input v-model="meal_name" placeholder="Meal Name" />
        <input v-model="meal_type" placeholder="Meal Type" />
        <input v-model="description" placeholder="Description" />
        <input v-model="calories" type="number" placeholder="Calories" />
        <input v-model="carbs" type="number" placeholder="Carbs (g)" />
        <input v-model="protein" type="number" placeholder="Protein (g)" />
      </div>

      <button class="add-btn" @click="addMeal">
        Add Meal
      </button>
    </div>

    <!-- MEALS TABLE -->
    <div class="card">
      <h2>Meals List</h2>

      <table class="meals-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Calories</th>
            <th>Carbs</th>
            <th>Protein</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="meal in meals" :key="meal.meal_id">
            <td>{{ meal.meal_name }}</td>
            <td>{{ meal.meal_type }}</td>
            <td>{{ meal.calories }}</td>
            <td>{{ meal.carbs }}</td>
            <td>{{ meal.protein }}</td>
            <td>
              <button
                class="delete-btn"
                @click="deleteMeal(meal.meal_id)"
              >
                Delete
              </button>
            </td>
          </tr>

          <tr v-if="!meals.length">
            <td colspan="6" class="empty-row">
              No meals available
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import AdminNav from "@/components/AdminNav.vue";
import { ref, onMounted } from "vue";

const meals = ref([]);

const meal_name = ref("");
const meal_type = ref("");
const description = ref("");
const calories = ref("");
const carbs = ref("");
const protein = ref("");

// 🔥 CHANGE THIS TO YOUR BACKEND URL
const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:2534'}/api/meals`
// Fetch meals
const fetchMeals = async () => {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();
    meals.value = data;
  } catch (error) {
    console.error("Error fetching meals:", error);
  }
};

// Add meal
const addMeal = async () => {
  if (!meal_name.value || !meal_type.value) {
    alert("Please fill in required fields");
    return;
  }

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        meal_name: meal_name.value,
        meal_type: meal_type.value,
        description: description.value,
        image_url: null,
        calories: Number(calories.value) || 0,
        carbs: Number(carbs.value) || 0,
        protein: Number(protein.value) || 0,
      }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || "Failed to add meal");
    }

    const newMeal = await res.json();
    
    // Only push if we got a valid meal object
    if (newMeal && newMeal.meal_id) {
      meals.value.push(newMeal);
      
      // Reset form
      meal_name.value = "";
      meal_type.value = "";
      description.value = "";
      calories.value = "";
      carbs.value = "";
      protein.value = "";
    } else {
      throw new Error("Invalid response from server");
    }

  } catch (error) {
    console.error("Error adding meal:", error);
    alert(error.message);
  }
};
// Delete meal
const deleteMeal = async (id) => {
  if (!confirm("Are you sure you want to delete this meal?")) return;

  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) throw new Error("Failed to delete");

    fetchMeals();
  } catch (error) {
    console.error("Error deleting meal:", error);
  }
};

onMounted(fetchMeals);
</script>

<style scoped>
.admin-meals {
  padding: 40px;
  background: #f5f7f9;
  min-height: 100vh;
}

.page-title {
  color: #2e7d32;
  margin-bottom: 25px;
  font-size: 28px;
  font-weight: 700;
}

.card {
  background: white;
  border-radius: 16px;
  padding: 25px;
  margin-bottom: 30px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.05);
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
  margin-bottom: 15px;
}

input {
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ddd;
  transition: 0.2s ease;
}

input:focus {
  outline: none;
  border-color: #2e7d32;
  box-shadow: 0 0 0 2px rgba(46, 125, 50, 0.15);
}

.add-btn {
  background: #2e7d32;
  color: white;
  border: none;
  padding: 10px 18px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: 0.2s ease;
}

.add-btn:hover {
  background: #256628;
  transform: translateY(-1px);
}

.meals-table {
  width: 100%;
  border-collapse: collapse;
}

.meals-table th {
  text-align: left;
  padding: 12px;
  background: #f1f3f5;
  font-weight: 600;
}

.meals-table td {
  padding: 12px;
  border-bottom: 1px solid #eee;
}

.delete-btn {
  background: #e53935;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: 0.2s ease;
}

.delete-btn:hover {
  background: #c62828;
}

.empty-row {
  text-align: center;
  padding: 20px;
  color: #888;
}
</style>