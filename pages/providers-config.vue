<template>
  <div class="my-16 space-y-8">
    <div class="flex gap-8">
      <UIXTabs :tabs="providersList">
        <template v-for="(item, idx) in providersList" v-slot:[idx]>
          <FormProviderModels :provider="item" />
        </template>
      </UIXTabs>
    </div>
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

const loadProvidersList = async () => {
  const items = await $fetch('/api/brevia/providers?list_models=false');
  return items.map((p: any) => String(p.model_provider));
}

const providersList: string[] = await loadProvidersList();
const store = useProvidersStore();

const loadConfigData = async () => {
  const query = 'key=providers&key=known_env_vars&key=brevia_env_secrets';
  const breviaConfig = await $fetch(`/api/brevia/config?${query}`);
  store.providers = breviaConfig.providers;
  store.setKnownVars(breviaConfig.known_env_vars);
  store.setupEnvVarsMap(breviaConfig.brevia_env_secrets);
}

await loadConfigData();
</script>
