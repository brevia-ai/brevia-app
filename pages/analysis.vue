<template>
    <div class="rounded space-y-3">
        <h2 class="text-2xl font-bold">{{ menuItem?.title }}</h2>
        <div class="space-y-6 sm:space-y-8">
            <div v-html="menuItem?.description"></div>

            <div class="grid sm:grid-cols-3 gap-4 sm:gap-8">
                <div class="sm:col-span-2">
                    <DropZone @file-change="file = $event" :disabled="isBusy" ref="fileDrop"/>
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
                <h2 class="text-xl leading-tight"><span class="block md:inline font-bold">{{ file.name }}</span> analysis <span class="block md:inline font-bold">{{ jobStatus }}</span></h2>
            </div>

            <hr class="border-neutral-300" v-if="result">
            <div class="space-y-4" v-if="result">
                <p class="block p-8 bg-slate-900 border border-slate-900 text-white rounded-lg text-lg whitespace-pre-line">{{ result.output }}</p>
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
            file: null,
            isBusy: false,
            result: null,
            jobId: null,
            jobData: null,
            jobName: null,
            pollingId: null,
            error: null,
            menuItem: {},
        }
    },

    created() {
        const store = useStatesStore();
        const link = this.$route.path;
        store.userAccess(link);
        this.menuItem = store.getMenuItem(link);
        useHead({ title: `${this.menuItem?.title} | Chatlas`});
        this.jobName = this.menuItem?.title?.toLowerCase()?.replace(' ', '-') || 'analysis';
        const info = store.getJobInfo(this.jobName);
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
            this.result = null;
            this.error = null;
            this.isBusy = false;
            this.clearJob();
            this.jobData = null;
            this.$refs.fileDrop.reset();
        },

        clearJob() {
            this.jobId = null;
            useStatesStore().setJobInfo(this.jobName, null);
            this.stopPolling();
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
            this.result = null;
            this.error = null;
            this.jobId = null;
            this.jobData = null;
            let formData = new FormData();
            formData.append('service', this.menuItem?.params?.service || '');
            formData.append('payload', JSON.stringify(this.menuItem?.params?.payload || ''));
            formData.append('file', this.file);
            try {
                const data = await $fetch('/api/upload_analyze', {
                    method: 'POST',
                    body: formData,
                });

                if (data.error) {
                    this.isBusy = false;
                    this.error = `There has been an error\n${data.error}`;
                    console.log(data.error);
                } else {
                    this.jobId = data.job?.trim() || '';
                    useStatesStore().setJobInfo(this.jobName, {id: this.jobId, file: {name: this.file?.name}});
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
                    this.clearJob();
                } else {
                    this.jobData = data;
                    if (this.jobData?.completed) {
                        this.isBusy = false;
                        this.result = this.jobData?.result;
                        this.clearJob();
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
