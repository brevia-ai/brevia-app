<template>
    <main class="flex flex-col justify-stretch">
        <DashboardMenu :class="{ 'opacity-70 pointer-events-none select-none': modalStore.isLoadingPage }"
            :menu="statesStore.menu" :add-enabled="isAddEnabled"
            v-if="statesStore.menu.length" />

        <DashboardWelcome :user="statesStore.user" :add-enabled="isAddEnabled"
            v-else-if="statesStore.user" />
    </main>
</template>

<script setup>
import { buildUserMenu } from '~~/utils/user-data-store';
useHead({ title: 'Brevia', });

const modalStore = useModalStore();
const statesStore = useStatesStore();
const config = useRuntimeConfig();

const isAddEnabled = computed(() => {
    if (config.public.maxUserChatbots === '') {
        return true;
    }
    const max = Number(config.public.maxUserChatbots)

    return statesStore.menu.value.filter((x) => x.type === 'chatbot').length < max;
});

const { data: has_access, status, refresh } = await useFetch('/api/bedita/user_has_access');
statesStore.menu = buildUserMenu(has_access.value);

watch(status, (value) => {
    modalStore.isLoadingPage = value === 'pending';
});
</script>
