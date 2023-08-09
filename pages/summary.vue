<template>
    <div class="rounded space-y-3">
        <h2 class="text-2xl font-bold">{{ menuItem?.title }}</h2>
        <div class="space-y-6 sm:space-y-8">
            <div v-html="menuItem?.description"></div>

            <div class="grid sm:grid-cols-3 gap-4 sm:gap-8">
                <div class="sm:col-span-2">
                    <DropZone @file-change="file = $event" :disabled="isBusy" ref="fileDrop"/>
                </div>

                <div class="sm:self-center justify-self-center sm:justify-self-start flex flex-col space-y-1 text-lg"
                    :class="{'text-neutral-400' : isBusy}">
                    <label class="space-x-2 cursor-pointer">
                        <input type="radio" :value="'summarize'" v-model="summaryType" :disabled="isBusy">
                        <span :class="{ 'font-bold': summaryType === 'summarize' }">Text summary</span>
                    </label>
                    <label class="space-x-2 cursor-pointer">
                        <input type="radio" :value="'summarize_point'" v-model="summaryType" :disabled="isBusy">
                        <span :class="{ 'font-bold': summaryType === 'summarize_point' }">Bullet list summary</span>
                    </label>
                    <label class="space-x-2 cursor-pointer">
                        <input type="radio" :value="'classificate'" v-model="summaryType" :disabled="isBusy">
                        <span :class="{ 'font-bold': summaryType === 'classificate' }">Categorize content</span>
                    </label>
                </div>
            </div>

            <div class="text-center sm:text-left">
                <button class="w-full sm:w-auto px-8 py-2 sm:py-4 button"
                    :class="{'loading' : isBusy}"
                    :disabled="!file || isBusy" @click="submit">Upload and analyze file</button>
                <button class="mt-4 sm:ml-6 sm:mt-0 px-8 py-2 sm:py-4 bg-red-900 button"
                    :class="{'hover:bg-red-700' : !resetDisabled}"
                    :disabled="resetDisabled" @click="reset">Reset</button>
            </div>

            <hr class="border-neutral-300" v-if="jobData">
            <div class="space-y-4" v-if="jobData">
                <h2 class="text-xl leading-tight"><span class="block md:inline font-bold">{{ file.name }}</span> summarization <span class="block md:inline font-bold">{{ jobStatus }}</span></h2>
            </div>

            <hr class="border-neutral-300" v-if="summary">
            <div class="space-y-4" v-if="summary">
                <p class="block p-8 bg-slate-900 border border-slate-900 text-white rounded-lg text-lg whitespace-pre-line">{{ summary }}</p>
            </div>

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
            file: null,
            isBusy: false,
            summary: null,
            jobId: null,
            jobData: null,
            pollingId: null,
            error: null,
            menuItem: {},
        }
    },

    created() {
        const store = useStatesStore();
        const link = '/summary';
        store.userAccess(link);
        this.menuItem = store.getMenuItem(link);
        useHead({ title: `${this.menuItem?.title} | Chatlas`});
        const info = store.getJobInfo('summary');
        this.jobId = info?.id || null;
        this.file = info?.file || null;
        this.startPolling();
        this.isBusy = !!this.jobId;
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

        async submit() {
            this.isBusy = true;
            this.summary = null;
            this.jobId = null;
            this.jobData = null;
            let formData = new FormData();
            formData.append('num_items', 5);
            formData.append('summ_prompt', this.summaryType);
            formData.append('file', this.file);
            try {
                // 'multipart/form-data' Content-type header
                // intentionally not set to avoid boundary error
                // https://stackoverflow.com/questions/39280438/fetch-missing-boundary-in-multipart-form-data-post/39281156#39281156
                const data = await $fetch('/api/upload_summarize', {
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

        async readJobData() {
            if (!this.jobId) {
                return;
            }
            try {
                const data = await $fetch(`/api/jobs/${this.jobId}`);
                const err = data?.error || data.result?.error || null;
                if (err) {
                    this.isBusy = false;
                    this.error = `There has been an error\n${err}`;
                    console.log(err);
                    this.stopPolling();
                } else {
                    this.jobData = data;
                    if (data?.result?.summary) {
                        this.summary = data?.result?.summary;
                        this.stopPolling();
                        useStatesStore().setJobInfo('summary', null);
                        this.jobId = null;
                        this.isBusy = false;
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
