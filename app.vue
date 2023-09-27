<template>
<ClientOnly>
    <div class="h-screen flex flex-col">
        <MainHeader class="w-full fixed z-10 bg-neutral-50 shadow" ></MainHeader>
        <div class="grow mt-28 p-6 w-full max-w-3xl mx-auto">
                <NuxtPage />
        </div>

        <MainFooter />
    </div>
</ClientOnly>
</template>

<script setup>
const { locale, t } = useI18n();

useHead({
    title: 'CHATLAS',
    meta: [{
        name: 'description',
        content: t('ATLAS_AI_POWERED_TOOLS'),
    }],
    htmlAttrs: {
        lang: locale.value,
    },
});
</script>
