<template>
    <main>
        <div class="grid"
            :class="menu.length > 6? 'grid-dashboard-autofill' : 'grid-dashboard w-full mx-auto max-w-[90rem]'"
            v-if="menu.length">

            <UIXBigButton v-for="(item, i) in menu" :key="i" :item="item" :link="item.link" />

            <button class="big-button place-self-stretch py-6 from-slate-50 to-slate-50 text-slate-700 hover:from-white hover:to-white hover:text-sky-500"
                @click="$openModal('DialogNewChatbot')"
                v-if="isAddEnabled">
                <Icon name="ph:plus-bold" size="64" />
            </button>
        </div>

        <div class="w-full max-w-lg mx-auto p-16 bg-white rounded space-y-5" v-else>
            <h1 class="text-lg">Ciao <span class="font-bold">{{ store.user?.name }} {{ store.user?.surname }}</span>,</h1>
            <div>
                <p>{{ $t('WELCOME_ON_BREVIA') }}.</p>
                <p>{{ $t('NO_AI_TOOL_HAS_BEEN_SET_UP_JUST_FOR_YOU') }}.</p>
            </div>
        </div>
    </main>
</template>

<script setup>
useHead({ title: 'Brevia', });

const store = useStatesStore();
const config = useRuntimeConfig();
const menu = ref([]);

const isAddEnabled = computed(() => {
    if (config.public.maxUserChatbots === '') {
        return true;
    }
    const max = Number(config.public.maxUserChatbots)

    return menu.value.filter((x) => x.type === 'chatbot').length < max;
});

onBeforeMount(async () => {
    menu.value = store.getMenu();
});
</script>
