<template>
  <div class="checkout-page">
    <h1>Checkout</h1>

    <div v-for="(item, index) in cart" :key="index">
      <p>{{ item.meal_name }} - R{{ item.price }}</p>
    </div>

    <h2>Total: R{{ total }}</h2>

    <button @click="goToPayment">
      Continue to Payment
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

function goToPayment() {
  router.push("/payment");
}
</script>