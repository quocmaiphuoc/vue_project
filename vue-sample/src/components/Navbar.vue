<template>
  <header class="navbar">
    <div class="navbar-right">
      <div ref="userProfileRef" class="user-profile" @click.stop="toggleUserMenu">
        <i class="pi pi-user profile-icon"></i>
        <span class="user-name">{{ userName }}</span>
        <i class="pi pi-chevron-down dropdown-icon"></i>
        <div v-if="showUserMenu" class="user-menu" @click.stop>
          <button class="logout-button" @click="handleLogout">
            Log out
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  userName: {
    type: String,
    default: 'User'
  }
})

const emit = defineEmits(['show-logout-dialog'])

const showUserMenu = ref(false)
const userProfileRef = ref(null)

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value
}

const handleLogout = () => {
  showUserMenu.value = false
  emit('show-logout-dialog')
}

const handleClickOutside = (event) => {
  if (userProfileRef.value && !userProfileRef.value.contains(event.target)) {
    showUserMenu.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 32px;
  border-bottom: 1px solid #E5E5E5;
  background-color: var(--color-core-white);
}

.navbar-right {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-left: auto;
}

.user-profile {
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 8px;
  transition: background-color 0.2s;
}

.user-profile:hover {
  background-color: #F5F5F5;
}

.profile-icon {
  color: #666666;
  font-size: 20px;
}

.user-name {
  color: #333333;
  font-size: 14px;
  font-weight: 500;
}

.dropdown-icon {
  color: #666666;
  font-size: 12px;
}

.user-menu {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  background-color: var(--color-core-white);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  padding: 8px;
  z-index: 100;
  min-width: 120px;
}

.logout-button {
  width: 100%;
  padding: 8px 16px;
  background-color: var(--color-core-red-orange);
  color: var(--color-core-white);
  border: none;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.logout-button:hover {
  background-color: #C02323;
}
</style>

