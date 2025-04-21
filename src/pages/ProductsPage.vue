<template>
  <div>
    <h1 class="text-2xl font-bold mb-4">Products Management</h1>
    <ProductForm
      :productToEdit="editingProduct"
      @updated="finishEditing"
      @created="finishEditing"
      @cancelled="finishEditing"
    />
    <ProductList @edit="startEditing" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ProductList from '@/components/products/ProductList.vue'
import ProductForm from '@/components/products/ProductForm.vue'
import type { Product } from '@/types'

const editingProduct = ref<Product | null>(null)

function startEditing(product: Product) {
  editingProduct.value = product
}

function finishEditing() {
  editingProduct.value = null
}
</script>
