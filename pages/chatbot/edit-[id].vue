<template>
  <main>
    <div v-if="collection.uuid" class="space-y-10">
      <div class="flex items-start justify-between space-x-4">
        <h2 class="text-2xl leading-tight">{{ $t('EDIT') }} “{{ collection.cmetadata?.title }}”</h2>
        <button class="mt-1" :title="$t('DELETE_CHATBOT')" @click="$openModal('DialogDeleteChatbot', { collection })">
          <Icon name="ph:trash-simple-bold" class="text-3xl text-sky-700 hover:text-pink-700" />
        </button>
      </div>

      <div class="space-y-8">
        <UIXTabs v-if="isAdmin" :tabs="[t('OVERVIEW'), t('ADVANCED'), t('FILES'), 'Q & A', t('LINKS'), t('SHARE')]">
          <template #0>
            <FormChatbot @save-title="collection.cmetadata.title = $event" @save-descriprion="collection.cmetadata.description = $event" />
          </template>
          <template #1>
            <FormChatbotAdvanced />
          </template>
          <template #2>
            <ElementChatbotFiles />
          </template>
          <template #3>
            <ElementChatbotQuestions />
          </template>
          <template #4>
            <ElementChatbotLinks />
          </template>
          <template #5>
            <ElementChatbotShare />
          </template>
        </UIXTabs>
        <UIXTabs v-else :tabs="[t('OVERVIEW'), t('FILES'), 'Q & A', t('LINKS'), t('SHARE')]">
          <template #0>
            <FormChatbot @save-title="collection.cmetadata.title = $event" @save-descriprion="collection.cmetadata.description = $event" />
          </template>
          <template #1>
            <ElementChatbotFiles />
          </template>
          <template #2>
            <ElementChatbotQuestions />
          </template>
          <template #3>
            <ElementChatbotLinks />
          </template>
          <template #4>
            <ElementChatbotShare />
          </template>
        </UIXTabs>
      </div>
    </div>
  </main>
</template>

<script lang="ts" setup>
const config = useRuntimeConfig();
const { $openModal } = useNuxtApp();
useHead({ title: `Edit Chatbot | ${config.public.appName}` });

const { t } = useI18n();
const route = useRoute();
const collectionName = route.params.id as string;

const { data: collection } = await useFetch(`/api/brevia/collections?name=${collectionName}`);
if (!collection.value?.uuid) {
  throw createError({
    statusCode: 404,
    message: 'not found',
    fatal: true,
  });
}

const statesStore = useStatesStore();
statesStore.collection = collection.value;
const isAdmin = statesStore.userHasRole('admin');
</script>
