<template>
  <div class="payment-page">
    <h1>Payment</h1>

    <p>Total Amount: R{{ total }}</p>

    <!-- Stripe will be integrated here later -->
    <div class="stripe-placeholder">
      <p>Stripe Payment Integration Coming Soon</p>
    </div>

    <button @click="simulatePayment">
      Complete Payment
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

function simulatePayment() {
  alert("Payment Successful (Simulated)");

  localStorage.removeItem("cart");

  router.push("/");
}
</script>

<style scoped>
.stripe-placeholder {
  border: 2px dashed #ccc;
  padding: 20px;
  margin: 20px 0;
  text-align: center;
}
</style>