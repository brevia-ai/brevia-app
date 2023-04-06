<template>
    <ClientOnly>
        <head> <title>Chatlas</title> </head>
    </ClientOnly>

    <main class="grid sm:grid-cols-2 gap-8">
        <NuxtLink class="big-button shadow-xl hover:shadow-2xl hover:shadow-sky-800" to="/chatbot/storia-novecento">
            <div class="text-4xl font-bold">SC</div>
            <div class="text-center leading-tight">Spacialized <span class="font-bold">chatbot</span></div>
        </NuxtLink>

        <NuxtLink class="big-button shadow-xl hover:shadow-2xl hover:shadow-sky-800" to="/summary">
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
