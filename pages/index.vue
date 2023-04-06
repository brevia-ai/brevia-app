<template>
    <ClientOnly>
        <head> <title>Chatlas</title> </head>
    </ClientOnly>

    <main class="grid sm:grid-cols-2 gap-8">
        <NuxtLink class="p-6 flex items-center justify-center flex-col space-y-2 sm:aspect-square bg-sky-800 hover:bg-sky-600 text-white rounded" to="/chat">
            <div class="text-4xl font-bold">SC</div>
            <div class="text-center leading-tight">Spacialized <span class="font-bold">chatbot</span></div>
        </NuxtLink>

        <NuxtLink class="p-6 flex items-center justify-center flex-col space-y-2 sm:aspect-square bg-sky-800 hover:bg-sky-600 text-white rounded" to="/summary">
            <div class="text-4xl font-bold">DS</div>
            <div class="text-center leading-tight">Document <span class="font-bold">summary</span></div>
        </NuxtLink>
    </main>
</template>

<script>
export default {
    data() {
        return {
        }
    },

    created() {
    },

    methods: {
    }
}
</script>
