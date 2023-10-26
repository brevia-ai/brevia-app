<template>
<div class="pl-4 pr-3 py-4 flex justify-between items-center space-x-4
    bg-gradient-to-br from-slate-700 to-slate-950 text-white hover:text-sky-400 rounded cursor-pointer"
    @click.stop="download">

    <div class="flex space-x-4 items-center">
        <div>
            <Icon name="carbon:document-pdf" class="text-3xl" />
        </div>

        <div>
            <p>{{ item.attributes.title }}</p>
            <p class="text-xs text-slate-300" v-html="item.attributes.description" v-if="item.attributes.description"></p>
        </div>
    </div>

    <div class="space-x-1">
        <a href="#" class="button-mock border-transparent py-2.5 px-3" @click.prevent="download">
            <Icon name="carbon:download" class="text-lg" />
            <span class="sr-only">{{ $t('DOWNLOAD') }}</span>
        </a>
        <button class="mr-auto button button-secondary button-transparent text-pink-500 hover:bg-danger hover:border-danger hover:text-white py-2.5 px-3" :class="{ 'is-loading': isDeleting }"
            @click.stop.prevent="deleteFile" v-if="item.id">
            <Icon name="carbon:trash-can" class="text-lg" />
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
