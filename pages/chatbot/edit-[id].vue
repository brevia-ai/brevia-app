<template>
<main>
    <div class="space-y-10" v-if="collection.uuid">
        <div class="flex items-center justify-between space-x-4">
            <h2 class="text-2xl leading-tight font-bold">{{ $t('SETTINGS') }} chatbot “{{ collection.cmetadata?.title }}”</h2>
            <button title="Delete chatbot" @click="$openModal('delete-chatbot')">
                <Icon name="carbon:trash-can" class="text-3xl text-sky-700 hover:text-pink-500" />
            </button>
        </div>

        <div class="space-y-8">
            <UIXTabs :tabs="[t('OVERVIEW'), t('FILES'), 'Q & A']">
                <template #0>
                    <FormChatbot :collection="collection"
                        @save-title="collection.cmetadata.title = $event"
                        @save-descriprion="collection.cmetadata.description = $event" />
                </template>
                <template #1>
                    <ElementChatbotFiles :collection="collection" />
                </template>
                <template #2>
                    <ElementChatbotQuestions :collection="collection" />
                </template>
            </UIXTabs>
        </div>
    </div>
</main>
</template>

<script lang="ts" setup>
useHead({ title: 'Edit Chatbot | Brevia', });

const { t } = useI18n();
const route = useRoute();
const collectionName = route.params.id as string;

const { data: collection } = await useFetch(`/api/collections?name=${collectionName}`);
if (!collection.value?.uuid) {
    throw createError({
        statusCode: 404,
        message: 'not found',
        fatal: true
    });
}
</script>
