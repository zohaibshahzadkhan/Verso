<template>
  <div class="flex justify-between items-center mb-4">
    <h2 class="text-lg font-bold">Orders</h2>
    <button
      v-if="selectedOrder"
      @click="handleDelete"
      class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
      :disabled="deleteOrder.isLoading"
    >
      {{ deleteOrder.isLoading ? 'Deleting...' : 'Delete Selected' }}
    </button>
  </div>
</template>

<script setup lang="ts">
import type { Order } from '@/types'
import { defineProps } from 'vue'

const props = defineProps<{
  selectedOrder: Order | null
  deleteOrder: any
  handleDelete: () => void
}>()
</script>
