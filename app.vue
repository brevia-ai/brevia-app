<template>
<ClientOnly>
    <div class="h-[100dvh] flex flex-col">
        <MainHeader class="ml-0.5 w-full fixed z-10 bg-neutral-50 shadow" ></MainHeader>
        <UIXProgressLinear class="z-10 absolute top-24 w-full" v-if="modalStore.isLoadingPage" />

        <div class="grow mt-24 pt-3 sm:pt-8 pb-14 px-4 sm:px-6 w-full mx-auto"
            :class="{ 'max-w-3xl': $route.path !== '/' }">
            <NuxtPage />
        </div>

        <MainFooter />
    </div>

    <Modal v-if="$isActiveModal()" />
</ClientOnly>
</template>

<script setup lang="ts">
import { useModalStore } from '~~/store/modal';
const { locale, t } = useI18n();

const modalStore = useModalStore();
modalStore.$onAction(({
    name, // name of the action
    store, // store instance, same as `someStore`
    args, // array of parameters passed to the action
    after, // hook after the action returns or resolves
    onError, // hook if the action throws or rejects
}) => {
    after(() => {
        useHead({
            bodyAttrs: {
                class: store.activeModal ? 'overflow-hidden' : '',
            }
        });
    });
});

const config = useRuntimeConfig();

useHead({
    title: config.public.appName,
    meta: [{
        name: 'description',
        content: config.public.appDescription || t('TITLES.ATLAS_AI_POWERED_TOOLS'),
    }],
    htmlAttrs: {
        lang: locale.value,
    },
});
</script>
