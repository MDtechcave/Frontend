<template>
  <div class="contact-container">
    <h1 class="title">Let's Get In Touch</h1>
    <p class="subtitle">
      We’d love to hear from you. Whether it’s a question, feedback, or partnership inquiry — we’re here for it.
    </p>

    <div class="contact-grid">

      <!-- Contact Info Cards -->
      <div class="contact-card">
        <i class="fas fa-envelope icon"></i>
        <h3>Email Address</h3>
        <p>support@healthyhabits.co.za</p>
      </div>

      <div class="contact-card">
        <i class="fas fa-phone icon"></i>
        <h3>Phone Number</h3>
        <p>+27 31 123 4567</p>
      </div>

      <div class="contact-card">
        <i class="fab fa-whatsapp icon"></i>
        <h3>WhatsApp Number</h3>
        <p>+27 72 987 6543</p>
      </div>

      <div class="contact-card">
        <i class="fas fa-map-marker-alt icon"></i>
        <h3>Head Office</h3>
        <p>City of Cape Town, South Africa</p>
      </div>

      <div class="contact-card">
        <i class="fas fa-clock icon"></i>
        <h3>Business Hours</h3>
        <p>Mon - Fri: 8AM - 6PM</p>
      </div>

    </div>

    <!-- Social Section -->
    <div class="social-section">
      <h2>Connect With Us</h2>
      <div class="social-icons">
        <i class="fab fa-facebook-f social"><img :src="facebookGif" alt="Facebook" /></i>
        <i class="fab fa-instagram social"><img :src="instagramGif" alt="Instagram" /></i>
        <i class="fab fa-twitter social"><img :src="xGif" alt="X" /></i>
        <i class="fab fa-linkedin-in social"><img :src="linkedinGif" alt="LinkedIn" /></i>
        <i class="fab fa-tiktok social"><img :src="tiktokGif" alt="TikTok" /></i>
      </div>
    </div>

    <!-- Contact Form -->
    <div class="form-section">
      <h2>Send Us a Message</h2>

      <form @submit.prevent="submitForm">
        <input type="text" v-model="name" placeholder="Your Name" required />
        <input type="email" v-model="email" placeholder="Your Email" required />
        <textarea v-model="message" placeholder="Your Message" required></textarea>
        <button type="submit">Send Message</button>
      </form>

      <p v-if="successMessage" class="success">
        {{ successMessage }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import tiktokGif from '../assets/icons8-tiktok-logo.gif'
import facebookGif from '../assets/icons8-facebook-circled.gif'
import instagramGif from '../assets/icons8-instagram-logo.gif'
import xGif from '../assets/icons8-x-logo-50.png'
import linkedinGif from '../assets/icons8-linkedin-2.gif'

const name = ref("");
const email = ref("");
const message = ref("");
const successMessage = ref("");

function submitForm() {
  successMessage.value = "Your message has been sent successfully!";
  name.value = "";
  email.value = "";
  message.value = "";
}
</script>

<style scoped>

.contact-container {
  padding-left: 2%;
  padding-right: 2%;
  text-align: center;
  background: linear-gradient(to bottom, #f7fff7, #e8f5e9);
}

p, h3, h2{
    color: black;
}

.title {
  font-size: 40px;
  margin-bottom: 10px;
  color: #2e7d32;
  animation: fadeInDown 1s ease;
}

.subtitle {
  margin-bottom: 40px;
  color: #555;
  animation: fadeIn 1.5s ease;
}

.contact-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 25px;
  margin-bottom: 50px;
}

.contact-card {
  background: white;
  padding: 25px;
  border-radius: 15px;
  box-shadow: 0 5px 20px rgba(0,0,0,0.08);
  transition: all 0.3s ease;
  cursor: pointer;
}

.contact-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 15px 30px rgba(0,0,0,0.15);
}

.icon {
  font-size: 30px;
  margin-bottom: 15px;
  color: #43a047;
}

.social-section {
  margin-bottom: 50px;
}

.social-icons {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 15px;
}

.social {
  font-size: 24px;
  color: #2e7d32;
  transition: 0.3s ease;
  cursor: pointer;
}

.social:hover {
  transform: scale(1.3);
  color: #1b5e20;
}

.form-section {
  max-width: 600px;
  margin: auto;
}

form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

input, textarea {
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #ccc;
  transition: 0.3s ease;
}

input:focus, textarea:focus {
  border-color: #43a047;
  outline: none;
  box-shadow: 0 0 5px rgba(67,160,71,0.5);
}

button {
  padding: 12px;
  border: none;
  border-radius: 8px;
  background: #43a047;
  color: white;
  font-weight: bold;
  cursor: pointer;
  transition: 0.3s ease;
}

button:hover {
  background: #2e7d32;
  transform: scale(1.05);
}

.success {
  margin-top: 15px;
  color: #2e7d32;
  font-weight: bold;
}

/* Animations */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes fadeInDown {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}

</style>
