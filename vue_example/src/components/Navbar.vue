<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import GenerateCOIModal from './GenerateCOIModal.vue'

const emit = defineEmits(['generate-coi', 'logout'])

const showProfileDropdown = ref(false)
const showLogoutDialog = ref(false)
const showGenerateCOIModal = ref(false)
const dropdownRef = ref(null)

const toggleProfileDropdown = () => {
  showProfileDropdown.value = !showProfileDropdown.value
}

const handleClickOutside = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    showProfileDropdown.value = false
  }
}

const handleLogout = () => {
  showProfileDropdown.value = false
  showLogoutDialog.value = true
}

const confirmLogout = () => {
  showLogoutDialog.value = false
  emit('logout')
}

const handleGenerateCOIConfirm = (data) => {
  console.log('Generate COI confirmed with data:', data)
  // Handle the confirmation - could emit event or call API
  showGenerateCOIModal.value = false
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
    <div class="flex items-center justify-between px-6 py-4">
      <!-- Left side - Empty for now -->
      <div></div>

      <!-- Right side -->
      <div class="flex items-center gap-4">
        <!-- Generate COI Button -->
        <Button
          label="+ Generate COI"
          icon="pi pi-plus"
          class="bg-blue-600 border-blue-600 hover:bg-blue-700"
          @click="showGenerateCOIModal = true"
        />

        <!-- Search Icon -->
        <button class="p-2 text-gray-500 hover:text-gray-700">
          <i class="pi pi-search text-lg" />
        </button>

        <!-- Profile dropdown -->
        <div ref="dropdownRef" class="relative">
          <button
            @click.stop="toggleProfileDropdown"
            class="flex items-center space-x-2 focus:outline-none"
          >
            <div class="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
              <i class="pi pi-user text-gray-600 text-sm" />
            </div>
            <span class="text-sm font-medium text-gray-700">Robert Fox</span>
            <i class="pi pi-chevron-down text-xs text-gray-400" />
          </button>

          <!-- Dropdown menu -->
          <div
            v-if="showProfileDropdown"
            class="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200"
          >
            <button
              @click="handleLogout"
              class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
            >
              Log out
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Logout Confirmation Dialog -->
    <Dialog
      v-model:visible="showLogoutDialog"
      modal
      header="Confirmation"
      :style="{ width: '400px' }"
      :draggable="false"
    >
      <div class="flex items-start gap-4">
        <div class="flex-shrink-0">
          <div class="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
            <i class="pi pi-exclamation-triangle text-orange-500 text-xl" />
          </div>
        </div>
        <p class="text-gray-700 mt-2">Are you sure to log out of the system?</p>
      </div>
      <template #footer>
        <Button
          label="No"
          severity="secondary"
          outlined
          @click="showLogoutDialog = false"
        />
        <Button
          label="Yes"
          severity="danger"
          @click="confirmLogout"
        />
      </template>
    </Dialog>

    <!-- Generate COI Modal -->
    <GenerateCOIModal
      v-model:visible="showGenerateCOIModal"
      @confirm="handleGenerateCOIConfirm"
      @cancel="showGenerateCOIModal = false"
    />
  </header>
</template>

