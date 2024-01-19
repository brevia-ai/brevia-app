<template>
    <main>
        <div class="space-y-10">
            <div class="flex items-start justify-between space-x-4">
                <h2 class="text-2xl leading-tight">{{ $t('Chat history') }} “{{ collection.cmetadata?.title }}”</h2>
            </div>

            <div class="flex flex-col space-y-8">
                <div class="mx-12 content-start grid grid-cols-2 gap-2">
                    <label class="flex items-center space-x-2">
                        <span>{{ $t('From') }}</span>
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
                <div class="mx-12 content-start grid grid-cols-2 gap-2">
                    <label class="flex items-center space-x-2">
                        <span>{{ $t('To') }}</span>
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

                <button type="submit" class="button button-primary uppercase" @click="downloadCsv">
                    {{ $t('Download') }}
                </button>
            </div>
        </div>
    </main>
</template>

<script lang="ts" setup>
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import { mkConfig, generateCsv, download } from 'export-to-csv';

const config = useRuntimeConfig();
useHead({ title: `Chat history | ${config.public.appName}`});

const { $formatDate } = useNuxtApp();
const today = new Date();
const priorDate = new Date();
priorDate.setDate(today.getDate() - 30)
const startDate = ref($formatDate(priorDate));
const endDate = ref($formatDate(today));

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

const downloadCsv = async () => {
    isBusy.value = true;
    const items = await loadHistoryItems();
    const fileName = `chat-history-${collectionName}-${startDate.value}-${endDate.value}`;

    const csvConfig = mkConfig({columnHeaders: csvKeys, filename: fileName});
    const csv = generateCsv(csvConfig)(items);
    download(csvConfig)(csv);
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
