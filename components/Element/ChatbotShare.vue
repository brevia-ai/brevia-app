<template>
  <component :is="'link'" v-if="shouldPreloadIframe" rel="preload" :href="iframeSrc" as="fetch" />
  <div class="flex flex-col space-y-6">
    <h1 class="text-2xl font-semibold mb-4 border-b-primary border-b-2">Embed</h1>

    <template v-if="!chatbotIframeEnabled">
      <p class="text-lg"><Icon name="ph:warning-circle-bold" class="text-2xl text-pink-700" />&nbsp; {{ $t('CHATBOT_IFRAME_DISABLED') }}</p>
      <p v-if="isAdmin" class="text-lg">{{ $t('CLICK_BELOW_ACTIVATE') }}</p>
      <button v-if="isAdmin" class="mx-auto px-5 py-1.5 button rounded-lg" @click="enableChatbotIframe">
        <Icon name="ph:check-square-fill" />
        <span>{{ $t('ENABLE') }}</span>
      </button>
    </template>

    <p class="text-lg">{{ $t('ADD_CHATBOT_IFRAME') }}:</p>
    <code ref="codeArea" class="w-full flex-1 bg-slate-300 p-2 rounded-md">
      &lt;iframe<br />
      &emsp;&emsp;src="{{ protocol }}//{{ host }}/chatbot-iframe/{{ collection.uuid }}"<br />
      &emsp;&emsp;style="height: 30rem; width: 24rem" <br />
      &gt;<br />
      &lt;/iframe&gt;
    </code>
    <button class="mx-auto px-5 py-1.5 button rounded-lg" @click="copyCode">
      <Icon :name="!copiedToClip ? 'ph:copy-bold' : 'ph:copy-simple-fill'" />
      <span v-if="!copiedToClip">{{ $t('COPY') }}</span>
      <span v-else>{{ $t('COPY') }}!</span>
    </button>
    <template v-if="chatbotIframeEnabled">
      <p v-if="chatbotIframeEnabled" class="text-lg">{{ $t('BUBBLE_TRY_CHATBOT') }}</p>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { collectionItem } from '~/store/states';
const statesStore = useStatesStore();
const collection = statesStore.collection as collectionItem;
const isAdmin = statesStore.userHasRole('admin');

const host = window.location.host;
const protocol = window.location.protocol;
const iframeSrc = ref('/chatbot-iframe/' + collection.uuid);
const shouldPreloadIframe = ref(true);
const codeArea = ref();
const copiedToClip = ref(false);
const chatbotIframeEnabled = computed(() => !!collection.cmetadata?.brevia_app?.public_iframe);

onMounted(() => {
  setTimeout(() => {
    shouldPreloadIframe.value = false;
  }, 5000);
  if (chatbotIframeEnabled.value) {
    initBubble({ iframeSrc: iframeSrc.value });
  }
});

const copyCode = () => {
  navigator.clipboard.writeText(codeArea.value.textContent).then(() => {
    copiedToClip.value = true;
    setTimeout(() => (copiedToClip.value = false), 500);
  });
};

const enableChatbotIframe = async () => {
  const brevia_app = collection.cmetadata.brevia_app || {};
  brevia_app.public_iframe = true;
  collection.cmetadata.brevia_app = brevia_app;

  const integration = useIntegration();
  await $fetch(`/api/${integration}/collections/${statesStore?.collection?.uuid}`, {
    method: 'PATCH',
    body: collection,
  });

  statesStore.collection = collection;
};

onUnmounted(() => {
  const iframeWindow = document.getElementById('chat-iframe');
  const iframeButton = document.getElementById('chat-iframe-button');
  iframeButton?.remove();
  iframeWindow?.remove();
});
</script>

<style>
.iframe-leave {
  scale: 100%;
}

.iframe-enter {
  scale: 0%;
}

.iframe-leave-to {
  scale: 0%;
  transform-origin: bottom right;
}

.iframe-enter-to {
  scale: 100%;
  transform-origin: bottom right;
}

.iframe-leave-active,
.iframe-enter-active {
  transition: scale 0.5s ease;
}
</style>
