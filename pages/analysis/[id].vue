<template>
  <!-- div to make draggable the outside area of the page-->
  <div
    class="absolute grow top-24 left-0 right-0 pb-14 bottom-80 sm:bottom-96"
    @dragover="
      (e) => {
        e.preventDefault();
        fileDrop.onDragOver(e);
      }
    "
    @dragleave="
      (e) => {
        e.preventDefault();
        fileDrop.onDragLeave();
      }
    "
    @drop="
      (e) => {
        e.preventDefault();
        fileDrop.onDrop(e);
      }
    "
  >
    <div
      v-if="fileDrop?.isDragging"
      class="absolute z-10 inset-2 border-black border-2 border-dashed mb-2 rounded-lg bg-slate-500 bg-opacity-40 pointer-events-none"
    ></div>
  </div>
  <main
    class="space-y-6 h-full relative"
    @dragover="
      (e) => {
        e.preventDefault();
        fileDrop.onDragOver(e);
      }
    "
    @dragleave="
      (e) => {
        e.preventDefault();
        fileDrop.onDragLeave();
      }
    "
    @drop="
      (e) => {
        e.preventDefault();
        fileDrop.onDrop(e);
      }
    "
  >
    <h2 class="text-2xl md:text-3xl lg:text-4xl leading-tight font-bold">{{ menuItem?.title }}</h2>
    <div class="space-y-6 sm:space-y-8">
      <div v-html="menuItem?.description"></div>

      <div>
        <DropZone ref="fileDrop" :disabled="isBusy || jobsLeft == '0'" :accept-types="acceptTypes" @file-change="file = $event" />
      </div>

      <div class="flex flex-col sm:flex-row justify-between">
        <button class="w-full sm:w-auto px-8 py-2 sm:py-4 button" :disabled="!file || isBusy || jobsLeft == '0'" @click="submit">
          {{ $t('UPLOAD_AND_ANALYZE_FILE') }}
        </button>
        <button
          class="w-full sm:w-auto mt-4 sm:ml-6 sm:mt-0 px-8 py-2 sm:py-4 bg-red-900 button"
          :class="{ 'hover:bg-red-700': !resetDisabled }"
          :disabled="resetDisabled"
          @click="reset"
        >
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

      <hr ref="jobResultSection" v-if="jobData" class="border-neutral-300" />
      <div v-if="jobData" class="space-y-4">
        <h2 class="text-xl leading-tight">
          <span class="block md:inline font-bold">{{ file.name }}</span> {{ $t('ANALYSIS') }} <span class="block md:inline font-bold">{{ jobStatus }}</span>
        </h2>
      </div>
      <div v-if="jobData" class="space-y-4">
        <p class="text-xl leading-tight">
          {{ $t('ELAPSED_TIME') }}: {{ elapsedTime }}
          <span class="relative inline-flex size-3 ml-3">
            <span v-if="!result && !error" class="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-500 opacity-75"></span>
            <span class="relative inline-flex size-3 rounded-full" :class="error ? 'bg-red-700' : result ? 'bg-green-700' : 'bg-orange-500'"></span>
          </span>
        </p>
      </div>

      <hr v-if="result" class="border-neutral-300" />
      <div v-if="result && !error" class="space-y-4">
        <p class="block p-8 bg-slate-900 border border-slate-900 text-white rounded-lg text-lg whitespace-pre-line">{{ result.output }}</p>
      </div>
      <div v-if="result && !error" class="space-y-2 text-center sm:text-left">
        <div v-if="result.artifacts && result.artifacts.length > 0" class="space-y-2">
          <template v-for="artifact in result.artifacts" :key="artifact.url">
            <a v-if="artifact.url?.startsWith('http')" :href="artifact.url" class="w-full sm:w-auto px-8 py-2 sm:py-4 button" target="_blank">
              <Icon name="ph:download-bold" class="mr-3 -translate-y-px text-xl" />
              <span class="inline-block py-2">{{ artifact.name }}</span>
            </a>
            <a v-else @click="forceDownload(artifactLink(artifact.url), artifact.name)" class="w-full sm:w-auto px-8 py-2 sm:py-4 button">
              <Icon name="ph:download-bold" class="mr-3 -translate-y-px text-xl" />
              <span class="inline-block py-2">{{ artifact.name }}</span>
            </a>
          </template>
        </div>
        <button v-else class="w-full sm:w-auto px-8 py-2 sm:py-4 button" @click="downloadPdf">{{ $t('DOWNLOAD_ANALYSIS') }}</button>
      </div>
      <div v-if="error" class="space-y-4">
        <p class="block p-8 bg-red-900 border border-red-900 text-white rounded-lg text-lg whitespace-pre-line">{{ error }}</p>
      </div>
    </div>
  </main>
</template>

<script lang="ts" setup>
import { useStatesStore } from '~~/store/states';

const INTERVAL = 15000; // 15 seconds in ms

