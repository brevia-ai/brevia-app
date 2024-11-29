<template>
  <div class="flex flex-col space-y-6">
    <h1 class="text-2xl font-semibold mb-4 border-b-primary border-b-2">Embed</h1>
    <p class="text-lg">Per aggiungere il tuo chatbot ovunque nel tuo sito, aggiungi questo iframe al tuo html:</p>
    <code ref="codeArea" class="w-full flex-1 bg-slate-300 p-2 rounded-md">
      &lt;iframe<br />
      &emsp;&emsp;src="{{ iframeSrc }}" <br />
      &emsp;&emsp;style="height: 30rem; width: 24rem" <br />
      &gt;<br />
      &lt;/iframe&gt;
    </code>
    <button class="mx-auto px-5 py-1.5 button rounded-lg" @click="copyCode">
      <Icon :name="!copiedToClip ? 'ph:copy-bold' : 'ph:copy-simple-fill'" />
      <span v-if="!copiedToClip">Copia</span>
      <span v-else>Fatto!</span>
    </button>
    <p class="text-lg">Premi sulla bubble in fondo a destra per provare il chatbot</p>
    <div class="absolute bottom-12 right-6 flex flex-col space-y-6">
      <Transition name="iframe" appear>
        <div v-if="iframeVisible" class="shadow-md border-0.5 border-slate-700 rounded-md bg-white z-50">
          <h1 class="pl-6 py-0.5 shadow-sm text-xl font-bold">{{ name }}</h1>
          <iframe class="h-[30rem] w-96" :src="iframeSrc" sandbox="allow-same-origin allow-scripts allow-forms"> </iframe>
        </div>
      </Transition>
      <div class="flex flex-row self-end">
        <button
          class="bg-primary text-white rounded-full transform hover:scale-110 transition duration-300 hover:opacity-95"
          @click="iframeVisible = !iframeVisible"
        >
          <Icon :name="!iframeVisible ? 'ph:chat-circle-text-bold' : 'ph:arrow-down-bold'" class="text-3xl m-4" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  uuid: String,
  name: String,
});

const host = window.location.host;
const iframeSrc = ref('https://test-zanichelli-chatbot.brevia.app/chatbot/76eedcfa-a0ad-4bda-a2df-26cf0e3788b1');
const iframeVisible = ref(false);
const codeArea = ref();
const copiedToClip = ref(false);

const copyCode = () => {
  navigator.clipboard.writeText(codeArea.value.textContent).then(() => {
    copiedToClip.value = true;
    setTimeout(() => (copiedToClip.value = false), 500);
  });
};
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
