import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useSidebarStore = defineStore('sidebar', () => {
  // State
  const isSidebarOpen = ref(true)
  const windowWidth = ref(1024) // Default to desktop width

  // Getters
  const sidebarOpen = computed(() => isSidebarOpen.value)

  // Actions
  function toggleSidebar() {
    isSidebarOpen.value = !isSidebarOpen.value
  }

  function setSidebarOpen(value) {
    isSidebarOpen.value = value
  }

  function setWindowWidth(width) {
    windowWidth.value = width
    // Auto-close sidebar on mobile when resizing down
    if (width < 1024 && isSidebarOpen.value) {
      isSidebarOpen.value = false
    }
  }

  function initializeSidebar() {
    if (typeof window !== 'undefined') {
      windowWidth.value = window.innerWidth
      isSidebarOpen.value = window.innerWidth >= 1024
    }
  }

  return {
    // State
    isSidebarOpen,
    windowWidth,
    // Getters
    sidebarOpen,
    // Actions
    toggleSidebar,
    setSidebarOpen,
    setWindowWidth,
    initializeSidebar,
  }
})