const result = ref<any | null>(null);
const file = ref<any>(null);
const isBusy = ref(false);
const jobId = ref<string | null>(null);
const jobData = ref<{ completed: boolean; locked_until: Date; created: Date; result: string } | null>(null);
const jobName = ref('');
const jobResultSection = ref();
let pollingId: any = null;
const error = ref('');
const isDemo = ref(false);
const jobsLeft = ref('');
const menuItem = ref();
const store = useStatesStore();
const fileDrop = ref();
const timerElapsed = ref(0);
let timer: any;

const { $createPdf } = useNuxtApp();
const { t } = useI18n();

onBeforeRouteLeave(() => {
  stopPolling();
});

onBeforeMount(() => {
  const link = useRoute().path;
  store.userAccess(link);
  menuItem.value = store.getMenuItem(link);
  const config = useRuntimeConfig();
  useHead({ title: `${menuItem.value?.title} | ${config.public.appName}` });
  jobName.value = menuItem.value?.title?.toLowerCase()?.replace(' ', '-') || 'analysis';
  const info = store.getJobInfo(jobName.value);
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
  return menuItem.value?.params?.accept || '';
});

const elapsedTime = computed(() => {
  const seconds = Math.round((timerElapsed.value / 1000) % 60);
  if (Math.round(timerElapsed.value / 1000) < 60) {
    return `${seconds} sec`;
  }
  const minutes = Math.round(timerElapsed.value / 60000);
  return `${minutes} min ${seconds} sec`;
});

watch(jobStatus, async () => {
  await nextTick();
  if (jobStatus.value === 'completed' && jobResultSection.value) {
    clearInterval(timer);
    const y = jobResultSection.value.getBoundingClientRect().top - 96;
    window.scrollTo({ top: y, behavior: 'smooth' });
  }
});

const reset = () => {
  result.value = null;
  file.value = null;
  error.value = '';
  isBusy.value = false;
  jobData.value = null;
  clearJob();
  stopPolling();
  fileDrop.value?.reset();
};

const clearJob = () => {
  jobId.value = null;
  useStatesStore().setJobInfo(jobName.value, null);
  stopPolling();
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
  const query = `service=${menuItem.value?.params?.service || ''}&user_id=${userId}`;
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
  result.value = null;
  isBusy.value = true;
  error.value = '';
  jobId.value = null;
  jobData.value = null;
  const formData = new FormData();
  const payload = menuItem.value?.params?.payload || {};
  payload['file_name'] = file.value?.name;
  if (isDemo.value) {
    payload['user_id'] = store.user?.id;
  }
  formData.append('service', menuItem.value?.params?.service || '');
  formData.append('payload', JSON.stringify(payload));
  formData.append('file', file.value);
  try {
    const data = await $fetch('/api/brevia/upload_analyze', {
      method: 'POST',
      body: formData,
    });

    if (data.error) {
      isBusy.value = false;
      error.value = `There has been an error\n${data.error}`;
      console.log(data.error);
    } else {
      jobId.value = data.job?.trim() || '';
      store.setJobInfo(jobName.value, { id: jobId.value, file: { name: file.value?.name } });
      startPolling();
      timer = setInterval(() => (timerElapsed.value += 1000), 1000);
    }
  } catch (err) {
    error.value = t('AN_ERROR_OCCURRED_PLEASE_RETRY');
    console.log(err);
  }
};

const downloadPdf = () => {
  const doc = $createPdf(result.value?.output || '');
  const date = new Date().toISOString().split('T')[0];
  const pdfTitle = `Analysis-${file.value?.name}-${date}.pdf`;
  doc.save(pdfTitle);
};

const readJobData = async () => {
  if (!jobId.value) {
    return;
  }
  try {
    const data = await $fetch(`/api/brevia/jobs/${jobId.value}`);
    const err = data?.error || data.result?.error || null;
    jobData.value = data;
    if (err) {
      error.value = `There has been an error\n${err}`;
      console.error(err);
      jobTerminated();
    } else {
      if (jobData.value?.completed) {
        jobTerminated();
      }
    }
  } catch (err) {
    error.value = t('AN_ERROR_OCCURRED_PLEASE_RETRY');
    console.error(err);
  }
};

const jobTerminated = () => {
  isBusy.value = false;
  result.value = jobData.value?.result;
  clearJob();
  updateJobsLeft();
};

const artifactLink = (artifact_url: string) => {
  if (artifact_url.startsWith('/download')) {
    return `/api/brevia${artifact_url}`;
  }

  return artifact_url;
};

const forceDownload = async (artifact_url: string, filename: string) => {
  try {
    const response = await fetch(`/api/brevia${artifact_url}`);
    if (!response.ok) {
      throw new Error('Failed to fetch the file');
    }
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  } catch (err) {
    console.error('Error downloading the file:', err);
    error.value = t('AN_ERROR_OCCURRED_PLEASE_RETRY');
  }
};
</script>
