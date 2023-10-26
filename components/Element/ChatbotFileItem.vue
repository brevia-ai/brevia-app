<template>
<div class="pl-3.5 pr-2.5 py-2.5 flex justify-between items-center space-x-4
    bg-gradient-to-br from-slate-700 to-slate-950 text-white hover:text-sky-400 rounded cursor-pointer"
    @click.stop="download">

    <div class="flex space-x-3.5 items-center">
        <div>
            <Icon name="ph:file-pdf-light" class="text-4xl" />
        </div>

        <div class="leading-tight space-y-1">
            <p class="font-bold">{{ item.attributes.title }}</p>
            <p class="text-xs text-slate-400" v-if="item.attributes.description">{{ $html2text(item.attributes.description) }}</p>
        </div>
    </div>

    <div class="space-x-1 whitespace-nowrap">
        <a href="#" class="button-mock border-transparent py-2.5 px-1.5" @click.prevent="download">
            <Icon name="ph:download-simple-bold" class="text-xl" />
            <span class="sr-only">{{ $t('DOWNLOAD') }}</span>
        </a>

        <button class="mr-auto button button-secondary button-transparent text-pink-500 hover:bg-danger hover:border-danger hover:text-white pt-2.5 pb-2 px-3" :class="{ 'is-loading': isDeleting }"
            @click.stop.prevent="deleteFile" v-if="item.id">
            <Icon name="ph:trash-simple-bold" class="text-xl" />
        </button>
    </div>

</div>
</template>

<script lang="ts" setup>
const props = defineProps({
    item: {
        type: Object,
        required: true,
    },
});

const emit = defineEmits(['file-deleted']);

const isDeleting = ref(false);

const deleteFile = async () => {
    isDeleting.value = true;
    try {
        await $fetch(`/api/bedita/file/${props.item.id}`, { method: 'DELETE' });
        emit('file-deleted', true);
    } catch (err) {
        console.error(err);
    }
    isDeleting.value = false;
};

const download = async () => {
    try {
        const data = await $fetch(`/api/bedita/files/${props.item.id}`, { method: 'GET' });
        console.log(data);
        const url = data.formattedData?.data?.meta?.media_url;
        if (url)
            window.open(url, '_blank');
    } catch (err) {
        console.error(err);
    }
};
</script>
