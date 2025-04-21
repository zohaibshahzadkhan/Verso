<template>
  <table class="min-w-full border">
    <thead class="bg-gray-50">
      <tr>
        <th class="px-4 py-2 text-left">ID</th>
        <th class="px-4 py-2 text-left">Customer</th>
        <th class="px-4 py-2 text-left">Supplier</th>
        <th class="px-4 py-2 text-left">Products</th>
        <th class="px-4 py-2 text-left">Actions</th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="order in orders"
        :key="order.id"
        class="border-t hover:bg-gray-50 cursor-pointer"
        :class="{ 'bg-blue-50': selectedOrder?.id === order.id }"
        @click="selectOrder(order)"
      >
        <td class="px-4 py-2">{{ order.id }}</td>
        <td class="px-4 py-2">{{ findName(order.customerCompanyId, companies) }}</td>
        <td class="px-4 py-2">{{ findName(order.supplierCompanyId, companies) }}</td>
        <td class="px-4 py-2">
          <div class="flex flex-wrap gap-1">
            <span
              v-for="pid in order.products"
              :key="pid"
              class="bg-gray-100 text-xs px-2 py-1 rounded"
            >
              {{ findName(pid, products) }}
            </span>
          </div>
        </td>
        <td class="px-4 py-2">
          <button @click.stop="editOrder(order)" class="text-blue-500 hover:underline mr-2">
            Edit
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup lang="ts">
import type { Order } from '@/types'
import { defineProps, defineEmits } from 'vue'

const props = defineProps<{
  orders: Order[]
  companies: any[]
  products: any[]
  selectedOrder: Order | null
}>()

const emit = defineEmits<{
  (e: 'select', order: Order): void
  (e: 'edit', order: Order): void
}>()

function findName(id: number | string, list: { id: number | string; name: string }[] = []) {
  return list.find((i) => i.id === id)?.name ?? 'Unknown'
}

function selectOrder(order: Order) {
  emit('select', order)
}

function editOrder(order: Order) {
  emit('edit', order)
}
</script>
