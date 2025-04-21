<template>
  <nav class="bg-gray-800 text-white p-4">
    <div class="container mx-auto flex justify-between items-center">
      <div class="font-bold text-xl">VERSO</div>
      <div class="space-x-4">
        <router-link
          v-for="route in routes"
          :key="route.path"
          :to="route.path"
          class="px-3 py-2 hover:bg-gray-700 rounded"
          :class="{ 'bg-gray-700': $route.path === route.path }"
        >
          {{ route.name }}
        </router-link>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
const routes = [
  { path: '/orders', name: 'Orders' },
  { path: '/products', name: 'Products' },
]
</script>
