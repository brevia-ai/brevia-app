<template>
  <FormLogin :login-project="loginProject" />
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
const route = useRoute();
const project = (route.params.id as string).toLowerCase().replace(/ /g, '-');
const loginProject: string | null = availableProjects.find((p: string) => p.toLowerCase().replace(/ /g, '-') === project);
const config = useRuntimeConfig();
if (!loginProject || !!config.public.projectLogin === false) {
  throw createError({
    statusCode: 404,
    message: 'not found',
    fatal: true,
  });
}
</script>
