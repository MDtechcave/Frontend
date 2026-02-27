<template>
  <footer class="footer">

    <div class="footer-container">

      <!-- Logo + Description -->
      <div class="footer-section brand">
        <img src="@/assets/logo.png" alt="Healthy Habits Logo" class="footer-logo" />
        <p class="tagline">
          Eat healthy. Live better. Stay consistent.
        </p>
      </div>

      <!-- Quick Links -->
      <div class="footer-section">
        <h4>Quick Links</h4>
        <router-link to="/">Home</router-link>
        <router-link to="/mealplan">Meal Plans</router-link>
        <router-link to="/events">Events</router-link>
        <router-link to="/contact">Contact</router-link>
      </div>

      <!-- Contact -->
      <div class="footer-section">
        <h4>Contact</h4>
        <p>📧 support@healthyhabits.com</p>
        <p>📞 +27 07 829 9087</p>
        <p>📍 Cape Town, South Africa</p>
      </div>

      <!-- Social -->
      <div class="footer-section">
        <h4>Follow Us</h4>
        <div class="social-links">
          <a href="#" target="_blank">🌐 Facebook</a>
          <a href="#" target="_blank">📸 Instagram</a>
        </div>
      </div>

    </div>

    <!-- Bottom Bar -->
    <div class="footer-bottom">
      <p>© 2026 Healthy Habits | Built for healthier lifestyles 💚</p>
    </div>

  </footer>
</template>

<style scoped>

.footer {
  background: linear-gradient(135deg, #215a24, #2E7D32);
  color: white;
  padding: 60px 8% 25px;
  margin-top: 60px;
}

.footer-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 2.5rem;
  margin-bottom: 40px;
}

.footer-section h4 {
  margin-bottom: 18px;
  font-size: 17px;
  font-weight: 900;
  color: #F57C00;
  letter-spacing: 0.5px;
}

.footer-section p,
.footer-section a {
  font-size: 14px;
  color: #e5e5e5;
  margin-bottom: 10px;
  text-decoration: none;
  display: block;
  font-weight: 600;
  transition: 0.2s ease;
}

.footer-section a:hover {
  color: #F57C00;
  transform: translateX(4px);
}

/* Brand Section */
.brand .tagline {
  margin-top: 12px;
  font-size: 14px;
  font-weight: 700;
  color: #f0f0f0;
  max-width: 250px;
}

.footer-logo {
  width: 150px;
  margin-bottom: 10px;
  filter: brightness(1.15);
}

/* Social Links */
.social-links a {
  margin-right: 15px;
  display: inline-block;
}

/* Bottom Bar */
.footer-bottom {
  text-align: center;
  border-top: 1px solid rgba(255,255,255,0.2);
  padding-top: 18px;
  font-size: 13px;
  font-weight: 700;
  color: #ddd;
}

/* Responsive */
@media (max-width: 768px) {
  .footer {
    padding: 50px 6% 20px;
  }

  .footer-container {
    gap: 2rem;
  }

  .footer-section {
    text-align: center;
  }

  .brand .tagline {
    margin: 12px auto 0;
  }
}

</style>