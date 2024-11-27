<template>
  <div class="h-[100dvh] flex flex-col" :class="'bg-' + background">
    <div class="grow pt-3 sm:pt-8 pb-14 w-full">
      <NuxtPage />
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const background = route.meta.background;
</script>
