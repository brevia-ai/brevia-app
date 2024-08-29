<template>
  <main class="flex flex-col justify-stretch">
    <div v-if="isLoading" class="mx-auto mt-16">
      <ElementLoader :loader-dim="82" />
    </div>
    <div v-else>
      <DashboardMenu
        v-if="statesStore.menu.length"
        :class="{ 'opacity-70 pointer-events-none select-none': modalStore.isLoadingPage }"
        :menu="statesStore.menu"
        :add-enabled="isAddEnabled"
      />

      <DashboardWelcome v-else-if="statesStore.isLogged()" :user="user" :add-enabled="isAddEnabled" />
    </div>
  </main>
</template>

<script setup>
const config = useRuntimeConfig();
useHead({ title: config.public.appName });
const modalStore = useModalStore();
const statesStore = useStatesStore();
const isLoading = ref(true);

const isAddEnabled = computed(() => {
  if (config.public.maxUserChatbots === '') {
    return true;
  }
  const max = Number(config.public.maxUserChatbots);

  return statesStore.menu.filter((x) => x.type === 'chatbot').length < max;
});

const integration = useIntegration();
const { data: menu, status } = await useFetch(`/api/${integration}/user_menu`);
statesStore.menu = buildUserMenu(menu.value);
setTimeout(() => (isLoading.value = false), 250);

watch(status, (value) => {
  modalStore.isLoadingPage = value === 'pending';
});
</script>
