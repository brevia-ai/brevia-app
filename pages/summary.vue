<template>
    <div class="space-y-6">
        <h2 class="text-2xl md:text-3xl lg:text-4xl leading-tight font-bold">{{ menuItem?.title }}</h2>
        <div class="space-y-6 md:space-y-8">
            <div v-html="menuItem?.description"></div>

            <div class="flex max-sm:flex-col gap-x-8 gap-y-6">
                <div class="sm:w-2/3">
                    <DropZone class="sm:h-72 sm:min-h-full" @file-change="file = $event"
                        :disabled="isBusy || jobsLeft == '0'" :accept-types="acceptTypes" ref="fileDrop"/>
                </div>

                <div class="flex flex-col justify-center gap-6" v-if="menuItem?.params?.payload?.prompts">
                    <div class="flex flex-col gap-2 max-sm:max-w-sm max-sm:mx-auto max-sm:px-4">
                        <div class="hidden sm:block">{{ $t('ANSWER_TYPE') }}</div>
                        <div class="flex flex-col space-y-1"
                            :class="{'text-neutral-400' : isBusy}">
                            <label class="flex items-center space-x-2 cursor-pointer">
                                <input type="radio" name="type" :value="'summarize'" v-model="summaryType" :disabled="isBusy">
                                <span class="whitespace-nowrap" :class="{ 'font-bold': summaryType === 'summarize' }">{{ $t('TEXT_SUMMARY') }}</span>
                            </label>
                            <label class="flex items-center space-x-2 cursor-pointer">
                                <input type="radio" name="type" :value="'summarize_point'" v-model="summaryType" :disabled="isBusy">
                                <span class="whitespace-nowrap" :class="{ 'font-bold': summaryType === 'summarize_point' }">{{ $t('BULLET_LIST_SUMMARY') }}</span>
                            </label>
                            <label class="flex items-center space-x-2 cursor-pointer">
                                <input type="radio" name="type" :value="'classificate'" v-model="summaryType" :disabled="isBusy">
                                <span class="whitespace-nowrap" :class="{ 'font-bold': summaryType === 'classificate' }">{{ $t('CATEGORIZE_CONTENT') }}</span>
                            </label>
                        </div>
                    </div>

                    <div class="flex flex-col gap-2 max-sm:max-w-sm max-sm:mx-auto max-sm:px-4">
                        <div class="hidden sm:block">{{ $t('ANSWER_IN') }}</div>
                        <div class="flex flex-col space-y-1"
                            :class="{'text-neutral-400' : isBusy}">
                            <label class="flex items-center space-x-2 cursor-pointer">
                                <input type="radio" name="language" :value="null" v-model="summaryLanguage" :disabled="isBusy">
                                <span class="whitespace-nowrap" :class="{ 'font-bold': !summaryLanguage }">{{ $t('DOCUMENT_LANGUAGE') }}</span>
                            </label>
                            <label class="flex items-center space-x-2 cursor-pointer">
                                <input type="radio" name="language" :value="'Italian'" v-model="summaryLanguage" :disabled="isBusy">
                                <span class="whitespace-nowrap" :class="{ 'font-bold': summaryLanguage === 'Italian' }">Italiano</span>
                            </label>
                            <label class="flex items-center space-x-2 cursor-pointer">
                                <input type="radio" name="language" :value="'English'" v-model="summaryLanguage" :disabled="isBusy">
                                <span class="whitespace-nowrap" :class="{ 'font-bold': summaryLanguage === 'English' }">English</span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            <div class="flex max-sm:flex-col gap-x-8 gap-y-4">
                <button class="button sm:w-2/3"
                    :class="{'is-loading' : isBusy}"
                    :disabled="!file || isBusy || jobsLeft == '0'"
                    @click="submit">{{ $t('UPLOAD_AND_ANALYZE_FILE') }}</button>

                <button class="bg-slate-500 button px-12"
                    :class="{'hover:bg-red-700' : !resetDisabled}"
                    :disabled="resetDisabled" @click="reset">{{ $t('RESET') }}</button>
            </div>
            <div class="space-y-4" v-if="isDemo">
                <span class="grow text-lg">{{ $t('JOBS_LEFT') }}: {{ jobsLeft }}</span>
            </div>

            <div class="space-x-4" v-if="isDemo && jobsLeft == '0'">
                <p class="block p-8 bg-red-100 border border-red-400 rounded-lg text-lg whitespace-pre-line">
                    {{ $t('NO_MORE_ANALYSIS_JOBS') }}
                </p>
            </div>

            <hr class="border-neutral-300" v-if="jobData">

            <div class="space-y-4" v-if="jobData">
                <h2 class="text-xl leading-tight text-center"><span class="block md:inline font-bold break-all">{{ file.name }}</span> {{ $t('SUMMARIZATION') }} <span class="block md:inline font-bold">{{ jobStatus }}</span></h2>
            </div>

            <div class="space-y-4" v-if="summary">
                <p class="block p-8 bg-slate-900 border border-slate-900 text-white rounded-lg text-lg whitespace-pre-line leading-relaxed">{{ summary }}</p>
            </div>

            <button class="block w-full sm:max-w-xs mx-auto button"
                v-if="summary"
                @click="downloadPdf">{{ $t('DOWNLOAD_SUMMARY') }}</button>

            <div class="space-y-4" v-if="error">
                <p class="block p-8 bg-red-900 border border-red-900 text-white rounded-lg text-lg whitespace-pre-line">{{ error }}</p>
            </div>
        </div>

    </div>
