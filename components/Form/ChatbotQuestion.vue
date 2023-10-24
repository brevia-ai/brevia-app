<template>
<form class="flex flex-col space-y-6" @submit="save">
    <UIXInput :label="item.id? $t('QUESTION') : $t('NEW_QUESTION')"
        :placeholder="$t('QUESTION_PLACEHOLDER')"
        autocapitalize="on"
        v-model.trim="question" @keydown.enter="save"
        autofocus
        required />

    <textarea :placeholder="$t('ANSWER_PLACEHOLDER')"
        v-model="answer" rows="6"></textarea>

    <div class="p-3 bg-neutral-100 text-center font-semibold text-brand_primary" v-if="error">
        {{ $t('AN_ERROR_OCCURRED_PLEASE_RETRY') }}
    </div>

    <div class="flex justify-end gap-4">
        <button class="mr-auto button button-danger uppercase" @click.prevent="cancel" v-if="item.id">
            <Icon name="carbon:trash-can" class="text-2xl" />
        </button>

        <button class="button button-secondary uppercase" @click.prevent="cancel">{{ $t('CANCEL') }}</button>

        <button type="submit" class="px-8 button button-primary uppercase"
            :class="{ 'is-loading': isLoading }"
            :disabled="!question"
            @click.stop.prevent="">
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
const isLoading = ref(false);
const question = ref('');
const answer = ref('');

const { $html2text } = useNuxtApp();
if (props.item.attributes) {
    question.value = props.item.attributes.title || '';
    answer.value = $html2text(props.item.attributes.body);
}

const save = () => {
    emit('close', true);
}

const cancel = () => {
    emit('close', true);
}
</script>
