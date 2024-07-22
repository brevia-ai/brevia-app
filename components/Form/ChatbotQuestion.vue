<template>
<form class="flex flex-col space-y-6" @submit.prevent="save">
    <UIXInput :label="item.custom_id? '' : $t('NEW_QUESTION')"
        :placeholder="$t('QUESTION_PLACEHOLDER')"
        autocapitalize="on"
        v-model.trim="title"
        @keydown.enter.stop.prevent="save"
        autofocus
        required />

    <textarea class="textarea" :placeholder="$t('ANSWER_PLACEHOLDER')"
        v-model="answer" rows="7"></textarea>

    <div class="p-3 bg-neutral-100 text-center font-semibold text-brand_primary" v-if="error">
        {{ $t('AN_ERROR_OCCURRED_PLEASE_RETRY') }}
    </div>

    <div class="flex justify-end gap-4">
        <button class="mr-auto button button-danger uppercase" :class="{ 'is-loading': isDeleting }"
            @click.prevent="deleteQuestion" v-if="item.custom_id">
            <Icon name="ph:trash-simple-bold" class="text-2xl" />
        </button>

        <button class="button button-secondary uppercase" @click.prevent="cancel">{{ $t('CANCEL') }}</button>

        <button type="submit" class="px-8 button button-primary uppercase"
            :class="{ 'is-loading': isSaving }"
            :disabled="!title">
                <template v-if="item.custom_id">{{ $t('SAVE') }}</template>
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
// let documentId: string | null = null;

// const { $html2text } = useNuxtApp();

const lines = props.item?.document?.split('\n') || [];
title.value = lines?.[0] || extractField(props.item, 'title') || '';
answer.value = lines.slice(1)?.join('\n') || extractField(props.item, 'body') || '';

const statesStore = useStatesStore();
const collectionUuid:string = statesStore.collection?.uuid || '';
const metadataDefaults = statesStore.collection?.cmetadata?.metadata_defaults?.questions || {};
let metadata = {...{ type: 'questions' }, ...metadataDefaults};
const integration = useIntegration();

// methods
const cancel = () => {
    emit('close', false);
}

const save = async () => {
    if (isSaving.value)
        return;

    isSaving.value = true;
    if (props.item.custom_id) {
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
        await addQuestion();
    } catch (err) {
        error.value = true;
        console.error(err);
    }
}

const addQuestion = async (id: string = '') => {
    await $fetch(`/api/${integration}/index/question`, {
        method: 'POST',
        body: {
            title: title.value,
            answer: answer.value,
            collection_id: collectionUuid,
            document_id: id,
            metadata,
        },
    });
}

const update = async () => {
    try {
        // read current metadata first
        metadata = await readMetadata(String(props.item?.custom_id));
        await addQuestion(props.item?.custom_id);

    } catch (err) {
        error.value = true;
        console.error(err);
    }
}

const deleteQuestion = async () => {
    isDeleting.value = true;
    try {
        await $fetch(`/api/${integration}/index/${collectionUuid}/${props.item.custom_id}`, { method: 'DELETE' });
    } catch (err) {
        error.value = true;
        console.error(err);
    }
    isDeleting.value = false;
    emit('close', true);
}

const readMetadata = async (docId: string) => {
    try {
        const response = await $fetch(
            `/api/brevia/index/${collectionUuid}/${docId}`,
            {method: 'GET'},
        )
        console.log(response);
        const data = response || [];
        return data?.[0]?.cmetadata || {};
    } catch (error) {
        console.log(error);
        return {};
    }
}
</script>
