<script setup>
import { ref } from 'vue'
import Topbar from './Topbar.vue'
import Sidebar from './Sidebar.vue'

const sidebarCollapsed = ref(false)
</script>

<template>
  <div class="min-h-screen bg-white flex flex-col">
    <!-- Topbar - Fixed at top -->
    <Topbar />

    <!-- Main Container - Sidebar + Content -->
    <div class="flex flex-1 pt-16">
      <!-- Sidebar - Fixed on left, below topbar -->
      <Sidebar v-model:collapsed="sidebarCollapsed" />

      <!-- Main Content - Right of sidebar -->
      <main
        :class="[
          'transition-all duration-300 bg-white overflow-x-hidden',
          sidebarCollapsed ? 'ml-20' : 'ml-64'
        ]"
        :style="{
          width: sidebarCollapsed ? 'calc(100% - 5rem)' : 'calc(100% - 16rem)',
          backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,.03) 10px, rgba(0,0,0,.03) 20px)',
          minHeight: 'calc(100vh - 4rem)'
        }"
      >
        <div class="p-6 h-full overflow-y-auto">
          <slot />
        </div>
      </main>
    </div>
  </div>
</template>
