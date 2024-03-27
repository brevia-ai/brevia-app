<template>
    <img :src="config.public.appLogo" alt="Logo">
</template>

<script setup lang="ts">
const config = useRuntimeConfig();
</script>
