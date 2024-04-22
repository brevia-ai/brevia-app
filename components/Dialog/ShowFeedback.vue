<template>
    <div class="space-y-4 leading-tight">
        <div class="text-center">
            <p class="text-lg font-bold">{{ $t('FEEDBACK') }}</p>
            <p class="text-xs">{{ $t('FEEDBACK_SUBTITLE') }}</p>
        </div>
        <div class="bg-neutral-200 py-2 px-4 rounded-md whitespace-break-spaces">
            <Icon  v-if="evaluation!==null"
                class="w-full text-2xl"
                :class="(evaluation === true)?'text-green-600':'text-red-600'"
                :name="(evaluation === true)?'material-symbols:thumb-up':'material-symbols:thumb-down'"/>
            <p v-if="evaluation!==null">{{feedback}}</p>
            <p v-else>{{ $t('FEEDBACK_NOT_PRESENT') }}</p>
        </div>
        <div class="w-full flex flex-row">
        <button class="mx-auto button button-primary uppercase" @click="$closeModal">{{ $t('CLOSE') }}</button>
        </div>
    </div>
</template>

<script setup lang="ts">
    const props = defineProps(['evaluation', 'feedback']);
</script>
