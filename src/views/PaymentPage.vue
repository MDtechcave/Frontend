<template>
  <div class="payment-wrapper">
    <h2>Complete Payment</h2>

    <div class="card">
      <p><strong>Amount:</strong> R{{ amount }}</p>
      <p v-if="orderId"><strong>Order ID:</strong> {{ orderId }}</p>

      <div v-if="!ready && !message" class="muted">Preparing secure payment...</div>
      <div id="payment-element" />

      <button :disabled="loading || !ready" @click="handlePayment">
        {{ loading ? "Processing..." : "Pay Now" }}
      </button>

      <p v-if="message" class="message">{{ message }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { loadStripe } from "@stripe/stripe-js";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const API_URL = import.meta.env.VITE_API_URL;
const PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

const amount = computed(() => Number(route.query.amount || 0));

const stripe = ref(null);
const elements = ref(null);
const loading = ref(false);
const ready = ref(false);
const message = ref("");
const orderId = ref(null);
const orderCode = ref(null); 

const subId = computed(() => {
  try {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    return user?.sub_id || user?.id || 1;
  } catch {
    return 1;
  }
});

onMounted(async () => {
  try {
    if (!amount.value || amount.value <= 0) {
      message.value = "No amount found. Please go back to checkout.";
      return;
    }
    if (!API_URL || !PUBLISHABLE_KEY) {
      message.value = "Missing frontend .env values (API URL or Stripe key).";
      return;
    }

    stripe.value = await loadStripe(PUBLISHABLE_KEY);
    if (!stripe.value) {
      message.value = "Stripe failed to load. Check your publishable key.";
      return;
    }

    // Created PaymentIntent 
    const res = await fetch(`${API_URL}/api/payments/create-payment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sub_id: subId.value,
        amount: amount.value, // rands, backend converts to cents
      }),
    });

console.log("API_URL:", API_URL);
console.log("Response status:", res.status);
const data = await res.json();
console.log("Response data:", data);


    if (!res.ok) {
      message.value = data?.error || "Failed to create payment.";
      return;
    }

    orderId.value = data.orderId || null;
    orderCode.value = data.orderCode || null;

    elements.value = stripe.value.elements({ clientSecret: data.clientSecret });
    const paymentElement = elements.value.create("payment");
    paymentElement.mount("#payment-element");

    ready.value = true;
  } catch (err) {
    message.value = err?.message || "Something went wrong.";
  }
});

const handlePayment = async () => {
  if (!stripe.value || !elements.value) return;

  loading.value = true;
  message.value = "";

  
  const { error: submitError } = await elements.value.submit();
  if (submitError) {
    message.value = submitError.message;
    loading.value = false;
    return;
  }

  const { error } = await stripe.value.confirmPayment({
    elements: elements.value,
    confirmParams: {
      return_url: window.location.origin + "/payment",
    },
    redirect: "if_required",
  });

  if (error) {
    message.value = error.message;
  } else {
    localStorage.setItem('orderCode', orderCode.value)
    localStorage.removeItem("cart");
    router.push("/success");
  }

  loading.value = false;
};
</script>

<style scoped>
.payment-wrapper {
  max-width: 520px;
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
  cursor: not-allowed;
}
.message {
  margin-top: 15px;
}
.muted {
  color: #666;
  margin: 10px 0;
}
</style>