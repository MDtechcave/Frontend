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