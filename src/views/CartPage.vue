<template>
  <div class="cart-container">
    <h1 class="title">Your Cart</h1>

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

    <router-link to="/checkout" class="btn proceed-btn">
      Proceed to Checkout
    </router-link>
  </div>
</template>

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
}

.price {
  font-weight: bold;
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
}
</style>