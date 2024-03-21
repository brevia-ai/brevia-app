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
                    <VueDatePicker v-model="startDate"
                        :range="false"
                        :enable-time-picker="false"
                        text-input position="center"
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
                    <VueDatePicker v-model="endDate"
                        :range="false"
                        :enable-time-picker="false"
                        text-input position="center"
                        model-type="yyyy-MM-dd"
                        :max-date="new Date()"
                        :format="$formatDate"
                        @update:model-value="showHistory"
                        >
                    </VueDatePicker>
                </div>
            </div>

            <div class="flex justify-between space-x-4">
                <NuxtLink class="button button-secondary uppercase"
                    :to="collectionName">{{ $t('EXIT') }}</NuxtLink>

                <div class="flex justify-between space-x-4">
                    <select class="border rounded border-primary bg-white hover:bg-sky-100 focus:outline-primary text-primary" name="download_format" id="download_format" v-model="downloadFormat">
                        <option value="CSV">CSV</option>
                        <option value="XSLX">XSLX</option>
                    </select>
                    <button type="submit" class="button button-primary uppercase" @click="downloadHistory" :disabled="historyItems.length === 0">
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
                    <div id="customSelect" class="w-80 px-1 border rounded border-primary bg-white hover:bg-sky-100 focus:outline-primary text-primary  hover:cursor-default">
                        <div class="flex flex-row justify-between" @click="openSelect = !openSelect">
                            <span>{{ selectedChat.title }}</span>
                            <Icon class="text-xs self-center" name="ph:caret-down-bold"/>
                        </div>
                        <div v-if="openSelect" class="w-80 -mx-1 absolute z-50 bg-white border border-primary rounded shadow-md">
                            <div
                                v-for="(item, i) in historyItems"
                                class="px-3 text-sm italics flex justify-between"
                                :class="(item.sessionId == selectedChat.id)?'bg-primary text-white':'hover:bg-primary hover:text-white'"
                                @click="loadChat(item.sessionId); selectedChat = { id: item.sessionId, title: item.sessionTitle}; openSelect = !openSelect"
                                >
                                    {{ item.sessionTitle }}
                                    <span class="self-center text-xs italic">{{ item.sessionStart }}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <div v-if="loadingChats" class="flex flex-row justify-center">
                        <svg aria-hidden="true" class=" w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/><path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/></svg>
                        <span class="sr-only">Loading...</span>
                    </div>
                    <div v-else-if="dialog.length">
                        <div class="px-4 pt-6 pb-4 bg-white shadow-md rounded space-y-3">
                            <div class="flex flex-col space-y-6 pb-4">

                                <div class="chat-balloon space-y-2" v-for="(item, i) in dialog" :key="i" :class="{ 'bg-pink-800': item.error}">
                                    <div class="flex space-x-3 justify-between">
                                        <p class="text-xs">{{ item.who }}</p>
                                        <div class="chat-balloon-status" :class="{'busy': isBusy && i === dialog.length - 1}"></div>
                                    </div>
                                    <p>{{ item.message }} &nbsp;</p>
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

const config = useRuntimeConfig();
useHead({ title: `Chat history | ${config.public.appName}`});

interface DialogItem {
    who: string;
    message: string;
    evaluation: any;
    uuid: string;
    error: boolean;
}

const { $formatDate } = useNuxtApp();
const today = new Date();
const priorDate = new Date();
priorDate.setDate(today.getDate() - 30)
const startDate = ref($formatDate(priorDate));
const endDate = ref($formatDate(today));
const downloadFormat = ref('CSV');

const isBusy = ref(false);

const { t } = useI18n();
const route = useRoute();
const collectionName = route.params.id as string;
const historyItems = ref<any[]>([]);
const dialog = ref<DialogItem[]>([]);
const loadingChats = ref(false);
const selectedChat = ref<any>({
    title: '',
    id: '',
})
const openSelect = ref(false);

const { data: collection } = await useFetch(`/api/brevia/collections?name=${collectionName}`);
if (!collection.value?.uuid) {
    throw createError({
        statusCode: 404,
        message: 'not found',
        fatal: true
    });
}

const csvKeys = [
    'question',
    'answer',
    'session_id',
    'created',
    'user_evaluation',
    'user_feedback',
    'chat_source',
];

onBeforeMount(async() => showHistory());

const formatDialogItem = (who: string, message: string, evaluation = null, uuid = '', error = false): DialogItem => {
    return {
        who,
        message,
        evaluation,
        uuid,
        error,
    }
};

const downloadHistory = async () => {
    if (downloadFormat.value === 'CSV') {
        await downloadCsv();
    } else {
        await downloadXslx();
    }
}

const downloadCsv = async () => {
    isBusy.value = true;
    const items = await loadHistoryItems();
    const fileName = `chat-history-${collectionName}-${startDate.value}-${endDate.value}`;

    const csvConfig = mkConfig({columnHeaders: csvKeys, filename: fileName});
    const csv = generateCsv(csvConfig)(items);
    download(csvConfig)(csv);
    isBusy.value = false;
}

const downloadXslx = async () => {
    isBusy.value = true;
    const items = await loadHistoryItems();
    const fileName = `chat-history-${collectionName}-${startDate.value}-${endDate.value}`;

    const worksheet = utils.json_to_sheet(items);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, "Chat History");
    writeFile(workbook, `${fileName}.xlsx`, { compression: true });
    isBusy.value = false;
}

const showHistory = async () => {
    historyItems.value = await loadHistoryList();
    if (historyItems.value.length === 0) {
        return;
    }
    const firstChat = historyItems.value[0]?.sessionId;
    selectedChat.value = {
        title: historyItems.value[0]?.sessionTitle,
        id: historyItems.value[0]?.sessionId
    };
    loadChat(firstChat);
}

const loadHistoryList = async () => {
    const items = await loadHistoryItems();
    items.sort((a:any, b:any) => {return +new Date(b.created) - +new Date(a.created);}).reverse();
    const sessions: any[] = [];
    for (let i in items) {
        if(!sessions.some(el => el.sessionId === items[i].session_id)) {
            sessions.push({
                sessionId: items[i].session_id,
                sessionTitle: (items[i].question.length > 25)?items[i].question[0].toUpperCase() + items[i].question.slice(1, 25) + '...':items[i].question[0].toUpperCase() + items[i].question.slice(1, 25),
                sessionStart: items[i].created.substring(0,10) + ' ' + items[i].created.substring(11,16)
            });
        }
    }
    return sessions.reverse();
}

const loadChat = async(id:any) => {
        try {
            loadingChats.value = true;
            const data:any = await $fetch('/api/brevia/chat_history?session_id='+id+'&collection=enpacl-assistant');
            let loadedDialog:DialogItem[] = []
            for(let i=data.data.length-1; i>=0; i--) {
                loadedDialog.push(formatDialogItem('TU', data.data[i].question, data.data[i].user_evaluation, data.data[i].uuid));
                loadedDialog.push(formatDialogItem('ENPACL-ASSISTANT', data.data[i].answer, data.data[i].user_evaluation, data.data[i].uuid));
            }
            dialog.value = loadedDialog;
            loadingChats.value = false;

        } catch(error) {
            console.error(error);
            loadingChats.value = false;
        }
    }

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

</script>
