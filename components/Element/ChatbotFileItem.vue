<template>
<div class="px-4 py-4 bg-gradient-to-br from-slate-700 to-slate-950 text-white text-sm rounded">
    <div class="flex justify-between items-center space-x-4">
        <div class="flex space-x-4 items-center">
            <div>
                <Icon name="carbon:document-pdf" class="text-3xl" />
            </div>

            <div>
                <p>{{ item.attributes.title }}</p>
                <p class="text-xs">{{ item.attributes.description }}</p>
            </div>
        </div>

        <a href="#" target="_blank" class="button disabled py-2.5">
            <Icon name="carbon:download" class="text-lg" />
            <span class="sr-only">{{ $t('DOWNLOAD') }}</span>
        </a>
    </div>
</div>
</template>

<script lang="ts" setup>
defineProps({
    item: {
        type: Object,
        required: true,
    },
});
</script>
