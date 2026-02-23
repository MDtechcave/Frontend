<template>
  <div class="meal-card">
    <img :src="meal.image_url" alt="meal image" class="meal-img" />
    <h3>{{ meal.meal_name }}</h3>
    <p>{{ meal.description }}</p>
    <p>R{{ meal.price }}</p>

    <button @click="addToCart">Add to Cart</button>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";

const props = defineProps({
  meal: Object
});

const router = useRouter();

function addToCart() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  cart.push(props.meal);

  localStorage.setItem("cart", JSON.stringify(cart));

  router.push("/cart");
}
</script>

<style scoped>
.meal-card {
  border: 1px solid #ddd;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
}
.meal-img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}
</style>