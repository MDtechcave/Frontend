
<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const cart = ref([]);

onMounted(() => {
  cart.value = JSON.parse(localStorage.getItem("cart") || "[]");
});

const address = ref({ street: "", city: "", postalCode: "" });
const deliveryType = ref("standard");

// const discountApplied = ref(false);
// const discountAmount = ref(0);

const discountAmount = computed(() => {
  const price = cart.value[0]?.price || 0
  return Number(price) >= 350 ? 20 : 0
})

const subtotal = computed(() =>
  cart.value.reduce((sum, item) => sum + Number(item.price || 0), 0)
)

const tax = computed(() => subtotal.value - subtotal.value / 1.15)

const subtotalExTax = computed(() => subtotal.value / 1.15)

const deliveryCost = computed(() => deliveryType.value === 'express' ? 60 : 35)

const total = computed(() =>
  Math.max(0, subtotal.value + deliveryCost.value - discountAmount.value)
)

const discountApplied = computed(() => discountAmount.value > 0)

function goToPayment() {
  if (!cart.value.length) {
    alert("Cart is empty. Please choose a meal plan first.");
    router.push("/cart");
    return;
  }

  localStorage.setItem(
    "checkout",
    JSON.stringify({
      amount: Number(total.value),
      deliveryType: deliveryType.value,
      address: address.value,
      discountAmount: discountAmount.value,
      package: cart.value[0],
    })
  );

  router.push({
    path: "/payment",
    query: { amount: Number(total.value.toFixed(2)) },
  });
}
</script>

<template>
  <div class="checkout-container">
    <h1>Checkout</h1>

    <div v-if="cart.length === 0" class="section">
      <p>Your cart is empty.</p>
      <button class="payment-btn" @click="$router.push('/cart')">Go to Cart</button>
    </div>

    <template v-else>
      <div class="section">
        <h2>Delivery Address</h2>
        <input v-model="address.street" placeholder="Street Address" />
        <input v-model="address.city" placeholder="City" />
        <input v-model="address.postalCode" placeholder="Postal Code" />
      </div>

      <div class="section">
        <h2>Delivery Type</h2>
        <select v-model="deliveryType">
          <option value="standard">Standard (R35)</option>
          <option value="express">Express (R60)</option>
        </select>
      </div>

      <div class="section">
        <h2>Order Summary</h2>
        <div class="cart-item">
          <p>{{ cart[0].package_name }}</p>
          <p>R{{ cart[0].price }}</p>
        </div>
      </div>

      <div class="section summary">
        <p><span>Subtotal (incl. tax):</span><span>R{{ subtotal.toFixed(2) }}</span></p>
        <p><span>Tax included (15%):</span><span>R{{ tax.toFixed(2) }}</span></p>
        <p><span>Delivery:</span><span>R{{ deliveryCost.toFixed(2) }}</span></p>
        

        <h3><span>Total:</span><span>R{{ total.toFixed(2) }}</span></h3>

        
        <div v-if="discountApplied">
          <p><span>🎉Auto Discount:</span><span>-R{{ discountAmount.toFixed(2) }}</span></p>
        </div>


        
      </div>

      <button class="payment-btn" @click="goToPayment">
        Proceed to Payment
      </button>
    </template>
  </div>
</template>

<style scoped>
.checkout-container {
  max-width: 1100px;
  margin: 50px auto;
  padding: 30px;
  background: #f9f9f7;
  border-radius: 12px;
  font-family: 'Segoe UI', sans-serif;
}
h1 {
  text-align: center;
  margin-bottom: 30px;
  color: #2f3e34;
}
.section {
  background: white;
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
}
input, select {
  width: 100%;
  padding: 10px;
  margin-bottom: 12px;
  border-radius: 6px;
  border: 1px solid #ddd;
  font-size: 14px;
}
.cart-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #eee;
}
.summary p, .summary h3 {
  display: flex;
  justify-content: space-between;
  margin: 8px 0;
}
.summary button {
  margin-top: 10px;
  background-color: #ff8c00;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
}
.payment-btn {
  width: 100%;
  padding: 14px;
  background-color: #4CAF50;
  color: white;
  font-size: 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}
</style>