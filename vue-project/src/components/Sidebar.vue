<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const props = defineProps({
  collapsed: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:collapsed'])

const route = useRoute()
const router = useRouter()

const sidebarCollapsed = computed({
  get: () => props.collapsed,
  set: (value) => emit('update:collapsed', value)
})

const mainMenuItems = [
  { label: 'Dashboard', icon: 'pi pi-home', path: '/' },
  { label: 'Team', icon: 'pi pi-users', path: '/team' },
  { label: 'Projects', icon: 'pi pi-folder', path: '/projects' },
  { label: 'Calendar', icon: 'pi pi-calendar', path: '/calendar' },
  { label: 'Documents', icon: 'pi pi-file', path: '/documents' },
  { label: 'Reports', icon: 'pi pi-chart-bar', path: '/reports' }
]

const teams = [
  { name: 'Heroicons', initial: 'H', color: 'bg-blue-500' },
  { name: 'Tailwind Labs', initial: 'T', color: 'bg-blue-500' },
  { name: 'Workcation', initial: 'W', color: 'bg-blue-500' }
]

const isActive = (path) => {
  if (path === '/') {
    return route.path === '/' || route.path === '/login'
  }
  return route.path === path || route.path.startsWith(path + '/')
}

const navigate = (path) => {
  router.push(path)
}
</script>

<template>
  <aside
    :class="[
      'bg-purple-900 transition-all duration-300',
      'fixed z-40',
      sidebarCollapsed ? 'w-20' : 'w-64'
    ]"
    style="left: 0; top: 4rem; bottom: 0; overflow-y: auto; overflow-x: hidden; height: calc(100vh - 4rem);"
  >
    <nav class="p-4 flex flex-col h-full">
      <!-- Logo/Icon at Top -->
      <div class="mb-8 flex items-center flex-shrink-0" :class="sidebarCollapsed ? 'justify-center' : ''">
        <div class="w-10 h-10 flex items-center justify-center cursor-pointer" @click="router.push('/')">
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"></path>
          </svg>
        </div>
      </div>

      <!-- Main Navigation Items -->
      <div class="space-y-1 mb-6 flex-shrink-0">
        <button
          v-for="item in mainMenuItems"
          :key="item.label"
          @click="navigate(item.path)"
          :class="[
            'w-full flex items-center gap-3 px-3 py-2.5 rounded-md transition-all duration-200 text-sm font-medium',
            isActive(item.path)
              ? 'bg-purple-800 text-white shadow-sm'
              : 'text-purple-100 hover:bg-purple-800 hover:text-white',
            sidebarCollapsed && 'justify-center px-2'
          ]"
          :title="sidebarCollapsed ? item.label : ''"
        >
          <i :class="[item.icon, 'text-lg flex-shrink-0']"></i>
          <span v-if="!sidebarCollapsed" class="whitespace-nowrap">{{ item.label }}</span>
        </button>
      </div>

      <!-- Your teams Section -->
      <div v-if="!sidebarCollapsed" class="mb-6 flex-shrink-0">
        <div class="text-xs font-semibold text-purple-300 uppercase tracking-wider mb-3 px-3">
          Your teams
        </div>
        <div class="space-y-2">
          <button
            v-for="team in teams"
            :key="team.name"
            class="w-full flex items-center gap-3 px-3 py-2 rounded-md text-purple-100 hover:bg-purple-800 transition-colors"
          >
            <div :class="[team.color, 'w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0']">
              {{ team.initial }}
            </div>
            <span class="text-sm whitespace-nowrap">{{ team.name }}</span>
          </button>
        </div>
      </div>

      <!-- Spacer to push Settings to bottom -->
      <div class="flex-1 min-h-0"></div>

      <!-- Settings at Bottom -->
      <div class="flex-shrink-0 pt-4 border-t border-purple-800">
        <button
          @click="navigate('/settings')"
          :class="[
            'w-full flex items-center gap-3 px-3 py-2.5 rounded-md transition-all duration-200 text-sm font-medium',
            isActive('/settings')
              ? 'bg-purple-800 text-white shadow-sm'
              : 'text-purple-100 hover:bg-purple-800 hover:text-white',
            sidebarCollapsed && 'justify-center px-2'
          ]"
          :title="sidebarCollapsed ? 'Settings' : ''"
        >
          <i class="pi pi-cog text-lg flex-shrink-0"></i>
          <span v-if="!sidebarCollapsed" class="whitespace-nowrap">Settings</span>
        </button>
      </div>
    </nav>
  </aside>
</template>

<style scoped>
/* Custom scrollbar for sidebar */
aside::-webkit-scrollbar {
  width: 6px;
}

aside::-webkit-scrollbar-track {
  background: transparent;
}

aside::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
}

aside::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}
</style>
