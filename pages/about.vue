<template>
    <div class="mt-6 max-w-lg mx-auto space-y-8">
        <div class="rounded space-y-3">
            <h2 class="text-2xl font-bold">About</h2>
            <div class="space-y-6 text-lg text-justify">
                <div class="space-y-2">
                    <p>
                        Strumenti di Intelligenza Artificiale progettati da Atlas srl per aiutare le persone e le organizzazioni a prendere decisioni informate, automatizzare i processi ripetitivi e migliorare l'esperienza del cliente.
                    </p>
                    <p><NuxtLink to="/auth" class="text-sky-800 hover:text-blue-500 cursor-pointer">› Accedi</NuxtLink></p>
                </div>

                <hr class="border-neutral-300">

                <div class="space-y-2">
                    <p>
                    Artificial intelligence tools developed by Atlas srl to help individuals and organizations make informed decisions, automate competitive processes, and enhance customer experiences.
                    </p>
                    <p><NuxtLink to="/auth" class="text-sky-800 hover:text-blue-500 cursor-pointer">› Sign in</NuxtLink></p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    useHead({ title: 'About Chatlas', });
</script>
