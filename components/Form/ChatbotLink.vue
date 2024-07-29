<template>
<form class="flex flex-col space-y-6" @submit.prevent="save">
    <UIXInput :label="item.custom_id? '' : $t('NEW_LINK')"
        :placeholder="$t('LINK_PLACEHOLDER')"
        autocapitalize="on"
        v-model.trim="url"
        @keydown.enter.stop.prevent="save"
        autofocus
        :readonly="!!item.custom_id"
        required />

    <div class="p-3 bg-neutral-100 text-center font-semibold text-brand_primary" v-if="error">
        {{ $t('AN_ERROR_OCCURRED_PLEASE_RETRY') }}
    </div>

    <div class="flex justify-end gap-4">
        <button class="mr-auto button button-danger uppercase" :class="{ 'is-loading': isDeleting }"
            @click.prevent="deleteLink" v-if="item.custom_id">
            <Icon name="ph:trash-simple-bold" class="text-2xl" />
        </button>
        <button class="button button-primary uppercase" :class="{ 'is-loading': isIndexing }"
            @click.prevent="reindexLink(item, collectionUuid)" v-if="item.custom_id">
            <Icon name="ph:arrows-counter-clockwise-bold" class="text-2xl" />
        </button>

        <button class="button button-secondary uppercase" @click.prevent="cancel">{{ $t('CANCEL') }}</button>

        <button v-if="!item.custom_id" type="submit" class="px-8 button button-primary uppercase"
            :class="{ 'is-loading': isSaving }"
            :disabled="!url">{{ $t('ADD') }}
        </button>
    </div>
    <Transition>
    <div v-if="indexingResult == 'Indexed' || indexingResult == 'Not Indexed'"
        class="px-3 py-1 flex self-center my-auto absolute z-50 w-auto h-8 rounded-md"
        :class="{
            'bg-red-200': indexingResult == 'Not Indexed',
            'bg-green-200': indexingResult == 'Indexed'
        }">
       <p v-if="indexingResult == 'Indexed'" class="text-green-600 flex flex-row items-center">
            <Icon name="ph:check-square-fill" />
            {{  $t('INDEXING_SUCCESS') }}
        </p>
        <p v-if="indexingResult == 'Not Indexed'" class="text-red-600 flex flex-row items-center">
            <Icon name="ph:exclamation-mark-fill" />
            {{ $t('INDEXING_FAILURE') }}
        </p>
    </div>
    </Transition>
</form>
</template>

<script lang="ts" setup>
const props = defineProps({
    item: {
        type: Object,
        default: {},
    },
});

const emit = defineEmits(['close', 'index_link']);

const error = ref(false);
const isSaving = ref(false);
const isDeleting = ref(false);
const isIndexing = ref(false);
const url = ref('');

if (props.item.cmetadata) {
    url.value = props.item.cmetadata?.url || '';
}

const statesStore = useStatesStore();
const collectionUuid = statesStore.collection?.uuid || '';
const metadataDefaults = statesStore.collection?.cmetadata?.metadata_defaults?.links || {};
const linkLoadOptions = statesStore.collection?.cmetadata?.link_load_options || [];
const integration = useIntegration();
const indexingResult = ref<"Indexed" | "Not Indexed" | "None">("None");

// methods
const cancel = () => {
    emit('close', false);
}

const save = async () => {
    if (isSaving.value)
        return;

    isSaving.value = true;
    await create();
    emit('close', true);
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

        const metadata = {
            type: 'links',
            url: url.value,
        };
        await $fetch(`/api/${integration}/index/link`, {
            method: 'POST',
            body: {
                link: url.value,
                collection_id : collectionUuid,
                metadata: {...metadata, ...metadataDefaults},
                options: linkOptions(url.value),
            },
        });

    } catch (err) {
        console.log(err);
        error.value = true;
    }
}

const linkOptions = (url: string) => {
    let selector:any = linkLoadOptions.find((o:any) => o.url === url)?.selector;
    if (selector) {
        return {selector};
    }
    selector = linkLoadOptions.find((o:any) => url.startsWith(o.url))?.selector;

    return selector? {selector} : {};
}

const deleteLink = async () => {
    isDeleting.value = true;
    try {
        await $fetch(`/api/${integration}/index/${collectionUuid}/${props.item.custom_id}`, {
            method: 'DELETE'
        });
    } catch (err) {
        console.log(err);
        error.value = true;
    }
    isDeleting.value = false;
    emit('close', true);
}

const reindexLink = async(item: Record<string, any>, collection: string | undefined) => {
    let url = item.cmetadata.url;
    let metadata = item.cmetadata;
    let document_id = item.custom_id;
    isIndexing.value = true;
    try {
        await $fetch(`/api/brevia/index/link`, {
            method: 'POST',
            body: {
                link: url,
                collection_id : collection,
                metadata: metadata,
                options: linkOptions(url),
                document_id: document_id
            },
        });
        //indexing
        let data = await $fetch(`/api/brevia/index/${collection}/${document_id}`);
        isIndexing.value = false;
        if(!data.length || data[0].cmetadata.http_error){
            indexingResult.value = "Not Indexed";
        }
        else {
            indexingResult.value = "Indexed";
            emit('index_link');
        }
        setTimeout(() => {indexingResult.value = "None"}, 1200);
    } catch (err) {
        console.log(err);
        isIndexing.value = false;
    }
}

</script>

<style>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
