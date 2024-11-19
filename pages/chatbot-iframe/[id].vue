<template>
  <main>
    <div v-if="collection.uuid" class="space-y-12">
      <div class="flex justify-between items-start space-x-4">
        <div class="space-y-4">
          <h2 class="text-2xl md:text-3xl leading-tight font-bold">{{ collection.cmetadata?.title }}</h2>
          <div v-if="collection.cmetadata?.description" class="text-neutral-600" v-html="collection.cmetadata?.description"></div>
        </div>
      </div>

      <div v-if="dialog.length">
        <!-- <hr class="my-6 border-neutral-300"> -->
        <div class="px-4 pt-6 pb-4 bg-white shadow-md rounded space-y-3">
          <div class="flex flex-col space-y-6 pb-4">
            <div
              v-for="(item, i) in dialog"
              :key="i"
              class="chat-balloon space-y-2"
              :class="{ 'bg-pink-800': item.error }"
              @mouseover="
                showResponseMenu = true;
                hovered = i;
              "
              @mouseleave="showResponseMenu = false"
            >
              <div class="flex space-x-3 justify-between">
                <p class="text-xs">{{ item.who }}</p>
                <div class="chat-balloon-status" :class="{ busy: isBusy && i === dialog.length - 1 }"></div>
              </div>
              <div class="break-words rich-text" v-html="formatResponse(item.message, responseFormat)"></div>
            </div>
          </div>
        </div>
      </div>

      <div class="space-y-4">
        <div class="flex space-x-4">
          <input
            ref="input"
            v-model.trim="prompt"
            type="text"
            class="grow text-lg p-2 rounded border border-sky-500 disabled:bg-neutral-100 disabled:border-neutral-300 shadow-md disabled:shadow-none"
            :disabled="isBusy || messagesLeft == '0'"
            @keydown.enter="submit"
          />
          <button class="px-6 button shadow-md disabled:shadow-none" :disabled="isBusy || messagesLeft == '0'" @click="submit">
            <span class="sm:hidden">›</span>
            <span class="hidden sm:inline">{{ $t('SEND') }}</span>
          </button>
        </div>
      </div>
    </div>
  </main>
</template>

<script lang="ts" setup>
const config = useRuntimeConfig();
const store = useStatesStore();
const { formatResponse, llmResponseFormat } = useResponseFormat();

interface DialogItem {
  who: string;
  message: string;
  error: boolean;
}

const { t } = useI18n();

const collection = ref<{ name?: string; uuid?: string; cmetadata?: any }>({});
const isBusy = ref(false);
const prompt = ref('');
const input = ref<HTMLElement | null>(null);
const dialog = ref<DialogItem[]>([]);
const docs = ref<any>([]);
const historyId = ref('');
const canSeeDocs = ref(false);
let docsJsonString = '';
let responseEnded = false;
let currIdx = 0;

const isDemo = ref(store.userHasRole('demo'));
const messagesLeft = ref('');
const hovered = ref(-1);
const showResponseMenu = ref(true);

let sessionId = '';
let collectionName = '';
let editLevel = ItemEditLevel.None;
const responseFormat = ref('text');

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

  responseFormat.value = llmResponseFormat(collection.value.cmetadata?.qa_completion_llm);
  sessionId = crypto.randomUUID();
  isBusy.value = false;
  updateLeftMessages();
});

watch(isBusy, (val) => {
  if (!val) {
    setTimeout(() => {
      input.value?.focus();
    }, 100);
  }
});

// methods
const formatDialogItem = (who: string, message: string, error = false): DialogItem => {
  return {
    who,
    message,
    error,
  };
};

const submit = async () => {
  if (!prompt.value) return;

  isBusy.value = true;

  dialog.value.push(formatDialogItem('YOU', prompt.value));
  dialog.value.push(formatDialogItem('BREVIA', ''));

  currIdx = dialog.value.length - 1;

  try {
    await streamingFetchRequest();
    isBusy.value = false;
  } catch (error) {
    isBusy.value = false;
    showErrorInDialog(currIdx);
    console.log(error);
  }
};

const streamingFetchRequest = async () => {
  const question = prompt.value;
  prompt.value = '';
  docs.value = [];
  historyId.value = '';
  docsJsonString = '';
  responseEnded = false;
  canSeeDocs.value = false;

  const response = await fetch('/api/brevia/chat', {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
      'X-Chat-Session': sessionId,
    },
    body: JSON.stringify({
      question,
      collection: collectionName,
      source_docs: true,
      streaming: true,
    }),
  });

  const reader = response?.body?.getReader();
  if (reader) {
    for await (const chunk of readChunks(reader)) {
      const text = new TextDecoder().decode(chunk);
      handleStreamText(text);
    }
    parseDocsJson();
    await updateLeftMessages();
  }
  await updateLeftMessages();
};

const readChunks = (reader: ReadableStreamDefaultReader) => {
  return {
    async *[Symbol.asyncIterator]() {
      let readResult = await reader.read();
      while (!readResult.done) {
        yield readResult.value;
        readResult = await reader.read();
      }
    },
  };
};

const handleStreamText = (text: string) => {
  if (text.includes('[{"chat_history_id":') || text.includes('[{"page_content":')) {
    const idx1 = text.indexOf('[{"chat_history_id":');
    const idx2 = text.indexOf('[{"page_content":');
    const idx = Math.max(idx1, idx2);
    dialog.value[currIdx].message += text.slice(0, idx);
    responseEnded = true;
    docsJsonString += text.slice(idx);
  } else if (responseEnded) {
    docsJsonString += text;
  } else if (text.startsWith('{"error":')) {
    try {
      const err = JSON.parse(text);
      console.error(`Error response from API "${err?.error}"`);
      showErrorInDialog(currIdx);
    } catch (e) {
      return console.error(e);
    }
  } else {
    dialog.value[currIdx].message += text;
  }
};

const parseDocsJson = () => {
  try {
    if (!docsJsonString) {
      console.error('No docs found in response');
      dialog.value[currIdx].error = true;
      return;
    }
    const parsed = JSON.parse(docsJsonString);
    if (parsed?.[0]?.chat_history_id) {
      const item = parsed?.shift() || {};
      historyId.value = item?.chat_history_id || '';
    }
    docs.value = parsed;
    canSeeDocs.value = true;
  } catch (e) {
    return console.error(e);
  }
};

const showErrorInDialog = (index: number) => {
  const dialogItem = formatDialogItem('BREVIA', t('SOMETHING_WENT_WRONG'), true);

  if (index) {
    dialog.value[index] = dialogItem;
    return;
  }

  dialog.value.push(dialogItem);
};

const updateLeftMessages = async () => {
  if (!isDemo.value) {
    return;
  }

  const today = new Date().toISOString().substring(0, 10);
  const query = `min_date=${today}&collection=${collection.value?.name}`;
  try {
    const response = await fetch(`/api/brevia/chat_history?${query}`);
    const data = await response.json();
    const numItems = data?.meta?.pagination?.count || 0;
    const left = Math.max(0, parseInt(config.public.demo.maxChatMessages) - parseInt(numItems));
    messagesLeft.value = String(left);
  } catch (error) {
    console.log(error);
  }
};
</script>
