<template>
  <main>
    <div class="space-y-10">
      <div class="flex items-start justify-between space-x-4">
        <h2 class="text-2xl leading-tight">{{ $t('Chat history') }} “{{ collection.cmetadata?.title }}”</h2>
      </div>

      <div class="flex justify-between space-x-10">
        <div>
          <label>
            <span>{{ $t('START_DATE') }}</span>
          </label>
          <VueDatePicker
            v-model="startDate"
            :range="false"
            :enable-time-picker="false"
            text-input
            position="center"
            model-type="yyyy-MM-dd"
            :max-date="new Date()"
            :format="$formatDate"
            @update:model-value="showHistory"
          >
          </VueDatePicker>
        </div>
        <div>
          <label>
            <span>{{ $t('END_DATE') }}</span>
          </label>
          <VueDatePicker
            v-model="endDate"
            :range="false"
            :enable-time-picker="false"
            text-input
            position="center"
            model-type="yyyy-MM-dd"
            :max-date="new Date()"
            :format="$formatDate"
            @update:model-value="showHistory"
          >
          </VueDatePicker>
        </div>
      </div>

      <div class="flex justify-between space-x-4">
        <NuxtLink class="button button-secondary uppercase" :to="collectionName">{{ $t('EXIT') }}</NuxtLink>

        <div class="flex justify-between space-x-4">
          <select
            id="download_format"
            v-model="downloadFormat"
            class="border rounded border-primary bg-white hover:bg-sky-100 focus:outline-primary text-primary"
            name="download_format"
          >
            <option value="CSV">CSV</option>
            <option value="XSLX">XSLX</option>
          </select>
          <button type="submit" class="button button-primary uppercase" :disabled="historyItems.length === 0" @click="downloadHistory">
            {{ $t('Download') }}
          </button>
        </div>
      </div>
      <div v-if="!loadingChats && historyItems.length === 0" class="flex flex-col space-y-3">
        <span>{{ $t('CHAT_HISTORY_EMPTY') }}</span>
      </div>
      <div v-else class="flex flex-col space-y-3">
        <div class="flex justify-between border-b border-slate-300">
          <span>{{ $t('CHAT_HISTORY_PREVIEW') }}</span>
          <div
            id="customSelect"
            class="w-96 px-1 border rounded border-primary bg-white hover:bg-sky-100 focus:outline-primary text-primary hover:cursor-default"
          >
            <div class="flex flex-row justify-between" @click="openSelect = !openSelect">
              <span v-html="formatResponse(selectedChat.title, collection?.cmetadata?.qa_completion_llm)"></span>
              <Icon class="text-xs self-center" name="ph:caret-down-bold" />
            </div>
            <div v-if="openSelect" class="w-96 -mx-1 max-h-96 absolute z-50 bg-white border border-primary rounded shadow-md overflow-y-scroll">
              <div
                v-for="item in historyItems"
                :key="item.sessionId"
                class="px-3 text-sm italics flex justify-between"
                :class="item.sessionId == selectedChat.id ? 'bg-primary text-white' : 'hover:bg-primary hover:text-white'"
                @click="
                  loadChat(item.sessionId);
                  selectedChat = { id: item.sessionId, title: item.sessionFullTitle };
                  openSelect = !openSelect;
                "
              >
                <span v-html="formatResponse(item.sessionTitle, collection?.cmetadata?.qa_completion_llm)"></span>
                <span class="self-center text-xs italic">{{ getLocalCreationDate(item.sessionStart) }}</span>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div v-if="loadingChats" class="flex flex-row justify-center">
            <ElementLoader :loader-dim="64" class="mt-16" />
            <span class="sr-only">Loading...</span>
          </div>
          <div v-else-if="dialog.length">
            <div class="px-4 pt-6 pb-4 bg-white shadow-md rounded space-y-3">
              <div class="flex flex-col space-y-6 pb-4">
                <div v-for="(item, i) in dialog" :key="i" class="chat-balloon space-y-2" :class="{ 'bg-pink-800': item.error }">
                  <div class="flex space-x-3 justify-between">
                    <p class="text-xs">{{ item.who }}</p>
                  </div>
                  <p class="whitespace-break-spaces" v-html="formatResponse(item.message, collection?.cmetadata?.qa_completion_llm)"></p>
                  <div
                    v-if="item.who === 'ASSISTANT' && item.evaluation !== null"
                    class="p-2 absolute -bottom-4 right-4 z-20 bg-neutral-700 rounded-full flex flex-row"
                    :class="{ 'hover:cursor-pointer hover:bg-neutral-500': item.feedback }"
                    @click="item.feedback ? $openModal('ShowAnswerFeedback', { evaluation: item.evaluation, feedback: item.feedback }) : ''"
                  >
                    <Icon
                      class="self-center"
                      :class="item.evaluation === true ? 'text-green-600' : 'text-red-600'"
                      :name="item.evaluation === true ? 'material-symbols:thumb-up' : 'material-symbols:thumb-down'"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script lang="ts" setup>
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import { mkConfig, generateCsv, download } from 'export-to-csv';
import { utils, writeFile } from 'xlsx';
import moment from 'moment';

const config = useRuntimeConfig();
const { formatResponse } = useResponseFormat();
useHead({ title: `Chat history | ${config.public.appName}` });

