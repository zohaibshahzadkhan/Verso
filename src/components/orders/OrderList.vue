<template>
  <div class="p-4 mb-5 bg-white shadow rounded">
    <OrderHeader
      :selectedOrder="selectedOrder"
      :deleteOrder="deleteOrder"
      :handleDelete="handleDelete"
    />

    <div>
      <div v-if="isOrdersLoading" class="text-center py-4">Loading orders…</div>

      <div v-else-if="isOrdersError" class="text-red-500 py-4">
        Error loading orders: {{ ordersError?.message }}
      </div>

      <div v-else-if="!orders?.length" class="text-gray-500 py-4">
        No orders found. Create one using the form.
      </div>

      <div v-else>
        <div v-if="isCompaniesLoading || isProductsLoading" class="text-center py-4">
          Loading customers & products…
        </div>

        <div v-else-if="isCompaniesError" class="text-red-500 py-4">
          Error loading companies: {{ companiesError?.message }}
        </div>

        <div v-else-if="isProductsError" class="text-red-500 py-4">
          Error loading products: {{ productsError?.message }}
        </div>

        <OrderTable
          v-else
          :orders="orders"
          :companies="companies"
          :products="products"
          :selectedOrder="selectedOrder"
          @select="selectOrder"
          @edit="editOrder"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useCompanies } from '@/composables/useCompanies'
import { useProducts } from '@/composables/useProducts'
import { useOrders } from '@/composables/useOrders'
import { useUIStore } from '@/stores/ui'

import type { Order } from '@/types'

import OrderHeader from './OrderHeader.vue'
import OrderTable from './OrderTable.vue'

const { companies, isCompaniesLoading, isCompaniesError, companiesError } = useCompanies()
const { products, isProductsLoading, isProductsError, productsError } = useProducts()
const { orders, isOrdersLoading, isOrdersError, ordersError, deleteOrder } = useOrders()

const selectedOrder = ref<Order | null>(null)
const uiStore = useUIStore()

const emit = defineEmits<{
  (e: 'edit', order: Order): void
}>()

function selectOrder(order: Order) {
  selectedOrder.value = order
}

function editOrder(order: Order) {
  emit('edit', order)
}

function handleDelete() {
  if (!selectedOrder.value) return

  if (confirm(`Are you sure you want to delete order #${selectedOrder.value.id}?`)) {
    deleteOrder.mutate(selectedOrder.value.id, {
      onSuccess: () => {
        uiStore.notify({ type: 'success', message: 'Order deleted successfully!' })
        selectedOrder.value = null
      },
      onError: () => {
        uiStore.notify({ type: 'error', message: 'Failed to delete the order.' })
      },
    })
  }
}
</script>
