<template>
<div class="space-y-8 leading-tight">
    <div class="text-center space-y-4">
        <p class="text-lg">{{ $t('EDIT_METADATA') }}</p>
        <!-- <p>{{ $t('EDIT_METADATA_DESCRIPTION') }}</p> -->
    </div>

    <div class="flex justify-between space-x-4">
        <button class="button button-secondary uppercase" @click="$closeModal">{{ $t('CANCEL') }}</button>

        <button class="button button-danger uppercase"
            @click="updateMetadata">
            {{ $t('SAVE') }}
        </button>
    </div>
</div>
</template>

<script lang="ts" setup>
const props = defineProps({
    document: {
        type: Object,
        default: {},
    },
});

const statesStore = useStatesStore();

const error = ref(false);

const newMetadata = async () => {
    const defaultMeta = await defaultMetadata();
    const customMeta = customMetadata();
    return {...defaultMeta, ...customMeta};
}

const customMetadata = () => {
    return {custom: 'custom'};
}

const defaultMetadata = async () => {
    const meta: Record<string, any> = {type: props.document.type};
    if (props.document.type === 'files') {
        try {
            const data = await $fetch(`/api/bedita/files/${props.document.id}`, { method: 'GET' });
            meta.file = data.formattedData?.data?.relationships?.streams?.data?.[0]?.attributes?.file_name || '';
        } catch (err) {
            console.log(err);
        }
    }
    console.log(meta);

    return meta;
}


const { $closeModal } = useNuxtApp();

const updateMetadata = async () => {
    try {
        await $fetch('/api/brevia/index/metadata', {
            method: 'POST',
            body: {
                collection_id: statesStore.collection?.uuid || '',
                document_id: props.document.id,
                metadata: await newMetadata(),
            },
        });
        $closeModal();

    } catch (err) {
        console.log(err);
        error.value = true;
    }
}
</script>