interface DialogItem {
  who: string;
  message: string;
  evaluation: any;
  feedback: string;
  uuid: string;
  error: boolean;
}

const { $formatDate } = useNuxtApp();
const today = new Date();
const priorDate = new Date();
priorDate.setDate(today.getDate() - 30);
const startDate = ref($formatDate(priorDate));
const endDate = ref($formatDate(today));
const downloadFormat = ref('CSV');

const isBusy = ref(false);

const route = useRoute();
const collectionName = route.params.id as string;
const historyItems = ref<any[]>([]);
const dialog = ref<DialogItem[]>([]);
const loadingChats = ref(false);
const selectedChat = ref<any>({
  title: '',
  id: '',
});
const openSelect = ref(false);

const { data: collection } = await useFetch(`/api/brevia/collections?name=${collectionName}`);
if (!collection.value?.uuid) {
  throw createError({
    statusCode: 404,
    message: 'not found',
    fatal: true,
  });
}

const csvKeys = ['question', 'answer', 'session_id', 'created', 'user_evaluation', 'user_feedback', 'chat_source'];

onBeforeMount(async () => showHistory());

const formatDialogItem = (who: string, message: string, evaluation = null, feedback: string, uuid = '', error = false): DialogItem => {
  return {
    who,
    message,
    evaluation,
    feedback,
    uuid,
    error,
  };
};

const downloadHistory = async () => {
  if (downloadFormat.value === 'CSV') {
    await downloadCsv();
  } else {
    await downloadXslx();
  }
};

const downloadCsv = async () => {
  isBusy.value = true;
  const items = await loadHistoryItems();
  const fileName = `chat-history-${collectionName}-${startDate.value}-${endDate.value}`;

  const csvConfig = mkConfig({ columnHeaders: csvKeys, filename: fileName });
  const csv = generateCsv(csvConfig)(items);
  download(csvConfig)(csv);
  isBusy.value = false;
};

const downloadXslx = async () => {
  isBusy.value = true;
  const items = await loadHistoryItems();
  const fileName = `chat-history-${collectionName}-${startDate.value}-${endDate.value}`;

  const worksheet = utils.json_to_sheet(items);
  const workbook = utils.book_new();
  utils.book_append_sheet(workbook, worksheet, 'Chat History');
  writeFile(workbook, `${fileName}.xlsx`, { compression: true });
  isBusy.value = false;
};

const showHistory = async () => {
  historyItems.value = await loadHistoryList();
  if (historyItems.value.length === 0) {
    return;
  }
  const firstChat = historyItems.value[0]?.sessionId;
  selectedChat.value = {
    title: historyItems.value[0]?.sessionFullTitle,
    id: historyItems.value[0]?.sessionId,
  };
  loadChat(firstChat);
};

const loadHistoryList = async () => {
  const items = await loadHistoryItems();
  items
    .sort((a: any, b: any) => {
      return +new Date(b.created) - +new Date(a.created);
    })
    .reverse();
  const sessions: any[] = [];
  for (const i in items) {
    if (!sessions.some((el) => el.sessionId === items[i].session_id)) {
      sessions.push({
        sessionId: items[i].session_id,
        sessionTitle:
          items[i].question.length > 20
            ? items[i].question[0].toUpperCase() + items[i].question.slice(1, 20) + '...'
            : items[i].question[0].toUpperCase() + items[i].question.slice(1, 25),
        sessionStart: items[i].created.substring(0, 10) + ' ' + items[i].created.substring(11, 16),
        sessionFullTitle:
          items[i].question.length > 40
            ? items[i].question[0].toUpperCase() + items[i].question.slice(1, 40) + '...'
            : items[i].question[0].toUpperCase() + items[i].question.slice(1, 40),
      });
    }
  }
  return sessions.reverse();
};

const loadChat = async (id: any) => {
  try {
    loadingChats.value = true;
    const data: any = await $fetch(`/api/brevia/chat_history?session_id=${id}&collection=${collectionName}`);
    const loadedDialog: DialogItem[] = [];
    for (let i = data.data.length - 1; i >= 0; i--) {
      loadedDialog.push(formatDialogItem('USER', data.data[i].question, data.data[i].user_evaluation, data.data[i].user_feedback, data.data[i].uuid));
      loadedDialog.push(formatDialogItem('ASSISTANT', data.data[i].answer, data.data[i].user_evaluation, data.data[i].user_feedback, data.data[i].uuid));
    }
    dialog.value = loadedDialog;
    setTimeout(() => (loadingChats.value = false), 250);
  } catch (error) {
    console.error(error);
    setTimeout(() => (loadingChats.value = false), 250);
  }
};

const loadHistoryItems = async () => {
  let query = `min_date=${startDate.value}&max_date=${endDate.value}&collection=${collectionName}`;
  query += `&page_size=1000`;
  let items = [];
  try {
    const response = await fetch(`/api/brevia/chat_history?${query}`);
    const data = await response.json();
    items = data?.data || [];
  } catch (error) {
    console.error(error);
  }
  return items;
};

const getLocalCreationDate = (data: string) => {
  const utcDate = new Date(data);
  const timeOffset = new Date().getTimezoneOffset();
  const localDate = new Date(utcDate.getTime() - timeOffset * 60 * 1000);
  return moment(localDate).format('DD/MM/YYYY - hh:mm');
};
</script>
