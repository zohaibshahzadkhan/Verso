<template>
  <div>
    <label class="block mb-1 font-medium">Products</label>

    <div v-if="isLoading" class="text-gray-500">Loading products...</div>
    <div v-else-if="isError" class="text-red-500">Error loading products</div>
    <div v-else-if="!products?.length" class="text-gray-500">No products available</div>

    <div v-else class="border rounded p-2 max-h-48 overflow-y-auto">
      <div v-for="p in products" :key="p.id" class="flex items-center py-1">
        <input
          type="checkbox"
          :value="p.id"
          :checked="modelValue.includes(p.id)"
          @change="toggleProduct(p.id)"
          class="mr-2"
        />
        <span>{{ p.name }} - ${{ p.price.toFixed(2) }}</span>
      </div>
    </div>

    <p v-if="error" class="text-red-500 text-sm mt-1">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  products: { id: string; name: string; price: number }[]
  modelValue: string[]
  error?: string
  isLoading: boolean
  isError: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string[]): void
}>()

function toggleProduct(productId: string) {
  const newValue = new Set(props.modelValue)

  if (newValue.has(productId)) {
    newValue.delete(productId)
  } else {
    newValue.add(productId)
  }
  emit('update:modelValue', Array.from(newValue))
}
</script>
