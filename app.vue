<template>
<ClientOnly>
    <div class="h-[100dvh] flex flex-col">
        <MainHeader class="w-full fixed z-10 bg-neutral-50 shadow" ></MainHeader>

        <div class="grow mt-28 p-6 w-full mx-auto"
            :class="{ 'max-w-3xl': $route.path !== '/' }">
            <NuxtPage />
        </div>

        <MainFooter />
    </div>
</ClientOnly>
</template>

<script setup lang="ts">
const { locale, t } = useI18n();

useHead({
    title: 'CHATLAS',
    meta: [{
        name: 'description',
        content: t('TITLES.ATLAS_AI_POWERED_TOOLS'),
    }],
    htmlAttrs: {
        lang: locale.value,
    },
});
</script>
