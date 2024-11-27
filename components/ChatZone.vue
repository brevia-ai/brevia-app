<template>
  <div v-if="dialog.length">
    <div class="pt-6 pb-4 space-y-3" :class="(isEmbedded)? 'h-[85vh] px-4 sm:px-6 overflow-y-auto w-full' : 'bg-white px-4 relative shadow-md rounded'">
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
          <!--MENU CONTESTUALE-->
          <div
            v-if="canSeeDocs && i === dialog.length - 1 && showResponseMenu && hovered === i"
            class="px-2 py-0.5 absolute -bottom-5 right-4 z-50 bg-neutral-700 rounded-full flex flex-row"
          >
            <div
              class="px-1.5 pb-1 hover:bg-neutral-600 hover:rounded-full hover:cursor-pointer"
              :title="$t('SHOW_DOCUMENTS_FOUND')"
              @click="$openModal('ChatDocuments', { session_id: sessionId, documents: docs })"
            >
              <Icon name="fluent:document-question-mark-16-regular"></Icon>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="space-y-4" :class="{ 'bottom-6 left-0 px-4 grow w-full': isEmbedded }">
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
    <slot name="messageCounter"></slot>
  </div>
</template>

<script setup lang="ts">
const { $openModal } = useNuxtApp();
const config = useRuntimeConfig();
const { formatResponse, llmResponseFormat } = useResponseFormat();
const props = defineProps(['isDemoChatbot', 'messagesLeft', 'collection', 'isEmbedded']);
const emit = defineEmits(['updateLeft']);

interface DialogItem {
  who: string;
  message: string;
  error: boolean;
}

const { t } = useI18n();

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

const hovered = ref(-1);
const showResponseMenu = ref(true);

let sessionId = '';
let collectionName = '';
const responseFormat = ref('text');

onBeforeMount(async () => {
  collectionName = props.collection.name;
  responseFormat.value = llmResponseFormat(props.collection.cmetadata?.qa_completion_llm);
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
    if (props.isDemoChatbot) await updateLeftMessages();
  }
  if (props.isDemoChatbot) await updateLeftMessages();
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
  if (!props.isDemoChatbot) {
    return;
  }

  const today = new Date().toISOString().substring(0, 10);
  const query = `min_date=${today}&collection=${props.collection.name}`;
  try {
    const response = await fetch(`/api/brevia/chat_history?${query}`);
    const data = await response.json();
    const numItems = data?.meta?.pagination?.count || 0;
    const left = Math.max(0, parseInt(config.public.demo.maxChatMessages) - parseInt(numItems));
    emit('updateLeft', left);
  } catch (error) {
    console.log(error);
  }
};
</script>
