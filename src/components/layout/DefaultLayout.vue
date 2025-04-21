<template>
  <div class="min-h-screen flex flex-col">
    <NavigationBar />
    <NotificationBar />
    <main class="container mx-auto p-4 flex-grow">
      <slot></slot>
    </main>
    <footer class="bg-gray-100 p-4 text-center text-gray-500">Case Study Project</footer>
  </div>
</template>

<script setup lang="ts">
import NavigationBar from './NavigationBar.vue'
import NotificationBar from '@/components/ui/NotificationBar.vue'
</script>