</template>

<script>
import { useStatesStore } from '~~/store/states';

const INTERVAL = 15000; // 15 seconds in ms

export default {
    data() {
        return {
            summaryType: 'summarize',
            summaryLanguage: null,
            file: null,
            isBusy: false,
            summary: null,
            jobId: null,
            jobData: null,
            pollingId: null,
            error: null,
            isDemo: false,
            jobsLeft: null,
            menuItem: {},
        }
    },

    created() {
        const store = useStatesStore();
        const link = '/summary';
        store.userAccess(link);
        this.menuItem = store.getMenuItem(link);
        const config = useRuntimeConfig();
        useHead({ title: `${this.menuItem?.title} | ${config.public.appName}`});
        const info = store.getJobInfo('summary');
        this.jobId = info?.id || null;
        this.file = info?.file || null;
        this.startPolling();
        this.isBusy = !!this.jobId;
        this.isDemo = store.userHasRole('demo');
        this.updateJobsLeft();
    },

    computed: {
        jobStatus() {
            if (this.jobData?.completed) {
                return 'completed';
            }
            if (this.jobData?.locked_until) {
                return 'in progress';
            }

            return 'idle';
        },

        resetDisabled() {
            return !this.file || (this.isBusy && !this.pollingId);
        },
        acceptTypes() {
            return this.menuItem?.params?.accept || 'application/pdf';
        },
    },

    methods: {
        reset() {
            this.file = null;
            this.summary = null;
            this.error = null;
            this.isBusy = false;
            this.jobId = null;
            this.jobData = null;
            useStatesStore().setJobInfo('summary', null);
            this.stopPolling();
            this.$refs.fileDrop.reset();
        },

        startPolling() {
            if (!this.jobId) {
                return;
            }
            // read first after 1 sec, then every 15 sec
            setTimeout(() => this.readJobData(), 1000);
            this.pollingId = setInterval(() => this.readJobData(), INTERVAL);
        },

        stopPolling() {
            if (this.pollingId) {
                clearInterval(this.pollingId);
            }
            this.pollingId = null;
        },

        async updateJobsLeft() {
            if (!this.isDemo) {
                return;
            }
            const userId = useStatesStore().user.id;
            const query = `service=brevia.services.SummarizeFileService&user_id=${userId}`
            try {
                const response = await fetch(`/api/brevia/service_usage?${query}`);
                const data = await response.json();
                const usage = data?.usage || 0;
                const left = Math.max(0, parseInt(useRuntimeConfig().public.demo.maxNumAnalysis) - parseInt(usage));
                this.jobsLeft = String(left);
            } catch (error) {
                console.log(error);
            }
        },

        async submit() {
            this.isBusy = true;
            this.summary = null;
            this.error = null;
            this.jobId = null;
            this.jobData = null;
            let formData = new FormData();
            formData.append('initial_prompt', this.summaryPrompt());
            if (this.isDemo) {
                formData.append('payload', `{"user_id": "${useStatesStore().user.id}"}`);
            }
            formData.append('file', this.file);
            try {
                // 'multipart/form-data' Content-type header
                // intentionally not set to avoid boundary error
                // https://stackoverflow.com/questions/39280438/fetch-missing-boundary-in-multipart-form-data-post/39281156#39281156
                const data = await $fetch('/api/brevia/upload_summarize', {
                    method: 'POST',
                    body: formData,
                });

                if (data.error) {
                    this.isBusy = false;
                    this.error = `There has been an error\n${data.error}`;
                    console.log(data.error);
                } else {
                    this.jobId = data.job?.trim() || '';
                    useStatesStore().setJobInfo('summary', {id: this.jobId, file: {name: this.file?.name}});
                    this.startPolling();
                }
            } catch (error) {
                this.error = error;
                console.log(error);
            }
        },

        summaryPrompt() {
            const prompts = this.menuItem?.params?.payload?.prompts || {};
            const summPrompt = prompts?.[this.summaryType] || null;
            if (summPrompt.template) {
                const lang = this.summaryLanguage || 'the same language of the text';
                summPrompt.template = summPrompt.template.replace('%lang%', lang);
            }

            return summPrompt ? JSON.stringify(summPrompt) : null;
        },

        downloadPdf() {
            const doc = this.$createPdf(this.summary || '');
            let date = new Date().toISOString().split('T')[0];
            const pdfTitle = `Summary-${this.file?.name}-${date}.pdf`;
            doc.save(pdfTitle);
        },

        async readJobData() {
            if (!this.jobId) {
                return;
            }
            try {
                const data = await $fetch(`/api/brevia/jobs/${this.jobId}`);
                const err = data?.error || data.result?.error || null;
                if (err) {
                    this.isBusy = false;
                    this.error = `There has been an error\n${err}`;
                    console.log(err);
                    this.stopPolling();
                } else {
                    this.jobData = data;
                    if (this.jobData?.completed) {
                        this.summary = data?.result?.output;
                        this.stopPolling();
                        useStatesStore().setJobInfo('summary', null);
                        this.jobId = null;
                        this.isBusy = false;
                        this.updateJobsLeft();
                    }
                }
            } catch (error) {
                this.error = error;
                console.log(error);
            }
        }
    }
}
</script>
