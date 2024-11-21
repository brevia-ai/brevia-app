<template>
    <div class="grow mt-24 pt-3 sm:pt-8 pb-14 px-4 sm:px-6 w-full mx-auto" :class="{ 'max-w-3xl': route.path !== '/' }">
      <NuxtPage />
    </div>
</template>

<script setup lang="ts">
const route = useRoute();
</script>
