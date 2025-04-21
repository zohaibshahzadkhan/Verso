<template>
  <div class="p-4 bg-white shadow rounded">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-lg font-bold">Products</h2>
      <div class="flex space-x-2">
        <button
          v-if="selectedProduct"
          @click="handleDelete"
          class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
          :disabled="isDeleting"
        >
          {{ isDeleting ? 'Deleting...' : 'Delete Selected' }}
        </button>
      </div>
    </div>

    <div v-if="isLoading" class="text-center py-4">Loading products...</div>

    <div v-else-if="isError" class="text-red-500 py-4">
      Error loading products: {{ error?.message }}
    </div>

    <div v-else-if="!products?.length" class="text-gray-500 py-4">
      No products found. Create one using the form.
    </div>

    <ProductTable
      v-else
      :products="products"
      :selected-product="selectedProduct"
      @select="selectProduct"
      @edit="editProduct"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ProductTable from '@/components/products/ProductTable.vue'
import { useProducts } from '@/composables/useProducts'
import { useUIStore } from '@/stores/ui'

const { products, isLoading, isError, error, isDeleting, deleteProduct } = useProducts()
const selectedProduct = ref<Product | null>(null)
const emit = defineEmits(['edit'])

const uiStore = useUIStore()

function selectProduct(product: Product) {
  selectedProduct.value = product
}

function editProduct(product: Product) {
  emit('edit', product)
}

function handleDelete() {
  if (selectedProduct.value) {
    if (confirm(`Are you sure you want to delete ${selectedProduct.value.name}?`)) {
      deleteProduct.mutate(selectedProduct.value.id, {
        onSuccess: () => {
          uiStore.notify({ type: 'success', message: 'Product deleted successfully!' })
          selectedProduct.value = null
        },
        onError: () => {
          uiStore.notify({ type: 'error', message: 'Failed to delete the product.' })
        },
      })
    }
  }
}
</script>
