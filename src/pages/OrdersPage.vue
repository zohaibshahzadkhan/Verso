<template>
  <div>
    <h1 class="text-2xl font-bold mb-4">Orders Management</h1>

    <OrderList @edit="startEditing" />
    <OrderForm
      :orderToEdit="editingOrder"
      @updated="finishEditing"
      @created="finishEditing"
      @cancelled="finishEditing"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import OrderList from '@/components/orders/OrderList.vue'
import OrderForm from '@/components/orders/form/OrderForm.vue'
import type { Order } from '@/types'

const editingOrder = ref<Order | null>(null)

function startEditing(order: Order) {
  editingOrder.value = order
}

function finishEditing() {
  editingOrder.value = null
}
</script>
