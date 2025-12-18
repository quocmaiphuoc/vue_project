<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const showUserDropdown = ref(false)
const userDropdownRef = ref(null)

const handleClickOutside = (event) => {
  if (userDropdownRef.value && !userDropdownRef.value.contains(event.target)) {
    showUserDropdown.value = false
  }
}

const toggleUserDropdown = () => {
  showUserDropdown.value = !showUserDropdown.value
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <header class="bg-gray-100 border-b border-gray-200 fixed top-0 left-0 right-0 z-50 h-16 flex-shrink-0">
    <div class="flex items-center justify-between h-full px-6">
      <!-- Search Bar on Left -->
      <div class="flex-1 max-w-lg">
        <div class="relative">
          <i class="pi pi-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm"></i>
          <input
            type="text"
            placeholder="Search"
            class="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
          />
        </div>
      </div>

      <!-- Right Side - Notifications and User Profile -->
      <div class="flex items-center gap-4 ml-6">
        <!-- Bell Icon -->
        <button class="p-2 hover:bg-gray-200 rounded-md transition-colors relative">
          <i class="pi pi-bell text-gray-600 text-lg"></i>
        </button>
        
        <!-- Separator -->
        <div class="h-6 w-px bg-gray-300"></div>
        
        <!-- User Profile Dropdown -->
        <div class="relative" ref="userDropdownRef">
          <button
            @click.stop="toggleUserDropdown"
            class="flex items-center gap-3 p-1 hover:bg-gray-200 rounded-md transition-colors"
          >
            <div class="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
              <img
                src="https://ui-avatars.com/api/?name=Tom+Cook&background=6366f1&color=fff"
                alt="Tom Cook"
                class="w-full h-full object-cover"
              />
            </div>
            <span class="text-sm font-medium text-gray-700">Tom Cook</span>
            <i class="pi pi-chevron-down text-gray-500 text-xs"></i>
          </button>
          
          <!-- Dropdown Menu -->
          <div
            v-if="showUserDropdown"
            class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50"
          >
            <a
              href="#"
              class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              @click.prevent="toggleUserDropdown"
            >
              Your profile
            </a>
            <a
              href="#"
              class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              @click.prevent="toggleUserDropdown"
            >
              Sign out
            </a>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

