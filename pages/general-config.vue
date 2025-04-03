<template>
  <div class="space-y-8">
    <UIXTabs :tabs="[t('GENERAL'), t('PROVIDERS')]">
      <template #0>
        <FormGeneralConfig />
      </template>
      <template #1>
        <FormProvidersConfig />
      </template>
    </UIXTabs>
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  middleware: [
    function () {
      const statesStore = useStatesStore();
      const isAdmin = statesStore.userHasRole('admin');
      if (!isAdmin) {
        return navigateTo('/');
      }
    },
  ],
});

const { t } = useI18n();

// Providers store needed by ConfigLlm components
const loadProvidersConfig = async () => {
  const store = useProvidersStore();
  if (store.providers.length) {
    return;
  }
  const breviaConfig = await $fetch(`/api/brevia/config?key=providers`);
  store.providers = breviaConfig.providers;
};
await loadProvidersConfig();
</script>
