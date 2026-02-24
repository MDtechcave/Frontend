<!-- <template>
  
  <div class="cart-page">
    <h1>Your Cart</h1>

    <div v-if="cart.length === 0">
      <p>Your cart is empty.</p>
    </div>

    <div v-for="(item, index) in cart" :key="index" class="cart-item">
      <h3>{{ item.meal_name }}</h3>
      <p>R{{ item.price }}</p>
      <button @click="removeItem(index)" class="remove-btn">
        Remove
      </button>
    </div>

    <h2>Total: R{{ total }}</h2>

    <button v-if="cart.length > 0" class="checkout-btn" @click="goToCheckout">
      Proceed to Checkout
    </button>
  </div>
</template>

<!-- <script setup>
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
 -->

<!-- <script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const cart = ref([]);

onMounted(() => {
  const saved = localStorage.getItem("cart");
  const parsed = saved ? JSON.parse(saved) : null;

  // If nothing is saved yet, use demo items (so your UI + button shows)
  cart.value =
    Array.isArray(parsed) && parsed.length
      ? parsed
      : [
          { meal_name: "Chicken Bowl", price: "85" },
          { meal_name: "Chicken Bowl", price: "85" },
        ];

  // Keep it consistent: save whatever we’re displaying
  localStorage.setItem("cart", JSON.stringify(cart.value));
});

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
}

.price {
  font-weight: bold;
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
}
</style> -->
<template>
  <div class="cart-page">
    <h1>Your Cart</h1>

    <div v-if="cart.length === 0">
      <p>Your cart is empty.</p>
    </div>

    <div v-else class="cart-item">
      <div>
        <h3>{{ cart[0].package_name }}</h3>
        <p class="muted">7-day plan</p>
      </div>

      <div class="right">
        <p class="price">R{{ cart[0].price }}</p>
        <button @click="clearCart" class="remove-btn">Remove</button>
      </div>
    </div>

    <h2 v-if="cart.length">Total: R{{ total }}</h2>

    <button v-if="cart.length" class="checkout-btn" @click="goToCheckout">
      Proceed to Checkout
    </button>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const cart = ref([]);

onMounted(() => {
  const saved = localStorage.getItem("cart");
  cart.value = saved ? JSON.parse(saved) : [];
});

const total = computed(() =>
  cart.value.reduce((sum, item) => sum + Number(item.price || 0), 0)
);

function clearCart() {
  cart.value = [];
  localStorage.removeItem("cart");
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
.cart-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #eee;
  padding: 15px 0;
}
.right {
  display: flex;
  gap: 12px;
  align-items: center;
}
.price {
  font-weight: bold;
  color: #333;
}
.muted {
  color: #777;
  font-size: 0.9rem;
  margin-top: 4px;
}
.remove-btn {
  background-color: #d32f2f;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 20px;
  cursor: pointer;
  font-weight: 600;
}
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
  cursor: pointer;
}
</style>