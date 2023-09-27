<template>
<ClientOnly>
    <div class="h-[100dvh] flex flex-col">
        <MainHeader :route="$route" class="w-full fixed z-10 bg-neutral-50 shadow" ></MainHeader>

        <div class="grow mt-28 p-6 w-full mx-auto"
            :class="($route.path !== '/')? 'max-w-3xl' : 'max-w-[90rem]'">
            <NuxtPage />
        </div>

        <MainFooter />
    </div>
</ClientOnly>
</template>

<script setup>
useHead({
    title: 'CHATLAS',
    meta: [{
        name: 'description',
        content: 'Atlas AI-powered tools'
    }],
});
</script>
