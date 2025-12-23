<script setup>
import { computed, onMounted, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { useSidebarStore } from '../stores/sidebar'
import Sidebar from '../components/Sidebar.vue'
import Navbar from '../components/Navbar.vue'

const router = useRouter()
const sidebarStore = useSidebarStore()
const { isSidebarOpen, windowWidth } = storeToRefs(sidebarStore)

// Set initial state based on screen size
const handleResize = () => {
  if (typeof window !== 'undefined') {
    sidebarStore.setWindowWidth(window.innerWidth)
  }
}

onMounted(() => {
  // Initialize sidebar state
  sidebarStore.initializeSidebar()
  
  // Add resize listener
  if (typeof window !== 'undefined') {
    window.addEventListener('resize', handleResize)
  }
})

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('resize', handleResize)
  }
})

const toggleSidebar = () => {
  sidebarStore.toggleSidebar()
}

const handleGenerateCOI = () => {
  // Navigate to generate COI or open modal
  console.log('Generate COI clicked')
}

const handleLogout = () => {
  // Navigate to login
  router.push('/login')
}

// Computed styles for main content - properly reactive
const mainContentStyle = computed(() => {
  const width = windowWidth.value
  const open = isSidebarOpen.value
  
  if (width >= 1024) {
    // Desktop: adjust width based on sidebar state
    return {
      marginLeft: open ? '256px' : '64px',
      width: open ? 'calc(100% - 256px)' : 'calc(100% - 64px)',
      transition: 'all 0.3s ease-in-out',
    }
  }
  // Mobile: full width
  return {
    marginLeft: '0',
    width: '100%',
    transition: 'all 0.3s ease-in-out',
  }
})
</script>

<template>
  <div class="relative flex h-screen w-full bg-gray-50 overflow-hidden">
    <!-- Sidebar -->
    <Sidebar :is-open="isSidebarOpen" @toggle="toggleSidebar" />

    <!-- Main content area -->
    <div
      class="flex flex-col overflow-hidden"
      :style="mainContentStyle"
    >
      <!-- Header -->
      <Navbar @generate-coi="handleGenerateCOI" @logout="handleLogout" />

      <!-- Main content - Router View -->
      <div class="flex-1 overflow-hidden">
        <router-view />
      </div>
    </div>
  </div>
</template>

