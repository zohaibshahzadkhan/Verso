<template>
  <div>
    <label class="block mb-1 font-medium">Customer</label>
    <select
      :value="modelValue"
      @change="updateValue($event.target.value)"
      class="border rounded p-2 w-full"
      :disabled="loading"
    >
      <option value="0">Select Customer</option>
      <option v-for="option in options" :key="option.id" :value="option.id">
        {{ option.name }}
      </option>
    </select>
    <p v-if="error" class="text-red-500 text-sm mt-1">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: string
  options: { id: string; name: string }[]
  error?: string
  loading: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

function updateValue(value: string) {
  emit('update:modelValue', value)
}
</script>
