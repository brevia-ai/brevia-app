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
                        :format="$formatDate">
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
                        :format="$formatDate">
                    </VueDatePicker>
                </div>
            </div>

            <div class="flex justify-between space-x-4">
                <NuxtLink class="button button-secondary uppercase"
                    :to="collectionName">{{ $t('EXIT') }}</NuxtLink>

                <div class="flex justify-between space-x-4">
                    <select class="border rounded border-primary bg-white hover:bg-sky-100 text-primary" name="download_format" id="download_format" v-model="downloadFormat">
                        <option value="CSV">CSV</option>
                        <option value="XSLX">XSLX</option>
                    </select>
                    <button type="submit" class="button button-primary uppercase" @click="downloadHistory">
                        {{ $t('Download') }}
                    </button>
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

const loadHistoryItems = async () => {
    let query = `min_date=${startDate.value}&max_date=${endDate.value}&collection=${collectionName}`;
    query += `&page_size=1000`;
    let items = [];
    try {
        const response = await fetch(`/api/brevia/chat_history?${query}`);
        const data = await response.json();
        items = data?.data || [];
    } catch (error) {
        console.log(error);
    }

    return items;
};

</script>
