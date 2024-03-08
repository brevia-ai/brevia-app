<template>
<form class="flex flex-col space-y-6" @submit.prevent="save">
    <UIXInput :label="item.id? '' : $t('NEW_LINK')"
        :placeholder="$t('LINK_PLACEHOLDER')"
        autocapitalize="on"
        v-model.trim="url"
        @keydown.enter.stop.prevent="save"
        autofocus
        required />

    <div class="p-3 bg-neutral-100 text-center font-semibold text-brand_primary" v-if="error">
        {{ $t('AN_ERROR_OCCURRED_PLEASE_RETRY') }}
    </div>

    <div class="flex justify-end gap-4">
        <button class="mr-auto button button-danger uppercase" :class="{ 'is-loading': isDeleting }"
            @click.prevent="deleteLink" v-if="item.id">
            <Icon name="ph:trash-simple-bold" class="text-2xl" />
        </button>

        <button class="button button-secondary uppercase" @click.prevent="cancel">{{ $t('CANCEL') }}</button>

        <button type="submit" class="px-8 button button-primary uppercase"
            :class="{ 'is-loading': isSaving }"
            :disabled="!url">
                <template v-if="item.id">{{ $t('SAVE') }}</template>
                <template v-else>{{ $t('ADD') }}</template>
        </button>
    </div>
</form>
</template>

<script lang="ts" setup>
const props = defineProps({
    item: {
        type: Object,
        default: {},
    },
});

const emit = defineEmits(['close']);

const error = ref(false);
const isSaving = ref(false);
const isDeleting = ref(false);
const url = ref('');

if (props.item.attributes) {
    url.value = props.item.attributes.url || '';
}

const statesStore = useStatesStore();
const collectionBeditaId = statesStore.collection?.cmetadata?.id || '';
const collectionUuid = statesStore.collection?.uuid || '';
const metadataDefaults = statesStore.collection?.cmetadata?.metadata_defaults?.links || {};
const linkLoadOptions = statesStore.collection?.cmetadata?.link_load_options || {};

// methods
const cancel = () => {
    emit('close', false);
}

const save = async () => {
    if (isSaving.value)
        return;

    isSaving.value = true;
    if (props.item.id) {
        await update();
    } else {
        await create();
    }
    if (!error.value) {
        emit('close', true);
    }
    isSaving.value = false;
}

const checkUrl = async () => {
    if (!url.value) {
        return false;
    }
    const regex = new RegExp('^(http|https)://', 'i');
    if (!regex.test(url.value)) {
        url.value = 'http://' + url.value;
    }
    let result = false;
    try {
        const response = await $fetch('/api/check_link', {
            method: 'POST',
            body: {
                url: url.value,
            },
        });
        result = !!(response && !response?.error);
    } catch (err) {
        console.log(err);
    }

    return result;
}

const create = async () => {
    try {
        if (!await checkUrl()) {
            error.value = true;
            return;
        }
        const data = await $fetch('/api/bedita/link', {
            method: 'POST',
            body: {
                collectionId: collectionBeditaId,
                attributes: {
                    url: url.value,
                    title: url.value,
                    extra: {
                        brevia: {
                            metadata: {
                                type: 'links'
                            },
                            options: linkOptions(url.value),
                        },
                    },
                },
            },
        });
        const docId = String(data.data?.id || '');
        const meta = await readMetadata(docId);
        await updateMetadata(docId, {...meta, ...metadataDefaults});

    } catch (err) {
        error.value = true;
    }
}

const update = async () => {
    try {
        if (!await checkUrl()) {
            error.value = true;
            return;
        }
        // read current metadata first
        const meta = await readMetadata(String(props.item?.id));
        await $fetch('/api/bedita/link', {
            method: 'PATCH',
            body: {
                id: String(props.item?.id),
                attributes: {
                    title: url.value,
                    url: url.value,
                },
            },
        });
        // restore previous metadata
        await updateMetadata(String(props.item?.id), meta);

    } catch (err) {
        error.value = true;
    }
}

const linkOptions = (url: string) => {
    let options = null;
    const loadOptions = Object.keys(linkLoadOptions);
    loadOptions.forEach(key => {
        if (url.startsWith(key)) {
            options = linkLoadOptions[key];
        }
    })
    return options;
}

const deleteLink = async () => {
    isDeleting.value = true;
    try {
        await $fetch(`/api/bedita/link/${props.item.id}`, { method: 'DELETE' });
    } catch (err) {
        error.value = true;
    }
    isDeleting.value = false;
    emit('close', true);
}

const readMetadata = async (docId: string) => {
    try {
        const response = await fetch(
            `/api/brevia/index/${collectionUuid}/${docId}`
        )
        const data = await response.json();
        return data?.[0]?.cmetadata || {};
    } catch (error) {
        console.log(error);
        return {};
    }
}

const updateMetadata = async (docId: string, meta: any) => {
    try {
        await $fetch('/api/brevia/index/metadata', {
            method: 'POST',
            body: {
                collection_id: collectionUuid,
                document_id: docId,
                metadata: meta,
            },
        });

    } catch (err) {
        console.log(err);
        error.value = true;
    }
}
</script>
