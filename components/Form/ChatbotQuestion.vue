<template>
<form class="flex flex-col space-y-6" @submit.prevent="save">
    <UIXInput :label="item.id? '' : $t('NEW_QUESTION')"
        :placeholder="$t('QUESTION_PLACEHOLDER')"
        autocapitalize="on"
        v-model.trim="title"
        @keydown.enter.stop.prevent="save"
        autofocus
        required />

    <textarea :placeholder="$t('ANSWER_PLACEHOLDER')"
        v-model="answer" rows="7"></textarea>

    <div class="p-3 bg-neutral-100 text-center font-semibold text-brand_primary" v-if="error">
        {{ $t('AN_ERROR_OCCURRED_PLEASE_RETRY') }}
    </div>

    <div class="flex justify-end gap-4">
        <button class="mr-auto button button-danger uppercase" :class="{ 'is-loading': isDeleting }"
            @click.prevent="deleteQuestion" v-if="item.id">
            <Icon name="ph:trash-simple-bold" class="text-2xl" />
        </button>

        <button class="button button-secondary uppercase" @click.prevent="cancel">{{ $t('CANCEL') }}</button>

        <button type="submit" class="px-8 button button-primary uppercase"
            :class="{ 'is-loading': isSaving }"
            :disabled="!title">
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
const title = ref('');
const answer = ref('');

const { $html2text } = useNuxtApp();
if (props.item.attributes) {
    title.value = props.item.attributes.title || '';
    answer.value = $html2text(props.item.attributes.body);
}

const statesStore = useStatesStore();
const collectionBeditaId = statesStore.collection?.cmetadata?.id || '';
const collectionUuid = statesStore.collection?.uuid || '';
const metadataDefaults = statesStore.collection?.cmetadata?.metadata_defaults?.questions || {};

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
        emit('close', true);
    } else {
        await create();
        emit('close', true);
    }
    isSaving.value = false;
}

const create = async () => {
    try {
        const data = await $fetch('/api/bedita/question', {
            method: 'POST',
            body: {
                collectionId: collectionBeditaId,
                attributes: {
                    title: title.value,
                    body: answer.value,
                    extra: {
                        brevia: {
                            metadata: {
                                type: 'questions'
                            }
                        }
                    }
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
        // read current metadata first
        const meta = await readMetadata(String(props.item?.id));
        await $fetch('/api/bedita/question', {
            method: 'PATCH',
            body: {
                id: String(props.item?.id),
                attributes: {
                    title: title.value,
                    body: answer.value,
                },
            },
        });
        // restore previous metadata
        await updateMetadata(String(props.item?.id), meta);

    } catch (err) {
        error.value = true;
    }
}

const deleteQuestion = async () => {
    isDeleting.value = true;
    try {
        await $fetch(`/api/bedita/question/${props.item.id}`, { method: 'DELETE' });
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
