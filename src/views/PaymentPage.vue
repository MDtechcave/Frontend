<template>
  <div class="payment-container">
    <h1 class="title">Payment</h1>

    <div v-if="cartItems.length" class="payment-items">
      <div v-for="item in cartItems" :key="item.id" class="payment-card">
        <img :src="item.image || placeholderImage" alt="" class="meal-img" />
        <div class="meal-info">
          <h3>{{ item.name }}</h3>
          <p>R{{ item.price }}</p>
        </div>
      </div>
    </div>

    <div class="payment-form">
      <input type="text" placeholder="Your Full Address" v-model="address" />
      <select v-model="paymentMethod">
        <option value="cash">Cash</option>
        <option value="card">Card</option>
      </select>
      <div v-if="paymentMethod === 'card'" class="card-details">
        <input type="text" placeholder="Card Number" v-model="cardNumber" />
        <input type="text" placeholder="Expiry MM/YY" v-model="expiry" />
        <input type="text" placeholder="CVV" v-model="cvv" />
      </div>
      <button class="btn confirm-btn" @click="confirmOrder">Confirm Order</button>
    </div>

    <p v-if="message" class="confirmation">{{ message }}</p>
  </div>
</template>

<script>
export default {
  name: "PaymentPage",
  data() {
    return {
      cartItems: [],
      placeholderImage: "https://via.placeholder.com/200?text=Meal",
      address: "",
      paymentMethod: "cash",
      cardNumber: "",
      expiry: "",
      cvv: "",
      message: "",
    };
  },
  mounted() {
    const stored = localStorage.getItem("cartItems");
    this.cartItems = stored ? JSON.parse(stored) : [
      { id: 1, name: "Sample Meal", price: 120, image: "" },
    ];
  },
  methods: {
    confirmOrder() {
      this.message = "Your order is on its way to you. We will contact you on the delivery of your order.";
    },
  },
};
</script>

<style scoped>
.payment-container {
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
  margin-bottom: 1rem;
  color: #2e7d32;
}

.payment-items {
  display: grid;
  grid-template-columns: repeat(auto-fill,minmax(250px,1fr));
  gap: 1.5rem;
  width: 100%;
  margin-bottom: 2rem;
}

.payment-card {
  background: #f5f5f5;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.payment-card:hover {
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

.payment-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  max-width: 400px;
}

.payment-form input,
.payment-form select {
  padding: 0.8rem 1rem;
  border-radius: 50px;
  border: 1px solid #ccc;
  outline: none;
  transition: all 0.3s ease;
}

.payment-form input:focus,
.payment-form select:focus {
  border-color: #66bb6a;
  box-shadow: 0 4px 10px rgba(102,187,106,0.3);
}

.btn {
  padding: 1rem 2rem;
  font-weight: bold;
  border-radius: 50px;
  color: white;
  text-decoration: none;
  background: linear-gradient(135deg,#66bb6a,#43a047);
  transition: all 0.3s ease;
  cursor: pointer;
}

.btn:hover {
  transform: scale(1.05) rotate(-1deg);
  box-shadow: 0 8px 15px rgba(66, 165, 245, 0.3);
}

.confirmation {
  margin-top: 1rem;
  font-size: 1.2rem;
  font-weight: bold;
  color: #2e7d32;
  text-align: center;
  animation: fadeIn 1s ease forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px);}
  to { opacity: 1; transform: translateY(0);}
}
</style>