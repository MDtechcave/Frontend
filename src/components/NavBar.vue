<template>
 <nav class="navbar">
  <div class="navbar-container">

    <div class="logo-section">
      <img src="@/assets/logo.png" alt="Health Habits Logo" width="120" />
    </div>

    <div class="nav-links">
      <router-link to="/">Home</router-link>
      <router-link to="/orders">Orders</router-link>
       <router-link to="/about">Contact</router-link>
      <router-link to="/about">About</router-link>
      
    </div>

  </div>
</nav>

</template>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 5%;
  background: transparent;
  box-shadow: none;
  position:absolute;
  top: 0;
  left: 0;
  right: 0 ;
  z-index: 100;
  width: 100%;         
}

.navbar-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
}


.logo-section {
  display: flex;
  align-items: center;
}



.nav-links {
  display: flex;
  gap: 25px;
  flex: 1;
  justify-content: center;
  padding: 0 30px;
  font-weight: 600;
}

.nav-links a {
  color: white;
  text-decoration: none;
  font-weight: 500;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  position: relative;
  padding: 5px 0;
}

.nav-links a:hover {
  color: #F57C00
}

.nav-links a::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background: #F57C00;
  transition: width 0.3s;
}

.nav-links a:hover::after {
  width: 100%;
}

</style>
