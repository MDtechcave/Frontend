<template>
  <div class="payment-wrapper">
    <h2>Complete Payment</h2>

    <div class="card">
      <p><strong>Amount:</strong> R{{ amountFromRoute }}</p>

      <div id="payment-element"></div>

      <button :disabled="loading" @click="handlePayment">
        {{ loading ? "Processing..." : "Pay Now" }}
      </button>

      <p v-if="message" class="message">{{ message }}</p>
    </div>
  </div>
</template>

<!-- <script setup>
import { ref, onMounted } from "vue";
import { loadStripe } from "@stripe/stripe-js";
import { useRoute } from "vue-router";

const route = useRoute();
const amount = Number(route.query.amount || 0);

const stripe = ref(null);
const elements = ref(null);
const loading = ref(false);
const message = ref("");
const amount = ref(199); // change dynamically if needed
const subId = 1; // change based on logged in user

const API_URL = import.meta.env.VITE_API_URL;
const PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

let clientSecret = null;

onMounted(async () => {
  stripe.value = await loadStripe(PUBLISHABLE_KEY);

  // 1️⃣ Create payment intent (calls your backend)
  const res = await fetch(`${API_URL}/api/payments/create-payment`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      sub_id: subId,
      amount: amount.value
    })
  });

  const data = await res.json();
  clientSecret = data.clientSecret;

  elements.value = stripe.value.elements({ clientSecret });

  const paymentElement = elements.value.create("payment");
  paymentElement.mount("#payment-element");
});

const handlePayment = async () => {
  loading.value = true;
  message.value = "";

  const { error } = await stripe.value.confirmPayment({
    elements: elements.value,
    redirect: "if_required"
  });

  if (error) {
    message.value = error.message;
  } else {
    message.value = "Payment successful! 🎉";
  }

  loading.value = false;
};
</script> -->
<script setup>
import { ref, onMounted, computed } from "vue";
import { loadStripe } from "@stripe/stripe-js";
import { useRoute } from "vue-router";

const route = useRoute();

// amount from checkout query (rands)
const amountFromRoute = computed(() => Number(route.query.amount || 0));

const stripe = ref(null);
const elements = ref(null);
const loading = ref(false);
const message = ref("");

const subId = 1; // TODO: replace with real user/sub id from auth later

const API_URL = import.meta.env.VITE_API_URL;
const PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

onMounted(async () => {
  try {
    if (!amountFromRoute.value || amountFromRoute.value <= 0) {
      message.value = "No amount found. Please go back to checkout.";
      return;
    }

    stripe.value = await loadStripe(PUBLISHABLE_KEY);
    if (!stripe.value) {
      message.value = "Stripe failed to load. Check your publishable key.";
      return;
    }

    // Create payment intent (calls your backend)
    const res = await fetch(`${API_URL}/api/payments/create-payment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sub_id: subId,
        amount: amountFromRoute.value
      })
    });

    const data = await res.json();
    if (!res.ok) {
      message.value = data?.error || "Failed to create payment.";
      return;
    }

    elements.value = stripe.value.elements({ clientSecret: data.clientSecret });

    const paymentElement = elements.value.create("payment");
    paymentElement.mount("#payment-element");
  } catch (err) {
    message.value = err.message || "Something went wrong.";
  }
});

const handlePayment = async () => {
  loading.value = true;
  message.value = "";

  const { error } = await stripe.value.confirmPayment({
    elements: elements.value,
    redirect: "if_required"
  });

  message.value = error ? error.message : "Payment successful! 🎉";
  loading.value = false;
};
</script>

<style scoped>
.payment-wrapper {
  max-width: 500px;
  margin: 40px auto;
  font-family: Arial;
}

.card {
  border: 1px solid #ddd;
  padding: 20px;
  border-radius: 12px;
}

button {
  width: 100%;
  padding: 12px;
  margin-top: 20px;
  background: black;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

button:disabled {
  opacity: 0.6;
}

.message {
  margin-top: 15px;
}
</style>