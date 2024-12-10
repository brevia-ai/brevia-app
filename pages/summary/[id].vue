<template>
  <div class="space-y-6">
    <h2 class="text-2xl md:text-3xl lg:text-4xl leading-tight font-bold">{{ menuItem?.title }}</h2>
    <div class="space-y-6 md:space-y-8">
      <div v-html="menuItem?.description"></div>

      <div class="flex max-sm:flex-col gap-x-8 gap-y-6">
        <div class="sm:w-2/3">
          <DropZone
            ref="fileDrop"
            class="sm:h-72 sm:min-h-full"
            :disabled="isBusy || jobsLeft == '0'"
            :accept-types="acceptTypes"
            @file-change="file = $event"
          />
        </div>

        <div v-if="menuItem?.params?.payload?.prompts" class="flex flex-col justify-center gap-6">
          <div class="flex flex-col gap-2 max-sm:max-w-sm max-sm:mx-auto max-sm:px-4">
            <div class="hidden sm:block">{{ $t('ANSWER_TYPE') }}</div>
            <div class="flex flex-col space-y-1" :class="{ 'text-neutral-400': isBusy }">
              <label class="flex items-center space-x-2 cursor-pointer">
                <input v-model="summaryType" type="radio" name="type" :value="'summarize'" :disabled="isBusy" />
                <span class="whitespace-nowrap" :class="{ 'font-bold': summaryType === 'summarize' }">{{ $t('TEXT_SUMMARY') }}</span>
              </label>
              <label class="flex items-center space-x-2 cursor-pointer">
                <input v-model="summaryType" type="radio" name="type" :value="'summarize_point'" :disabled="isBusy" />
                <span class="whitespace-nowrap" :class="{ 'font-bold': summaryType === 'summarize_point' }">{{ $t('BULLET_LIST_SUMMARY') }}</span>
              </label>
              <label class="flex items-center space-x-2 cursor-pointer">
                <input v-model="summaryType" type="radio" name="type" :value="'classificate'" :disabled="isBusy" />
                <span class="whitespace-nowrap" :class="{ 'font-bold': summaryType === 'classificate' }">{{ $t('CATEGORIZE_CONTENT') }}</span>
              </label>
            </div>
          </div>

          <div class="flex flex-col gap-2 max-sm:max-w-sm max-sm:mx-auto max-sm:px-4">
            <div class="hidden sm:block">{{ $t('ANSWER_IN') }}</div>
            <div class="flex flex-col space-y-1" :class="{ 'text-neutral-400': isBusy }">
              <label class="flex items-center space-x-2 cursor-pointer">
                <input v-model="summaryLanguage" type="radio" name="language" :value="null" :disabled="isBusy" />
                <span class="whitespace-nowrap" :class="{ 'font-bold': !summaryLanguage }">{{ $t('DOCUMENT_LANGUAGE') }}</span>
              </label>
              <label class="flex items-center space-x-2 cursor-pointer">
                <input v-model="summaryLanguage" type="radio" name="language" :value="'Italian'" :disabled="isBusy" />
                <span class="whitespace-nowrap" :class="{ 'font-bold': summaryLanguage === 'Italian' }">Italiano</span>
              </label>
              <label class="flex items-center space-x-2 cursor-pointer">
                <input v-model="summaryLanguage" type="radio" name="language" :value="'English'" :disabled="isBusy" />
                <span class="whitespace-nowrap" :class="{ 'font-bold': summaryLanguage === 'English' }">English</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <div class="flex max-sm:flex-col gap-x-8 gap-y-4">
        <button class="button sm:w-2/3" :class="{ 'is-loading': isBusy }" :disabled="!file || isBusy || jobsLeft == '0'" @click="submit">
          {{ $t('UPLOAD_AND_ANALYZE_FILE') }}
        </button>

        <button class="bg-slate-500 button px-12" :class="{ 'hover:bg-red-700': !resetDisabled }" :disabled="resetDisabled" @click="reset">
          {{ $t('RESET') }}
        </button>
      </div>
      <div v-if="isDemo" class="space-y-4">
        <span class="grow text-lg">{{ $t('JOBS_LEFT') }}: {{ jobsLeft }}</span>
      </div>

      <div v-if="isDemo && jobsLeft == '0'" class="space-x-4">
        <p class="block p-8 bg-red-100 border border-red-400 rounded-lg text-lg whitespace-pre-line">
          {{ $t('NO_MORE_ANALYSIS_JOBS') }}
        </p>
      </div>

      <hr v-if="jobData" class="border-neutral-300" />

      <div v-if="jobData" class="space-y-4">
        <h2 class="text-xl leading-tight text-center">
          <span class="block md:inline font-bold break-all">{{ file.name }}</span> {{ $t('SUMMARIZATION') }}
          <span class="block md:inline font-bold">{{ jobStatus }}</span>
        </h2>
      </div>

      <div v-if="summary" class="space-y-4">
        <p class="block p-8 bg-slate-900 border border-slate-900 text-white rounded-lg text-lg whitespace-pre-line leading-relaxed">{{ summary }}</p>
      </div>

      <button v-if="summary" class="block w-full sm:max-w-xs mx-auto button" @click="downloadPdf">{{ $t('DOWNLOAD_SUMMARY') }}</button>

      <div v-if="error" class="space-y-4">
        <p class="block p-8 bg-red-900 border border-red-900 text-white rounded-lg text-lg whitespace-pre-line">{{ error }}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useStatesStore } from '~~/store/states';
