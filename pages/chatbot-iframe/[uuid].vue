<template>
  <main>
    <div v-if="collection.uuid" class="space-y-12">
      <ChatZone ref="chatZone" :collection :bot-name="collection.cmetadata.title" @feedback="(feed) => handleFeedback(feed)">
        <template #chatbot-header>
          <div class="w-full relative -top-3 left-0 bg-primary text-white z-20 px-3 py-2">
            <h1 class="pl-6 text-xl font-bold">{{ collection.cmetadata.title }}</h1>
          </div>
        </template>
      </ChatZone>
    </div>
  </main>
</template>

<script lang="ts" setup>
definePageMeta({
  layout: 'iframe',
});

const chatZone = ref();
const modalStore = useModalStore();
const collection = ref<{ name?: string; uuid?: string; cmetadata?: any }>({});
const isBusy = ref(false);
const input = ref<HTMLElement | null>(null);

onBeforeMount(async () => {
  const route = useRoute();
  const uuid = route.params.uuid as string;
  isBusy.value = true;
  let err = false;

  try {
    const data = await $fetch(`/api/brevia/collections?uuid=${uuid}`);
    collection.value = data;
  } catch (e) {
    console.error(e);
    err = true;
  }

  if (err || !checkChatbotAvailable()) {
    throw createError({
      statusCode: 404,
      message: 'not found',
      fatal: true,
      data: {
        noBackHome: true,
      },
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

const checkChatbotAvailable = (): boolean => {
  if (!collection.value?.uuid) {
    return false;
  }
  return collection.value.cmetadata?.brevia_app?.public_iframe || false;
};

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
