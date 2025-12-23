<template>
  <div class="login-container">
    <div class="login-background"></div>
    <div class="login-box">
      <div class="logo">
        <span class="logo-text">cgv</span>
        <span class="logo-dot"></span>
      </div>
      <h2 class="welcome-text">Welcome to COI Generation</h2>
      <button class="login-button" @click="handleLogin">
        <i class="pi pi-shield login-icon"></i>
        <span>Log in</span>
      </button>
    </div>
  </div>
</template>

<script setup>
const emit = defineEmits(['login'])

const handleLogin = () => {
  // Handle login logic here
  emit('login')
}
</script>

<style scoped>
.login-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid var(--color-login-border);
  overflow: hidden;
}

.login-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #0D1B2A 0%, #1B263B 50%, #0D1B2A 100%);
  background-image: 
    radial-gradient(circle at 20% 50%, rgba(214, 40, 40, 0.3) 0%, transparent 50%),
    radial-gradient(circle at 80% 80%, rgba(214, 40, 40, 0.2) 0%, transparent 50%),
    linear-gradient(180deg, rgba(0, 48, 73, 0.4) 0%, transparent 100%);
  filter: blur(2px);
  z-index: 0;
}

.login-background::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: 
    repeating-linear-gradient(
      0deg,
      transparent,
      transparent 2px,
      rgba(214, 40, 40, 0.1) 2px,
      rgba(214, 40, 40, 0.1) 4px
    ),
    repeating-linear-gradient(
      90deg,
      transparent,
      transparent 2px,
      rgba(214, 40, 40, 0.1) 2px,
      rgba(214, 40, 40, 0.1) 4px
    );
  opacity: 0.3;
}

.login-box {
  position: relative;
  z-index: 1;
  background-color: var(--color-login-box-bg);
  border-radius: 16px;
  padding: 48px 64px;
  min-width: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
}

.logo {
  display: flex;
  align-items: center;
  gap: 4px;
}

.logo-text {
  color: var(--color-core-white);
  font-size: 32px;
  font-weight: 600;
  letter-spacing: -0.5px;
}

.logo-dot {
  width: 12px;
  height: 12px;
  background-color: var(--color-core-bright-orange);
  border-radius: 50%;
  display: inline-block;
}

.welcome-text {
  color: var(--color-core-white);
  font-size: 18px;
  font-weight: 400;
  text-align: center;
  margin: 0;
  letter-spacing: 0.5px;
}

.login-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  background-color: var(--color-core-bright-orange);
  color: var(--color-core-white);
  border: none;
  border-radius: 8px;
  padding: 14px 32px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
  max-width: 280px;
}

.login-button:hover {
  background-color: #E66F00;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(247, 127, 0, 0.4);
}

.login-button:active {
  transform: translateY(0);
}

.login-icon {
  color: var(--color-ext-light-blue);
  font-size: 18px;
}
</style>

