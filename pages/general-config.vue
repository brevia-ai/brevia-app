<template>
  <div class="flex mb-4 gap-4" v-if="!someModelsAvailable">
    <Icon name="ph:warning-circle-bold" class="text-6xl text-pink-700" />
    <div>
      <p class="text-lg">{{ $t('NO_MODELS_AVAILABLE') }}</p>
      <p class="text-sm text-gray-500">{{ $t('PLEASE_CONFIGURE_PROVIDERS') }}</p>
    </div>
  </div>
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

await initProviders();

const someModelsAvailable = computed(() => {
  const store = useProvidersStore();
  return store.providers.some((provider) => provider.models && provider.models.length > 0);
});
</script>
