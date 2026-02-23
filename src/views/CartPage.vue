<template>
  
  <div class="cart-page">
    <h1>Your Cart</h1>

    <div v-if="cart.length === 0">
      <p>Your cart is empty.</p>
    </div>

    <div v-for="(item, index) in cart" :key="index" class="cart-item">
      <h3>{{ item.meal_name }}</h3>
      <p>R{{ item.price }}</p>
      <button @click="removeItem(index)">Remove</button>
    </div>

    <h2>Total: R{{ total }}</h2>

    <button v-if="cart.length > 0" @click="goToCheckout">
      Proceed to Checkout
    </button>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const cart = ref(JSON.parse(localStorage.getItem("cart")) || []);

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
.cart-item {
  border-bottom: 1px solid #ddd;
  margin-bottom: 10px;
  padding-bottom: 10px;
}
</style>