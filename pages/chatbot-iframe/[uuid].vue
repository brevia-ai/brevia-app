<template>
  <main>
    <div v-if="collection.uuid" class="space-y-12">
      <ChatZone :collection :is-demo-chatbot="false" :is-embedded="true" />
    </div>
  </main>
</template>

<script lang="ts" setup>
definePageMeta({
  layout: 'iframe',
});
const { t } = useI18n();

const collection = ref<{ name?: string; uuid?: string; cmetadata?: any }>({});
const isBusy = ref(false);
const input = ref<HTMLElement | null>(null);

let sessionId = '';

onBeforeMount(async () => {
  const route = useRoute();
  const uuid = route.params.uuid as string;
  isBusy.value = true;
  const data = await $fetch(`/api/brevia/collections?uuid=${uuid}`);
  collection.value = data;

  if (!checkChatbotAvailable()) {
    throw createError({
      statusCode: 404,
      message: 'not found',
      fatal: true,
    });
  }

  sessionId = crypto.randomUUID();
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
</script>
