<template>
  <div class="cart-wrapper">
    <div class="cart-card">
      <div class="cart-header">
        <h2>Cart</h2>
      </div>

      <!-- CART ITEMS -->
      <div
        v-for="(item, index) in cart"
        :key="index"
        class="cart-item"
      >
        <img
          :src="item.image || defaultImage"
          class="plan-image"
        />

        <div class="item-info">
          <h3>{{ item.package_name }}</h3>
          <p class="price">R{{ item.price }}</p>
        </div>

        <button class="remove-btn" @click="removeItem(index)">
          ✕
        </button>
      </div>

      <!-- SUMMARY -->
      <div v-if="cart.length" class="summary">
        <div class="row">
          <span>Subtotal</span>
          <span>R{{ subtotal }}</span>
        </div>

        <div class="row">
          <span>Delivery</span>
          <span>R{{ delivery }}</span>
        </div>

        <div class="row total">
          <span>Total</span>
          <span>R{{ total }}</span>
        </div>
      </div>

      <!-- CHECKOUT -->
      <button
        v-if="cart.length"
        class="checkout-btn"
        @click="goToCheckout"
      >
        CHECK OUT
      </button>

      <div v-if="!cart.length" class="empty">
        Your cart is empty 🛒
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const cart = ref([]);
const delivery = 35;
const defaultImage =
  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c  ";

onMounted(() => {
  const saved = localStorage.getItem("cart");
  cart.value = saved ? JSON.parse(saved) : [];
});

const subtotal = computed(() =>
  cart.value.reduce((sum, item) => sum + Number(item.price || 0), 0)
);

// ✅ Total = subtotal + delivery (discount removed - handled in checkout)
const total = computed(() =>
  subtotal.value + delivery
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
.cart-wrapper {
  background: #f3f4f6;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  padding: 40px 15px;
}

.cart-card {
  width: 100%;
  max-width: 420px;
  background: white;
  border-radius: 25px;
  padding: 25px;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.08);
}

.cart-header {
  text-align: center;
  margin-bottom: 25px;
}

.cart-item {
  display: flex;
  align-items: center;
  margin-bottom: 18px;
  gap: 15px;
}

.plan-image {
  width: 60px;
  height: 60px;
  border-radius: 15px;
  object-fit: cover;
}

.item-info {
  flex: 1;
}

.item-info h3 {
  font-size: 0.95rem;
  margin: 0;
  color: #1f2937;
}

.price {
  margin-top: 5px;
  color: #16a34a;
  font-weight: 600;
}

.remove-btn {
  background: #ef4444;
  border: none;
  color: white;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  cursor: pointer;
  font-weight: bold;
  transition: 0.2s ease;
}

.remove-btn:hover {
  background: #dc2626;
}

.summary {
  margin-top: 20px;
}

.row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  color: #374151;
}

.total {
  font-weight: 700;
  font-size: 1.1rem;
  margin-top: 10px;
  border-top: 1px solid #e5e7eb;
  padding-top: 10px;
}

.checkout-btn {
  width: 100%;
  margin-top: 20px;
  padding: 14px;
  background: #166534;
  color: white;
  border: none;
  border-radius: 18px;
  font-weight: bold;
  cursor: pointer;
  transition: 0.3s ease;
}

.checkout-btn:hover {
  background: #14532d;
  transform: translateY(-2px);
}

.empty {
  text-align: center;
  color: #6b7280;
  padding: 40px 0;
}
</style>