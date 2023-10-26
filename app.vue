<template>
<ClientOnly>
    <div class="h-[100dvh] flex flex-col">
        <MainHeader class="w-full fixed z-10 bg-neutral-50 shadow" ></MainHeader>

        <div class="grow mt-28 py-6 px-4 sm:px-6 w-full mx-auto"
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

useHead({
    title: 'BREVIA',
    meta: [{
        name: 'description',
        content: t('TITLES.ATLAS_AI_POWERED_TOOLS'),
    }],
    htmlAttrs: {
        lang: locale.value,
    },
});
</script>
