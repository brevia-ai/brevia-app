<template>
<main>
    <div class="space-y-10" v-if="collection.uuid">
        <div class="flex items-start justify-between space-x-4">
            <h2 class="text-2xl leading-tight">{{ $t('EDIT') }} “{{ collection.cmetadata?.title }}”</h2>
            <button class="mt-1" title="Delete chatbot" @click="$openModal('DialogDeleteChatbot', { collection })">
                <Icon name="ph:trash-simple-bold" class="text-3xl text-sky-700 hover:text-pink-700" />
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
const config = useRuntimeConfig();
useHead({ title: `Edit Chatbot | ${config.public.appName}`});

const { t } = useI18n();
const route = useRoute();
const collectionName = route.params.id as string;

const { data: collection } = await useFetch(`/api/brevia/collections?name=${collectionName}`);
if (!collection.value?.uuid) {
    throw createError({
        statusCode: 404,
        message: 'not found',
        fatal: true
    });
}
</script>
