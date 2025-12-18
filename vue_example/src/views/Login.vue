<template>
  <div class="login-container">
    <!-- Background Image -->
    <div class="background-image"></div>
    
    <!-- Login Content -->
    <div class="login-content">
      <!-- Logo -->
      <div class="logo-container">
        <div class="logo">
          <svg class="logo-icon" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
          <span class="logo-text">cgv.</span>
        </div>
      </div>

      <!-- Login Button -->
      <div class="login-button-container">
        <button
          @click="handleAzureLogin"
          class="azure-login-button"
        >
          <svg class="microsoft-icon" viewBox="0 0 23 23" fill="none">
            <path fill="#F25022" d="M0 0H11V11H0z"/>
            <path fill="#7FBA00" d="M12 0H23V11H12z"/>
            <path fill="#00A4EF" d="M0 12H11V23H0z"/>
            <path fill="#FFB900" d="M12 12H23V23H12z"/>
          </svg>
          <span>Đăng nhập với Microsoft Azure</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const handleAzureLogin = () => {
  // Azure AD login logic here
  // For now, redirect to main app
  // You'll need to integrate with @azure/msal-browser or similar
  console.log('Azure login clicked')
  
  // TODO: Implement Azure AD authentication
  // Example:
  // const msalInstance = new PublicClientApplication(msalConfig)
  // await msalInstance.loginPopup(loginRequest)
  
  // For demo purposes, redirect to main app
  router.push('/')
}
</script>

<style scoped>
.login-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.background-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('https://images.unsplash.com/photo-1557683316-973673baf926?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  z-index: 0;
}

.background-image::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(37, 99, 235, 0.8) 0%, rgba(79, 70, 229, 0.9) 100%);
  z-index: 1;
}

.login-content {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4rem;
  padding: 2rem;
}

.logo-container {
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.logo-icon {
  width: 80px;
  height: 80px;
  color: white;
}

.logo-text {
  font-size: 3rem;
  font-weight: bold;
  color: white;
  letter-spacing: 2px;
}

.login-button-container {
  display: flex;
  align-items: center;
  justify-content: center;
}

.azure-login-button {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 2.5rem;
  background: white;
  color: #2563eb;
  border: none;
  border-radius: 0.5rem;
  font-size: 1.125rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

.azure-login-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3);
  background: #f8fafc;
}

.azure-login-button:active {
  transform: translateY(0);
}

.microsoft-icon {
  width: 24px;
  height: 24px;
}
</style>

