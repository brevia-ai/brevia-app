<template>
    <div class="mt-6 max-w-lg mx-auto space-y-8">
        <div class="rounded space-y-3">
            <h2 class="text-2xl font-bold">{{ $t('ABOUT') }}</h2>
            <div class="space-y-6 text-lg text-justify">
                <div class="space-y-2">
                    <p>
                        {{ $t('ABOUT_TEXT') }}
                    </p>
                    <p><NuxtLink to="/auth" class="text-sky-800 hover:text-blue-500 cursor-pointer">› {{ $t('SIGN_IN') }}</NuxtLink></p>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
    useHead({ title: 'About chatlas', });
</script>
