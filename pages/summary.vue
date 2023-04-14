<template>
    <div class="rounded space-y-3">
        <h2 class="text-2xl font-bold">Document summary</h2>
        <div class="space-y-6 sm:space-y-8">
            <p>
                Upload a PDF document, even one with many pages, to get a textual summary, a list summary or a potential categorization.
            </p>

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
                <button class="mt-4 sm:ml-6 sm:mt-0 px-8 py-2 sm:py-4 bg-red-900 hover:bg-red-700 button"
                    :disabled="!file || isBusy" @click="reset" v-if="summary">Reset</button>
            </div>

            <hr class="border-neutral-300" v-if="summary">
            <div class="space-y-4" v-if="summary">
                <h2 class="text-xl leading-tight">Result for document<span class="block md:inline font-bold">{{ file.name }}</span></h2>
                <p class="block p-8 bg-slate-900 border border-slate-900 text-white rounded-lg text-lg whitespace-pre-line">{{ summary }}</p>
            </div>
        </div>

        <ClientOnly>
            <head> <title>Document summary</title> </head>
        </ClientOnly>
    </div>
</template>

<script>
export default {
    data() {
        return {
            summaryType: 'summarize',
            file: null,
            isBusy: false,
            summary: null,
        }
    },

    computed: {
        apiUrl() {
            const apiUrl = this.$config.public?.apiUrl?.trim();
            if (!apiUrl) {
                console.error('API url not set via `API_BASE_URL` env var');
            }
            return apiUrl;
        }
    },

    methods: {
        reset() {
            this.file = null;
            this.summary = null;
            this.isBusy = false;
            this.$refs.fileDrop.reset();
        },

        async submit() {
            this.isBusy = true;
            this.summary = null;
            let formData = new FormData();
            formData.append('num_items', 5);
            formData.append('summ_prompt', this.summaryType);
            formData.append('file', this.file);
            const uploadUrl = this.apiUrl + '/upload_summarize';
            try {
                // 'multipart/form-data' Content-type header
                // intentionally not set to avoid boundary error
                // https://stackoverflow.com/questions/39280438/fetch-missing-boundary-in-multipart-form-data-post/39281156#39281156
                const response = await fetch(uploadUrl, {
                    method: 'POST',
                    body: formData,
                });

                if (response.ok) {
                    const data = await response.json();
                    this.summary = data.summary.trim();
                } else {
                    const err = await response.text();
                    console.log(err);
                }
            } catch (error) {
                console.log(error);
            }
            this.isBusy = false;
        },
    }
}
</script>
