<template>
  <main>
    <div v-if="collection.uuid" class="space-y-12">
      <div class="flex justify-between items-start space-x-4">
        <div class="space-y-4">
          <h2 class="text-2xl md:text-3xl leading-tight font-bold">{{ collection.cmetadata?.title }}</h2>
          <div v-if="collection.cmetadata?.description" class="text-neutral-600" v-html="collection.cmetadata?.description"></div>
        </div>

        <div class="flex justify-between space-x-4">
          <div class="mt-0.5 text-sky-700 hover:text-sky-500 hover:cursor-pointer">
            <Icon name="ph:arrow-clockwise-bold" class="text-4xl" @click="chatZone.refreshChat()" />
          </div>
          <NuxtLink class="mt-0.5 text-sky-700 hover:text-sky-500" :to="`history-${collectionName}`" :title="$t('CHATBOT_HISTORY')">
            <Icon name="ph:clock-counter-clockwise-bold" class="text-4xl" />
          </NuxtLink>

          <NuxtLink
            v-if="editLevel != ItemEditLevel.None"
            class="mt-0.5 text-sky-700 hover:text-sky-500"
            :to="`edit-${collectionName}`"
            :title="$t('EDIT_CHATBOT')"
          >
            <Icon name="ph:gear-fine-bold" class="text-4xl" />
          </NuxtLink>
        </div>
      </div>

      <ChatZone
        ref="chatZone"
        :collection
        :is-full-page="false"
        :max-messages="maxChatMessages"
        :bot-name="collection.cmetadata.title"
        @update-left="updateLeftMessages"
        @feedback="(feed) => handleFeedback(feed)"
      >
        <template #extra-icons>
          <div v-if="chatZone.showLastMsgDocs" class="px-1.5 pb-1 hover:bg-neutral-500 hover:rounded-md cursor-pointer">
            <Icon name="ph:files-bold" class="text-white" @click="$openModal('ChatDocuments', { documents: chatZone.getResponseDocs() })" />
          </div>
        </template>
        <template #messageCounter>
          <div v-if="isDemo" class="flex space-x-4">
            <span class="grow text-lg">{{ $t('MESSAGES_LEFT') }}: {{ messagesLeft }}</span>
          </div>

          <div v-if="isDemo && messagesLeft == 0" class="space-x-4">
            <div class="w-full bg-red-100 border border-red-400 rounded text-center">
              {{ $t('NO_MORE_CHAT_MESSAGES') }}
            </div>
          </div>
        </template>
      </ChatZone>
    </div>
  </main>
</template>

<script lang="ts" setup>
const config = useRuntimeConfig();
const store = useStatesStore();
const modalStore = useModalStore();
useHead({ title: `Chatbot | ${config.public.appName}` });

const chatZone = ref();
const collection = ref<{ name?: string; uuid?: string; cmetadata?: any }>({});
const isBusy = ref(false);
const input = ref<HTMLElement | null>(null);
const isDemo = ref(store.userHasRole('demo'));
const maxChatMessages = isDemo.value ? parseInt(config.public.demo.maxChatMessages) : 0;
const messagesLeft = ref(maxChatMessages);

let collectionName = '';
let editLevel = ItemEditLevel.None;

onBeforeMount(async () => {
  const route = useRoute();
  collectionName = route.params.id as string;

  // check if user has access to this page (TODO: refactor to use middleware)
  const link = `/chatbot/${collectionName}`;
  store.userAccess(link);
  const item = store.getMenuItem(link);
  editLevel = item?.edit || ItemEditLevel.None;

  isBusy.value = true;
  const data = await $fetch(`/api/brevia/collections?name=${collectionName}`);
  collection.value = data;

  if (!collection.value?.uuid) {
    throw createError({
      statusCode: 404,
      message: 'not found',
      fatal: true,
    });
  }

  isBusy.value = false;
});

watch(isBusy, (val) => {
  if (!val) {
    setTimeout(() => {
      input.value?.focus();
    }, 100);
  }
});

const updateLeftMessages = (left: number) => (messagesLeft.value = left);

const handleFeedback = (feed: any) => {
  modalStore.openModal('GiveFeedback', { feedback: feed });
  modalStore.$onAction(({ after, onError }) => {
    after((result) => {
      if (result === 'refreshFeedback') {
        chatZone.value.updateFeedbackThumbs();
      }
    });
    onError((error) => {
      console.log(error);
    });
  }, false);
};
</script>
