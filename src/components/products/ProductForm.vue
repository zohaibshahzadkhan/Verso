<template>
  <div class="p-4 bg-white shadow rounded">
    <h2 class="text-lg font-bold mb-4">{{ productToEdit ? 'Edit Product' : 'Create Product' }}</h2>

    <form @submit.prevent="onSubmit" class="space-y-4">
      <div>
        <label class="block mb-1 font-medium">Name</label>
        <input v-model="name" placeholder="Product name" class="border rounded p-2 w-full" />
        <p v-if="nameError" class="text-red-500 text-sm mt-1">{{ nameError }}</p>
      </div>

      <div>
        <label class="block mb-1 font-medium">Price (USD)</label>
        <input
          type="number"
          v-model.number="price"
          placeholder="0.00"
          step="0.01"
          min="0.01"
          class="border rounded p-2 w-full"
        />
        <p v-if="priceError" class="text-red-500 text-sm mt-1">{{ priceError }}</p>
      </div>

      <div class="flex space-x-2">
        <button
          type="submit"
          class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          :disabled="isCreating || isUpdating"
        >
          {{ productToEdit ? 'Update Product' : 'Create Product' }}
        </button>

        <button
          v-if="productToEdit"
          type="button"
          @click="cancelEdit"
          class="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
        >
          Cancel
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { watch, computed } from 'vue'
import { useForm, useField } from 'vee-validate'
import { useProductValidation } from '@/composables/useProductValidation'
import { useProducts } from '@/composables/useProducts'
import type { Product } from '@/types'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'

import { useUIStore } from '@/stores/ui'

const uiStore = useUIStore()

const props = defineProps<{
  productToEdit: Product | null
}>()
const emit = defineEmits(['updated', 'created', 'cancelled'])

const { createProduct, updateProduct, isCreating, isUpdating } = useProducts()
const validationSchema = toTypedSchema(
  z.object({
    name: z.string().min(1, 'Name is required'),
    price: z.number().min(0.01, 'Price must be at least 0.01'),
  }),
)

const { handleSubmit, setValues, resetForm } = useForm({
  validationSchema,
  initialValues: { name: '', price: 0 },
  validateOnMount: false,
})

const { value: name, errorMessage: nameError } = useField('name')
const { value: price, errorMessage: priceError } = useField('price')

const formTitle = computed(() => (props.productToEdit ? 'Edit Product' : 'Create Product'))

const submitButtonText = computed(() => {
  if (props.productToEdit) {
    return 'Update Product'
  }
  return 'Create Product'
})

watch(
  () => props.productToEdit,
  (newProduct) => {
    if (newProduct) {
      setValues({
        name: newProduct.name,
        price: newProduct.price,
      })
    } else {
      resetForm()
    }
  },
  { immediate: true },
)

function cancelEdit() {
  resetForm()
  emit('cancelled')
}

const onSubmit = handleSubmit((data) => {
  if (props.productToEdit) {
    updateProduct.mutate(
      { id: props.productToEdit.id, ...data },
      {
        onSuccess: () => {
          emit('updated')
          resetForm()
          uiStore.notify({ type: 'success', message: 'Product updated successfully!' })
        },
        onError: () => {
          uiStore.notify({ type: 'error', message: 'Failed to update the product.' })
        },
      },
    )
  } else {
    createProduct.mutate(data, {
      onSuccess: () => {
        emit('created')
        resetForm()
        uiStore.notify({ type: 'success', message: 'Product created successfully!' })
      },
      onError: () => {
        uiStore.notify({ type: 'error', message: 'Failed to create the product.' })
      },
    })
  }
})
</script>
