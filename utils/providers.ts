import { useProvidersStore } from '~/store/providers';

export const initProviders = async () => {
  const store = useProvidersStore();

  if (store.providers.length) {
    return;
  }
  const breviaConfig = await $fetch(`/api/brevia/config?key=providers`);
  store.providers = breviaConfig.providers;
};
