<template>
    <main class="flex flex-col justify-stretch">
        <DashboardMenu :class="{ 'opacity-70 pointer-events-none select-none': modalStore.isLoadingPage }"
            :menu="statesStore.menu" :add-enabled="isAddEnabled"
            v-if="statesStore.menu.length" />

        <DashboardWelcome :user="user" :add-enabled="isAddEnabled"
            v-else-if="isLogged" />
    </main>
</template>

<script setup>
const config = useRuntimeConfig();
useHead({ title: config.public.appName });

const { user, isLogged } = useIntegrationAuth();
const modalStore = useModalStore();
const statesStore = useStatesStore();

const isAddEnabled = computed(() => {
    if (config.public.maxUserChatbots === '') {
        return true;
    }
    const max = Number(config.public.maxUserChatbots)

    return statesStore.menu.filter((x) => x.type === 'chatbot').length < max;
});

const integration = useIntegration();
const { data: menu, status, refresh } = await useFetch(`/api/${integration}/user_menu`);
statesStore.menu = buildUserMenu(menu.value);

watch(status, (value) => {
    modalStore.isLoadingPage = value === 'pending';
});
</script>
