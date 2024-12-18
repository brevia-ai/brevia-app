<template>
  <FormLogin :available-projects="availableProjects" />
</template>

<script setup lang="ts">
definePageMeta({
  middleware: [
    function () {
      const statesStore = useStatesStore();
      if (statesStore.isLogged()) {
        return navigateTo('/');
      }
    },
  ],
});

const availableProjects = await $fetch('/api/projects');

onBeforeMount(() => {
  const config = useRuntimeConfig();
  if (!!config.public.projectLogin === true) {
    throw createError({
      statusCode: 404,
      message: 'not found',
      fatal: true,
    });
  }
});
</script>
