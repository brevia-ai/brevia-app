<template>
  <div class="flex flex-col h-[100dvh] justify-center">
    <div class="mx-auto space-y-2 place-items-center">
      <img alt="error-image" src="./public/brevia-logo-shatter.png" class="h-36" />
      <div class="text-7xl md:text-9xl font-bold">OPS! {{ error.statusCode }}</div>
      <div>{{ error.message }}</div>
    </div>
    <NuxtLink v-if="!error.data?.noBackHome" to="/" class="button mx-auto mt-8">
      <Icon name="ph:house-line-fill" size="28" />
      <span>Home</span>
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
import type { NuxtError } from '#app';

defineProps({
  error: {
    type: Object as () => NuxtError,
    default: {} as NuxtError,
  },
});
</script>
