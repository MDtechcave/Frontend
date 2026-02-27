<template>
  <div class="page">
    <NavBar />
    <Sidebar />

    <!-- main content wrapper so navbar/sidebar don’t fight the layout -->
    <main class="contact-container">
      <header class="hero">
        <h1 class="title">Let's Get In Touch</h1>
        <p class="subtitle">
          We’d love to hear from you. Whether it’s a question, feedback, or partnership inquiry — we’re here for it.
        </p>
      </header>

      <!-- Contact Info Cards -->
      <section class="contact-grid">
        <div class="contact-card">
          <div class="icon">📧</div>
          <h3>Email Address</h3>
          <p>support@healthyhabits.co.za</p>
        </div>

        <div class="contact-card">
          <div class="icon">📞</div>
          <h3>Phone Number</h3>
          <p>+27 31 123 4567</p>
        </div>

        <div class="contact-card">
          <div class="icon">💬</div>
          <h3>WhatsApp Number</h3>
          <p>+27 72 987 6543</p>
        </div>

        <div class="contact-card">
          <div class="icon">📍</div>
          <h3>Head Office</h3>
          <p>City of Cape Town, South Africa</p>
        </div>

        <div class="contact-card">
          <div class="icon">⏰</div>
          <h3>Business Hours</h3>
          <p>Mon - Fri: 8AM - 6PM</p>
        </div>
      </section>

      <!-- Social Section -->
      <section class="social-section">
        <h2>Connect With Us</h2>

        <!-- i switched this to buttons/links so it behaves properly -->
        <div class="social-icons">
          <a class="social" href="#" aria-label="Facebook">
            <img :src="facebookGif" alt="Facebook" />
          </a>

          <a class="social" href="#" aria-label="Instagram">
            <img :src="instagramGif" alt="Instagram" />
          </a>

          <a class="social" href="#" aria-label="X (Twitter)">
            <img :src="xGif" alt="X" />
          </a>

          <a class="social" href="#" aria-label="LinkedIn">
            <img :src="linkedinGif" alt="LinkedIn" />
          </a>

          <a class="social" href="#" aria-label="TikTok">
            <img :src="tiktokGif" alt="TikTok" />
          </a>
        </div>
      </section>

      <!-- Contact Form -->
      <section class="form-section">
        <h2>Send Us a Message</h2>

        <form class="form-card" @submit.prevent="submitForm">
          <input type="text" v-model="name" placeholder="Your Name" required />
          <input type="email" v-model="email" placeholder="Your Email" required />
          <textarea v-model="message" placeholder="Your Message" rows="5" required></textarea>

          <button type="submit">Send Message</button>

          <p v-if="successMessage" class="success">
            {{ successMessage }}
          </p>
        </form>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref } from "vue"
import NavBar from "@/components/NavBar.vue"
import Sidebar from "@/components/Sidebar.vue"

import tiktokGif from "../assets/icons8-tiktok-logo.gif"
import facebookGif from "../assets/icons8-facebook-circled.gif"
import instagramGif from "../assets/icons8-instagram-logo.gif"
import xGif from "../assets/icons8-x-logo-50.png"
import linkedinGif from "../assets/icons8-linkedin-2.gif"

const name = ref("")
const email = ref("")
const message = ref("")
const successMessage = ref("")

function submitForm() {
  // for the demo this is enough — later you can connect it to backend/email
  successMessage.value = "Your message has been sent successfully ✅"
  name.value = ""
  email.value = ""
  message.value = ""
}
</script>

<style scoped>
/* overall page */
.page{
  min-height: 100vh;
  background: linear-gradient(to bottom, #f7fff7, #ffffff);
}

/* wrapper */
.contact-container{
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 16px 70px;
  text-align: center;
}

/* hero */
.hero{
  padding-top: 10px;
  margin-bottom: 35px;
}

.title {
  font-size: clamp(28px, 4vw, 44px);
  margin: 0 0 10px;
  color: #2e7d32;
  font-weight: 1000;
  animation: fadeInDown 0.8s ease;
}

.subtitle {
  margin: 0 auto;
  max-width: 850px;
  color: #555;
  font-weight: 700;
  line-height: 1.5;
  animation: fadeIn 1.2s ease;
}

/* cards grid */
.contact-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 22px;
  margin-bottom: 55px;
}

.contact-card {
  background: white;
  padding: 22px;
  border-radius: 16px;
  box-shadow: 0 6px 22px rgba(0,0,0,0.08);
  transition: all 0.25s ease;
  border: 1px solid rgba(0,0,0,0.04);
}

.contact-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 18px 35px rgba(0,0,0,0.14);
  border-color: rgba(76,175,80,0.25);
}

.contact-card h3{
  margin: 10px 0 6px;
  color: #111;
  font-weight: 1000;
}

.contact-card p{
  margin: 0;
  color: #444;
  font-weight: 800;
}

/* icons inside cards */
.icon {
  width: 52px;
  height: 52px;
  margin: 0 auto;
  border-radius: 14px;
  background: rgba(67,160,71,0.12);
  color: #2e7d32;
  display:flex;
  align-items:center;
  justify-content:center;
  font-size: 26px;
}

/* socials */
.social-section {
  margin-bottom: 55px;
}

.social-section h2{
  margin: 0 0 14px;
  color: #111;
  font-weight: 1000;
}

.social-icons {
  display: flex;
  justify-content: center;
  gap: 14px;
  flex-wrap: wrap;
}

.social {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  background: white;
  border: 1px solid rgba(0,0,0,0.06);
  box-shadow: 0 8px 18px rgba(0,0,0,0.06);
  display:flex;
  align-items:center;
  justify-content:center;
  transition: 0.25s ease;
}

.social:hover{
  transform: translateY(-4px) scale(1.05);
  box-shadow: 0 14px 28px rgba(0,0,0,0.12);
  border-color: rgba(76,175,80,0.25);
}

.social img{
  width: 30px;
  height: 30px;
  object-fit: contain;
}

/* form section */
.form-section{
  max-width: 700px;
  margin: 0 auto;
}

.form-section h2{
  margin: 0 0 14px;
  color: #111;
  font-weight: 1000;
}

.form-card{
  background: white;
  padding: 22px;
  border-radius: 16px;
  box-shadow: 0 10px 26px rgba(0,0,0,0.08);
  border: 1px solid rgba(0,0,0,0.04);
  display:flex;
  flex-direction: column;
  gap: 14px;
  text-align: left;
}

input, textarea {
  padding: 12px;
  border-radius: 10px;
  border: 1.5px solid #d7d7d7;
  transition: 0.2s ease;
  font-weight: 800;
}

input:focus, textarea:focus {
  border-color: #43a047;
  outline: none;
  box-shadow: 0 0 0 4px rgba(67,160,71,0.15);
}

button {
  padding: 12px;
  border: none;
  border-radius: 12px;
  background: #43a047;
  color: white;
  font-weight: 1000;
  cursor: pointer;
  transition: 0.2s ease;
}

button:hover {
  background: #2e7d32;
  transform: translateY(-2px);
}

.success {
  margin: 0;
  color: #2e7d32;
  font-weight: 1000;
  text-align: center;
}

/* Animations */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes fadeInDown {
  from { opacity: 0; transform: translateY(-18px); }
  to { opacity: 1; transform: translateY(0); }
}

/* mobile tweaks */
@media (max-width: 480px){
  .contact-container{
    padding: 30px 14px 60px;
  }
  .social{
    width: 52px;
    height: 52px;
  }
}
</style>