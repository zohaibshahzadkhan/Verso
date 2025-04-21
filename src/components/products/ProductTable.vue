<template>
  <table class="min-w-full border">
    <thead class="bg-gray-50">
      <tr>
        <th class="px-4 py-2 text-left">ID</th>
        <th class="px-4 py-2 text-left">Name</th>
        <th class="px-4 py-2 text-left">Price</th>
        <th class="px-4 py-2 text-left">Actions</th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="product in products"
        :key="product.id"
        class="border-t hover:bg-gray-50 cursor-pointer"
        :class="{ 'bg-blue-50': selectedProduct?.id === product.id }"
        @click="$emit('select', product)"
      >
        <td class="px-4 py-2">{{ product.id }}</td>
        <td class="px-4 py-2">{{ product.name }}</td>
        <td class="px-4 py-2">${{ product.price.toFixed(2) }}</td>
        <td class="px-4 py-2">
          <button @click.stop="$emit('edit', product)" class="text-blue-500 hover:underline mr-2">
            Edit
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup lang="ts">
import type { Product } from '@/types'

defineProps<{
  products: Product[]
  selectedProduct: Product | null
}>()

defineEmits<{
  (e: 'select', product: Product): void
  (e: 'edit', product: Product): void
}>()
</script>
