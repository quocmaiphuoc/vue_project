<template>
  <aside class="sidebar" :class="{ collapsed: isCollapsed }">
    <div class="logo-section">
      <div class="logo">
        <span class="logo-text" v-show="!isCollapsed">bms</span>
        <span class="logo-dot"></span>
      </div>
    </div>

    <nav class="sidebar-nav">
      <div 
        class="nav-item active" 
        @click="navigateTo('certificate')"
        :title="isCollapsed ? 'Certificate of Insurance' : ''"
      >
        <i class="pi pi-file nav-icon"></i>
        <span v-show="!isCollapsed">Certificate of Insurance</span>
      </div>
    </nav>

    <div class="sidebar-footer">
      <i 
        class="pi pi-bars hamburger-icon" 
        @click="toggleSidebar"
        :title="isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'"
      ></i>
    </div>
  </aside>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['show-logout-dialog', 'toggle'])

const isCollapsed = ref(false)

const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value
  emit('toggle', isCollapsed.value)
}

const navigateTo = (route) => {
  // Handle navigation if needed
  console.log('Navigate to:', route)
}
</script>

<style scoped>
.sidebar {
  width: 280px;
  background-color: var(--color-core-dark-blue);
  display: flex;
  flex-direction: column;
  padding: 24px 0;
  position: relative;
  transition: width 0.3s ease;
  overflow: hidden;
}

.sidebar.collapsed {
  width: 80px;
}

.sidebar-header {
  padding: 0 24px 24px 24px;
}

.logout-text {
  color: #B0B0B0;
  font-size: 14px;
  cursor: pointer;
  transition: color 0.2s;
}

.logout-text:hover {
  color: var(--color-core-white);
}

.logo-section {
  padding: 0 24px 32px 24px;
  transition: padding 0.3s ease;
}

.sidebar.collapsed .logo-section {
  padding: 0 16px 32px 16px;
  display: flex;
  justify-content: center;
}

.logo {
  display: flex;
  align-items: center;
  gap: 4px;
}

.logo-text {
  color: var(--color-core-white);
  font-size: 24px;
  font-weight: 600;
  letter-spacing: -0.5px;
}

.logo-dot {
  width: 10px;
  height: 10px;
  background-color: var(--color-core-bright-orange);
  border-radius: 50%;
  display: inline-block;
}

.sidebar-nav {
  flex: 1;
  padding: 0 16px;
  transition: padding 0.3s ease;
}

.sidebar.collapsed .sidebar-nav {
  padding: 0 8px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  color: #B0B0B0;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.2s;
  position: relative;
  white-space: nowrap;
}

.sidebar.collapsed .nav-item {
  padding: 12px;
  justify-content: center;
}

.nav-item:hover {
  background-color: rgba(255, 255, 255, 0.05);
  color: var(--color-core-white);
}

.nav-item.active {
  background-color: rgba(168, 218, 220, 0.15);
  color: var(--color-core-white);
}

.nav-item.active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 24px;
  background-color: var(--color-ext-light-blue);
  border-radius: 0 4px 4px 0;
}

.nav-icon {
  font-size: 18px;
}

.sidebar-footer {
  padding: 24px;
  display: flex;
  justify-content: start;
}

.hamburger-icon {
  color: var(--color-core-white);
  font-size: 24px;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.hamburger-icon:hover {
  opacity: 0.8;
}

.sidebar.collapsed .hamburger-icon {
  transform: rotate(180deg);
}
</style>

