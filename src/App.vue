<template>
  <DefaultLayout>
    <Suspense>
      <template #default>
        <router-view />
      </template>
      <template #fallback>
        <div class="flex justify-center items-center h-64">
          <div class="text-center">
            <div class="text-xl font-bold">Loading...</div>
          </div>
        </div>
      </template>
    </Suspense>
  </DefaultLayout>
</template>

<script setup lang="ts">
import DefaultLayout from './components/layout/DefaultLayout.vue'
</script>
