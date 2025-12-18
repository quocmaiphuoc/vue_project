<script setup>
defineProps({
  isOpen: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits(['toggle'])
</script>

<template>
  <!-- Sidebar overlay for mobile -->
  <Transition
    enter-active-class="transition-opacity duration-300"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition-opacity duration-300"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="isOpen"
      class="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
      @click="emit('toggle')"
    ></div>
  </Transition>

  <!-- Sidebar -->
  <aside
    :class="[
      'fixed inset-y-0 left-0 z-50 flex flex-col bg-blue-900',
      'transition-all duration-300 ease-in-out',
      isOpen ? 'w-64 translate-x-0' : 'w-16 -translate-x-full lg:translate-x-0',
    ]"
  >
    <!-- Logo -->
    <div class="flex items-center justify-center h-16 px-4">
      <Transition
        enter-active-class="transition-opacity duration-300"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-opacity duration-300"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div v-if="isOpen" class="text-white text-2xl font-bold whitespace-nowrap">
          cgv.
        </div>
      </Transition>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 px-4 py-4">
      <Transition
        enter-active-class="transition-opacity duration-300"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-opacity duration-300"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <a
          v-if="isOpen"
          href="#"
          class="flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-800 rounded-md"
        >
          <i class="pi pi-file mr-3 text-base flex-shrink-0" />
          <span class="whitespace-nowrap">Certificate of Insurance</span>
        </a>
      </Transition>
    </nav>

    <!-- Toggle Button - Always visible -->
    <div class="px-4 pb-4">
      <button
        @click="emit('toggle')"
        class="flex items-center justify-center w-full p-2 text-white hover:bg-blue-800 rounded-md transition-colors"
        :title="isOpen ? 'Collapse sidebar' : 'Expand sidebar'"
      >
        <i class="pi pi-bars text-xl" />
      </button>
    </div>
  </aside>
</template>

