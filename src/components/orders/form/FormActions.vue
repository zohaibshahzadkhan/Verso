<template>
  <div class="flex space-x-2">
    <button
      type="submit"
      class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      :disabled="isSubmitting || !isValid"
    >
      {{ isEditMode ? 'Update Order' : 'Create Order' }}
    </button>
    <button
      v-if="isEditMode"
      type="button"
      @click="$emit('cancel')"
      class="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
    >
      Cancel
    </button>
  </div>
</template>
<script setup lang="ts">
const props = defineProps(['isSubmitting', 'isValid', 'isEditMode'])
</script>
