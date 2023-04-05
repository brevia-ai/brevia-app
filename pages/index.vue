<template>
    <ClientOnly>
        <head> <title>Chatlas</title> </head>
    </ClientOnly>

    <main class="grid sm:grid-cols-2 gap-8">
        <NuxtLink class="p-6 flex items-center justify-center flex-col space-y-2 sm:aspect-square bg-sky-800 hover:bg-sky-600 text-white rounded" to="/chat">
            <div class="text-3xl font-bold">DC</div>
            <div class="text-center leading-tight">Dedicated Chatbot</div>
        </NuxtLink>

        <NuxtLink class="p-6 flex items-center justify-center flex-col space-y-2 sm:aspect-square bg-sky-800 hover:bg-sky-600 text-white rounded" to="/summary">
            <div class="text-3xl font-bold">DS</div>
            <div class="text-center leading-tight">Document summary</div>
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
