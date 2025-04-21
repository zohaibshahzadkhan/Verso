<template>
  <div class="z-50 flex justify-center mt-4">
    <transition-group name="notification">
      <div
        v-for="notification in uiStore.notifications"
        :key="notification.id"
        class="p-3 rounded shadow-md min-w-64 max-w-sm mb-2"
        :class="{
          'bg-green-100 text-green-800': notification.type === 'success',
          'bg-red-100 text-red-800': notification.type === 'error',
          'bg-blue-100 text-blue-800': notification.type === 'info',
        }"
      >
        <div class="flex justify-between items-center">
          <div>{{ notification.message }}</div>
          <button
            @click="uiStore.removeNotification(notification.id)"
            class="ml-2 text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>
      </div>
    </transition-group>
  </div>
</template>

<script setup lang="ts">
import { useUIStore } from '@/stores/ui'

const uiStore = useUIStore()
</script>

<style scoped>
.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s ease;
}
.notification-enter-from,
.notification-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
