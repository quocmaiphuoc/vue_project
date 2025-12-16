<script setup>
import { ref, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Button from 'primevue/button'

const route = useRoute()
const router = useRouter()

const mainNavItems = [
  { label: 'About us', path: '/about', command: () => {} },
  { label: 'Solutions', path: '/solutions', command: () => {} },
  { label: 'Where we are', path: '/where-we-are', command: () => {} },
  { label: 'News & Resources', path: '/news', command: () => {} }
]

const appMenuItems = [
  { 
    label: 'Excel', 
    icon: 'pi pi-file-excel',
    path: '/excel',
    command: () => router.push('/excel')
  },
  { 
    label: 'PDF', 
    icon: 'pi pi-file-pdf',
    path: '/pdf',
    command: () => router.push('/pdf')
  }
]

const isActive = (path) => {
  return route.path === path
}

const breadcrumbItems = computed(() => {
  const items = []
  
  // Home icon
  items.push({ 
    icon: 'pi pi-home',
    command: () => router.push('/')
  })
  
  // Current page label
  if (route.path !== '/') {
    items.push({ label: 'GROUP' })
  }
  
  return items
})

const getPageTitle = () => {
  if (route.path === '/excel') return 'Upload Excel & preview'
  if (route.path === '/pdf') return 'PDF file'
  if (route.path === '/login') return 'Azure AD login'
  return 'Client Workspace'
}
</script>

<template>
  <div class="app-container">
    <!-- Header Bar with Logo and Menu - Following CGV Design -->
    <header class="header-bar">
      <div class="header-content">
        <!-- Logo on Left -->
        <div class="header-logo" @click="router.push('/')">
          <span class="logo-text">CGV</span>
          <span class="logo-dot"></span>
        </div>
        
        <!-- Main Navigation Menu Items on Right (CGV Website Style) -->
        <nav class="header-nav">
          <!-- App Menu Items (Excel, PDF) -->
          <Button
            v-for="item in appMenuItems"
            :key="item.label"
            :label="item.label"
            :icon="item.icon"
            :class="['app-menu-button', { 'active-menu-item': isActive(item.path) }]"
            text
            severity="secondary"
            @click="item.command"
          />
        </nav>
      </div>
    </header>

    <!-- Split Layout -->
    <div class="split-layout">
      <!-- Left Section - Blue Background -->
      <div class="left-section">
        
        <div class="content-area">
          <RouterView />
        </div>
      </div>
    </div>
  </div>
</template>

<style>
:global(body) {
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  margin: 0;
  padding: 0;
  overflow-x: hidden;
  width: 100%;
  max-width: 100vw;
}

:global(html) {
  overflow-x: hidden;
  width: 100%;
  max-width: 100vw;
}

.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Header Bar - CGV Website Style */
.header-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1001;
  background: #ffffff;
  border-bottom: 1px solid #e0e0e0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  height: 70px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 3rem;
  height: 100%;
  max-width: 100%;
}

.header-logo {
  display: flex;
  align-items: baseline;
  gap: 0;
  cursor: pointer;
  transition: opacity 0.2s;
}

.header-logo:hover {
  opacity: 0.8;
}

.header-logo .logo-text {
  font-size: 1.75rem;
  font-weight: 600;
  color: #0b3d91;
  letter-spacing: -0.5px;
}

.header-logo .logo-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  background: #ff6b35;
  margin-left: 2px;
  border-radius: 2px;
}

.header-nav {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.nav-link {
  color: #333333;
  text-decoration: none;
  font-size: 0.95rem;
  font-weight: 500;
  padding: 0.5rem 0;
  transition: color 0.2s;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  position: relative;
}

.nav-link:hover {
  color: #0b3d91;
}

.nav-link.active {
  color: #0b3d91;
  border-bottom-color: #0b3d91;
}

.nav-divider {
  width: 1px;
  height: 24px;
  background: #e0e0e0;
  margin: 0 0.5rem;
}

.app-menu-button {
  font-weight: 500;
  color: #4b5b75;
  transition: all 0.2s;
  font-size: 0.95rem;
}

.app-menu-button:hover {
  color: #0b3d91;
  background: rgba(11, 61, 145, 0.08);
}

.app-menu-button.active-menu-item {
  color: #0b3d91;
  background: rgba(11, 61, 145, 0.1);
}

.app-menu-button :global(.p-button-icon) {
  margin-right: 0.5rem;
  font-size: 0.9rem;
}

/* Split Layout */
.split-layout {
  display: flex;
  min-height: 100vh;
  margin-top: 70px; /* Header bar height */
}

/* Left Section - Blue Background */
.left-section {
  flex: 1;
  background: #0b3d91;
  padding: 2rem 3rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  min-height: calc(100vh - 70px);
  overflow-x: hidden;
  width: 100%;
  max-width: 100%;
}

.logo-container {
  display: flex;
  align-items: baseline;
  gap: 0;
}

.logo-text {
  font-size: 2rem;
  font-weight: 600;
  color: #ffffff;
  letter-spacing: -0.5px;
}

.logo-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  background: #ff6b35;
  margin-left: 2px;
  border-radius: 2px;
}

