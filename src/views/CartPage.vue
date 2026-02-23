<template>
<<<<<<< HEAD
  <div class="cart-container">
    <h1 class="title">Your Cart</h1>
=======
  
  <div class="cart-page">
    <h1>Your Cart</h1>
>>>>>>> 4fea8578cbb4beba3363aa6a602e2b5bceefab72

    <div v-if="cartItems.length" class="cart-items">
      <div v-for="item in cartItems" :key="item.id" class="cart-card">
        <img :src="item.image || placeholderImage" alt="" class="meal-img" />
        <div class="meal-info">
          <h3>{{ item.name }}</h3>
          <p>{{ item.description }}</p>
          <p>Calories: {{ item.calories }} | Protein: {{ item.protein }}g | Carbs: {{ item.carbs }}g</p>
          <p class="price">R{{ item.price }}</p>
        </div>
      </div>
    </div>
    <div v-else class="empty-cart">
      <p>No items in cart yet. Add some delicious meals!</p>
    </div>

<<<<<<< HEAD
    <router-link to="/checkout" class="btn proceed-btn">
=======
    <div v-for="(item, index) in cart" :key="index" class="cart-item">
      <h3>{{ item.meal_name }}</h3>
      <p>R{{ item.price }}</p>
      <button @click="removeItem(index)" class="remove-btn">
        Remove
      </button>
    </div>

    <h2>Total: R{{ total }}</h2>

    <button v-if="cart.length > 0" class="checkout-btn" @click="goToCheckout">
>>>>>>> 4fea8578cbb4beba3363aa6a602e2b5bceefab72
      Proceed to Checkout
    </router-link>
  </div>
</template>

<<<<<<< HEAD
<script>
export default {
  name: "Cart",
  data() {
    return {
      cartItems: [], // Can fill from localStorage or backend
      placeholderImage: "https://via.placeholder.com/200?text=Meal",
    };
  },
  mounted() {
    // Load cart items from localStorage if backend fails
    const stored = localStorage.getItem("cartItems");
    this.cartItems = stored ? JSON.parse(stored) : [
      { id: 1, name: "Sample Meal", description: "Tasty healthy meal", calories: 400, protein: 20, carbs: 50, price: 120, image: "" },
    ];
  },
};
</script>

<style scoped>
.cart-container {
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

h1, h2, h3, p{
  color: black;
}

.title {
  font-size: 2rem;
  margin-bottom: 1.5rem;
  color: #2e7d32;
}

.cart-items {
  display: grid;
  grid-template-columns: repeat(auto-fill,minmax(250px,1fr));
  gap: 1.5rem;
  width: 100%;
}

.cart-card {
  background: #f5f5f5;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.cart-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.2);
}

.meal-img {
  width: 100%;
  height: 150px;
  object-fit: cover;
}

.meal-info {
  padding: 1rem;
=======
<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const cart = ref([
  {meal_name: "Chicken Bowl", price: "85"},
  {meal_name: "Chicken Bowl", price: "85"},
]);

const total = computed(() =>
  cart.value.reduce((sum, item) => sum + Number(item.price), 0)
);

function removeItem(index) {
  cart.value.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart.value));
}

function goToCheckout() {
  router.push("/checkout");
}
</script>

<style scoped>
.cart-page {
  max-width: 800px;
  margin: 40px auto;
  padding: 20px;
}

.cart-page h1 {
  text-align: center;
  margin-bottom: 30px;
  color: #2E7D32;
}

.cart-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #eee;
  padding: 15px 0;
>>>>>>> 4fea8578cbb4beba3363aa6a602e2b5bceefab72
}

.price {
  font-weight: bold;
<<<<<<< HEAD
  color: #2e7d32;
}

.btn {
  margin-top: 2rem;
  padding: 1rem 2rem;
  background: linear-gradient(135deg,#66bb6a,#43a047);
  color: white;
  font-weight: bold;
  text-decoration: none;
  border-radius: 50px;
  display: inline-block;
  transition: all 0.3s ease;
}

.btn:hover {
  transform: scale(1.05) rotate(-1deg);
  box-shadow: 0 8px 15px rgba(66, 165, 245, 0.3);
=======
  color: #333;
}

/* Remove Button */
.remove-btn {
  background-color: #d32f2f;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 20px;
  cursor: pointer;
  font-weight: 600;
  transition: 0.3s ease;
}

.remove-btn:hover {
  background-color: #b71c1c;
  transform: scale(1.05);
}

/* Total Section */
.total {
  text-align: right;
  margin-top: 20px;
  color: #2E7D32;
}

/* Checkout Button */
.checkout-btn {
  display: block;
  margin-left: auto;
  margin-top: 20px;
  background-color: #F57C00;
  color: white;
  border: none;
  padding: 12px 25px;
  border-radius: 25px;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: 0.3s ease;
}

.checkout-btn:hover {
  background-color: #ef6c00;
  transform: scale(1.05);
>>>>>>> 4fea8578cbb4beba3363aa6a602e2b5bceefab72
}
</style>