const INTERVAL = 15000; // 15 seconds in ms

const summaryType = ref('summarize');
const summaryLanguage = ref(null);
const file = ref(null);
const isBusy = ref(false);
const summary = ref(null);
const jobId = ref(null);
const jobData = ref(null);
let pollingId: any = null;
const error = ref('');
const isDemo = ref(false);
const jobsLeft = ref('');
const menuItem = ref();
const store = useStatesStore();
const fileDrop = ref(null);

const { $createPdf } = useNuxtApp();

onBeforeRouteLeave(() => {
  stopPolling();
});

onBeforeMount(() => {
  const link = useRoute().path;
  store.userAccess(link);
  menuItem.value = store.getMenuItem(link);
  const config = useRuntimeConfig();
  useHead({ title: `${menuItem.value?.title} | ${config.public.appName}` });
  const info = store.getJobInfo('summary');
  jobId.value = info?.id || null;
  file.value = info?.file || null;
  startPolling();
  isBusy.value = !!jobId.value;
  isDemo.value = store.userHasRole('demo');
  updateJobsLeft();
});

const jobStatus = computed(() => {
  if (jobData.value?.completed) {
    return 'completed';
  }
  if (jobData.value?.locked_until) {
    return 'in progress';
  }

  return 'idle';
});

const resetDisabled = computed(() => {
  return !file.value || (isBusy.value && !pollingId);
});

const acceptTypes = computed(() => {
  return menuItem.value?.params?.accept || 'application/pdf';
});

const reset = () => {
  file.value = null;
  summary.value = null;
  error.value = '';
  isBusy.value = false;
  jobId.value = null;
  jobData.value = null;
  store.setJobInfo('summary', null);
  stopPolling();
  fileDrop.value?.reset();
};

const startPolling = () => {
  if (!jobId.value) {
    return;
  }
  // read first after 1 sec, then every 15 sec
  setTimeout(() => readJobData(), 1000);
  pollingId = setInterval(() => readJobData(), INTERVAL);
};

const stopPolling = () => {
  if (pollingId) {
    clearInterval(pollingId);
  }
  pollingId = null;
};

const updateJobsLeft = async () => {
  if (!isDemo.value) {
    return;
  }

  const userId = store.user?.id;
  const query = `service=brevia.services.SummarizeFileService&user_id=${userId}`;
  try {
    const response = await fetch(`/api/brevia/service_usage?${query}`);
    const data = await response.json();
    const usage = data?.usage || 0;
    const left = Math.max(0, parseInt(useRuntimeConfig().public.demo.maxNumAnalysis) - parseInt(usage));
    jobsLeft.value = String(left);
  } catch (error) {
    console.log(error);
  }
};

const submit = async () => {
  isBusy.value = true;
  summary.value = null;
  error.value = '';
  jobId.value = null;
  jobData.value = null;
  const formData = new FormData();
  formData.append('initial_prompt', summaryPrompt());
  if (isDemo.value) {
    formData.append('payload', `{"user_id": "${store.user?.id}"}`);
  }

  formData.append('file', file.value);
  try {
    // 'multipart/form-data' Content-type header
    // intentionally not set to avoid boundary error
    // https://stackoverflow.com/questions/39280438/fetch-missing-boundary-in-multipart-form-data-post/39281156#39281156
    const data = await $fetch('/api/brevia/upload_summarize', {
      method: 'POST',
      body: formData,
    });

    if (data.error) {
      isBusy.value = false;
      error.value = `There has been an error\n${data.error}`;
      console.log(data.error);
    } else {
      jobId.value = data.job?.trim() || '';
      store.setJobInfo('summary', { id: jobId.value, file: { name: file.value?.name } });
      startPolling();
    }
  } catch (error) {
    error.value = error;
    console.log(error);
  }
};

const summaryPrompt = () => {
  const prompts = menuItem.value?.params?.payload?.prompts || {};
  const originalPrompt = prompts?.[summaryType.value] || null;
  const summPrompt = { ...originalPrompt };
  if (summPrompt.template) {
    const lang = summaryLanguage.value || 'the same language of the text';
    summPrompt.template = summPrompt.template.replace('%lang%', lang);
  }

  return summPrompt ? JSON.stringify(summPrompt) : '';
};

const downloadPdf = () => {
  const doc = $createPdf(summary.value || '');
  const date = new Date().toISOString().split('T')[0];
  const pdfTitle = `Summary-${file.value?.name}-${date}.pdf`;
  doc.save(pdfTitle);
};

const readJobData = async () => {
  if (!jobId.value) {
    return;
  }
  try {
    const data = await $fetch(`/api/brevia/jobs/${jobId.value}`);
    const err = data?.error || data.result?.error || null;
    if (err) {
      isBusy.value = false;
      error.value = `There has been an error\n${err}`;
      console.log(err);
      stopPolling();
    } else {
      jobData.value = data;
      if (jobData.value?.completed) {
        summary.value = data?.result?.output;
        stopPolling();
        store.setJobInfo('summary', null);
        jobId.value = null;
        isBusy.value = false;
        updateJobsLeft();
      }
    }
  } catch (error) {
    error.value = error;
    console.log(error);
  }
};
</script>