.breadcrumb-container {
  margin-top: 1rem;
}

.breadcrumb :global(.p-breadcrumb) {
  background: transparent;
  border: none;
  padding: 0;
}

.breadcrumb :global(.p-breadcrumb-list) {
  gap: 0.5rem;
}

.breadcrumb :global(.p-breadcrumb-list li) {
  color: rgba(255, 255, 255, 0.8);
}

.breadcrumb :global(.p-breadcrumb-list li .pi) {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.875rem;
}

.breadcrumb :global(.p-breadcrumb-list li:last-child) {
  color: #ffffff;
  font-weight: 500;
}

.breadcrumb-link {
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  transition: color 0.2s;
}

.breadcrumb-link:hover {
  color: #ffffff;
}

.breadcrumb-text {
  color: #ffffff;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.content-area {
  flex: 1;
  display: flex;
  flex-direction: column;
}

/* Right Section - Cityscape Background */
.right-section {
  flex: 1;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%),
    url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800"><defs><linearGradient id="sky" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" style="stop-color:%230f172a;stop-opacity:1" /><stop offset="100%" style="stop-color:%231e293b;stop-opacity:1" /></linearGradient></defs><rect width="1200" height="800" fill="url(%23sky)"/><rect x="100" y="400" width="80" height="400" fill="%231e293b" opacity="0.8"/><rect x="200" y="300" width="100" height="500" fill="%231e293b" opacity="0.9"/><rect x="320" y="200" width="120" height="600" fill="%231e293b" opacity="0.85"/><rect x="460" y="150" width="60" height="650" fill="%23dc2626" opacity="0.7"/><rect x="540" y="100" width="80" height="700" fill="%231e293b" opacity="0.9"/><rect x="640" y="180" width="100" height="620" fill="%23dc2626" opacity="0.6"/><rect x="760" y="250" width="90" height="550" fill="%231e293b" opacity="0.85"/><rect x="870" y="320" width="70" height="480" fill="%231e293b" opacity="0.8"/><rect x="960" y="280" width="110" height="520" fill="%231e293b" opacity="0.9"/><circle cx="580" cy="120" r="3" fill="%23dc2626" opacity="0.9"/><circle cx="620" cy="140" r="2" fill="%23dc2626" opacity="0.8"/><rect x="460" y="100" width="200" height="50" fill="%23dc2626" opacity="0.5" rx="5"/></svg>');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;
}

.cityscape-overlay {
  width: 100%;
  height: 100%;
  background: linear-gradient(
    180deg,
    rgba(15, 23, 42, 0.3) 0%,
    rgba(30, 41, 59, 0.5) 50%,
    rgba(51, 65, 85, 0.7) 100%
  );
}

/* Content Styling */
.content-area :global(.card-space) {
  display: flex;
  justify-content: flex-start;
  width: 100%;
  max-width: 100%;
  overflow-x: hidden;
}

.content-area :global(.w-full) {
  width: 100%;
  max-width: 100%;
  overflow-x: hidden;
}

.content-area :global(.data-card),
.content-area :global(.pdf-card),
.content-area :global(.login-card) {
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

/* Responsive */
@media (max-width: 1024px) {
  .header-content {
    padding: 0 1.5rem;
  }
  
  .header-nav {
    gap: 1.5rem;
  }
  
  .nav-link {
    font-size: 0.9rem;
  }
}

@media (max-width: 768px) {
  .header-content {
    padding: 0 1rem;
  }
  
  .header-nav {
    gap: 1rem;
    flex-wrap: wrap;
  }
  
  .nav-link {
    font-size: 0.85rem;
  }
  
  .nav-divider {
    display: none;
  }
  
  .app-menu-button {
    font-size: 0.85rem;
  }
  
  .app-menu-button :global(.p-button-label) {
    display: none;
  }
  
  .app-menu-button :global(.p-button-icon) {
    margin-right: 0;
  }

  .split-layout {
    flex-direction: column;
  }

  .right-section {
    min-height: 300px;
  }

  .left-section {
    padding: 1.5rem;
  }
}
</style>
