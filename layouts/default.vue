<template>
  <div class="h-[100dvh] flex flex-col">
    <MainHeader class="ml-0.5 w-full fixed z-10 bg-neutral-50 shadow"></MainHeader>
    <div class="grow mt-24 pt-3 sm:pt-8 pb-14 px-4 sm:px-6 w-full mx-auto" :class="{ 'max-w-3xl': route.path !== '/' }">
      <NuxtPage />
    </div>
    <MainFooter />
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
</script>
