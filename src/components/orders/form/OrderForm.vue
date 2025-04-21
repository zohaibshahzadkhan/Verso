<template>
  <form @submit.prevent="onSubmit" class="space-y-4">
    <CustomerSelect
      v-model="customerCompanyId"
      :options="companyOptions"
      :loading="isCompaniesLoading"
      :error="customerCompanyIdError"
    />

    <SupplierSelect
      v-model="supplierCompanyId"
      :options="companyOptions"
      :loading="isCompaniesLoading"
      :error="supplierCompanyIdError"
    />

    <ProductChecklist
      v-model="productsSelected"
      :products="productList || []"
      :error="productsError"
      :isLoading="isProductsLoading"
      :isError="isProductsError"
    />

    <FormActions
      :isSubmitting="createOrder.isLoading || updateOrder.isLoading"
      :isValid="isFormValid"
      :isEditMode="!!orderToEdit"
      @cancel="cancelEdit"
    />
  </form>
</template>

<script setup lang="ts">
import { watch, computed } from 'vue'
import { useForm, useField } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'

import { useOrders } from '@/composables/useOrders'
import { useCompanies } from '@/composables/useCompanies'
import { useProducts } from '@/composables/useProducts'
import { useUIStore } from '@/stores/ui'
import type { Order } from '@/types'

import CustomerSelect from './CustomerSelect.vue'
import SupplierSelect from './SupplierSelect.vue'
import ProductChecklist from './ProductChecklist.vue'
import FormActions from './FormActions.vue'

const props = defineProps<{ orderToEdit: Order | null }>()
const emit = defineEmits(['updated', 'created', 'cancelled'])

const uiStore = useUIStore()

const { companiesQuery } = useCompanies()
const { data: companiesData, isLoading: isCompaniesLoading } = companiesQuery

const {
  products: productList = [],
  isLoading: isProductsLoading,
  isError: isProductsError,
} = useProducts()

const { createOrder, updateOrder } = useOrders()

const validationSchema = toTypedSchema(
  z.object({
    customerCompanyId: z.string().min(1, 'Customer is required'),
    supplierCompanyId: z.string().min(1, 'Supplier is required'),
    products: z.array(z.string()).min(1, 'At least one product must be selected'),
  }),
)

const { handleSubmit, resetForm, setValues } = useForm({
  validationSchema,
  initialValues: {
    customerCompanyId: '0',
    supplierCompanyId: '0',
    products: [] as string[],
  },
})

const { value: customerCompanyId, errorMessage: customerCompanyIdError } =
  useField('customerCompanyId')
const { value: supplierCompanyId, errorMessage: supplierCompanyIdError } =
  useField('supplierCompanyId')
const { value: productsSelected, errorMessage: productsError } = useField<string[]>('products')

const companyOptions = computed(() => companiesData?.value ?? [])

watch(
  () => props.orderToEdit,
  (newOrder) => {
    if (newOrder) {
      setValues({
        customerCompanyId: newOrder.customerCompanyId,
        supplierCompanyId: newOrder.supplierCompanyId,
        products: [...newOrder.products],
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
  if (props.orderToEdit) {
    updateOrder.mutate(
      { id: props.orderToEdit.id, ...data },
      {
        onSuccess: () => {
          emit('updated')
          resetForm()
          uiStore.notify({ type: 'success', message: 'Order updated successfully!' })
        },
        onError: () => {
          uiStore.notify({ type: 'error', message: 'Failed to update the order.' })
        },
      },
    )
  } else {
    createOrder.mutate(data, {
      onSuccess: () => {
        emit('created')
        resetForm()
        uiStore.notify({ type: 'success', message: 'Order created successfully!' })
      },
      onError: () => {
        uiStore.notify({ type: 'error', message: 'Failed to create the order.' })
      },
    })
  }
})

const isFormValid = computed(() => {
  return (
    customerCompanyId.value !== '0' &&
    supplierCompanyId.value !== '0' &&
    productsSelected.value.length > 0
  )
})
</script>
