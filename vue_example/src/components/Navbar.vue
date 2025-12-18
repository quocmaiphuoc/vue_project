<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const showProfileDropdown = ref(false)
const dropdownRef = ref(null)

const toggleProfileDropdown = () => {
  showProfileDropdown.value = !showProfileDropdown.value
}

const handleClickOutside = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    showProfileDropdown.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <header class="bg-white border-b border-gray-200">
    <div class="flex items-center justify-end px-6 py-4">
      <!-- Profile dropdown -->
      <div ref="dropdownRef" class="relative">
        <button
          @click.stop="toggleProfileDropdown"
          class="flex flex-col items-end focus:outline-none"
        >
          <div class="flex items-center space-x-2">
            <span class="text-sm font-medium text-gray-700">Robert Fox</span>
            <i class="pi pi-chevron-down text-sm text-gray-400" />
          </div>
        </button>

        <!-- Dropdown menu -->
        <div
          v-if="showProfileDropdown"
          class="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200"
        >
          <button
            class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Log out
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

