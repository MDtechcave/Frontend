<template>
  <footer class="footer">

    <div class="footer-container">

      <!-- Logo Section -->
      <div class="footer-section">
        <img src="@/assets/logo.png" alt="footer-logo" class="footer-logo" />
        <p>Eat healthy, live better.</p>
      </div>

      <!-- Quick Links -->
      <div class="footer-section">
        <h4>Quick Links</h4>
        <router-link to="/homeview">Home</router-link>
        <router-link to="/order">Orders</router-link>
        <router-link to="/contact">Contact</router-link>
        <router-link to="/about">About</router-link>
      </div>

      <!-- Contact -->
      <div class="footer-section">
        <h4>Contact Us</h4>
        <p>Email: support@healthyhabits.com</p>
        <p>Phone: +27 07 829 9087</p>
        <p>Cape Town, South Africa</p>
      </div>

      <!-- Social -->
      <div class="footer-section">
        <h4>Follow Us</h4>
        <div class="social-links">
          <a href="#">Facebook</a>
          <a href="#">Instagram</a>
        </div>
      </div>

    </div>

    <!-- Bottom Bar -->
    <div class="footer-bottom">
      <p>© 2026 Healthy Habitat | Eat healthy, live better</p>
    </div>

  </footer>
</template>

<style scoped>
.footer {
  background: #2E7D32;
  color: white;
  padding: 40px 10% 20px;
}

.footer-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 2rem;
  margin-bottom: 30px;
}

.footer-logo {
  width: 160px;
  margin-bottom: 10px;
  filter: brightness(1.1);
}

.footer-section h4 {
  margin-bottom: 15px;
  font-size: 16px;
  color: #F57C00;
}

.footer-section p,
.footer-section a {
  font-size: 14px;
  color: #ddd;
  margin-bottom: 8px;
  text-decoration: none;
  display: block;
}

.footer-section a:hover {
  color: #F57C00;
}

.social-links a {
  margin-right: 12px;
}

.footer-bottom {
  text-align: center;
  border-top: 1px solid rgba(255,255,255,0.2);
  padding-top: 15px;
  font-size: 13px;
}
</style>
