<template>
  <main>
    <div v-if="collection.uuid" class="space-y-12">
      <div class="flex justify-between items-start space-x-4">
        <div class="space-y-4">
          <h2 class="text-2xl md:text-3xl leading-tight font-bold">{{ collection.cmetadata?.title }}</h2>
          <div v-if="collection.cmetadata?.description" class="text-neutral-600" v-html="collection.cmetadata?.description"></div>
        </div>
      </div>

      <ChatZone :collection :is-demo-chatbot="false" />
    </div>
  </main>
</template>

<script lang="ts" setup>
definePageMeta({
  layout: 'iframe'
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

  if (!collection.value?.uuid) {
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

</script>
