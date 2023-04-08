<template>
    <div class="rounded space-y-3">
        <ClientOnly>
            <head> <title>About Chatlas</title> </head>
        </ClientOnly>

        <h2 class="text-2xl font-bold">Document summary</h2>
        <div class="space-y-8">
            <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Aspernatur provident, laudantium eligendi deserunt modi pariatur ab odio iste accusantium beatae reprehenderit dolorem cumque consequuntur voluptate nihil repellendus accusamus quod expedita?
            </p>

            <div class="grid sm:grid-cols-3 gap-6 sm:gap-8">
                <div class="sm:col-span-2">
                    <DropZone @file-change="file = $event" :disabled="isBusy" />
                </div>

                <div class="sm:self-center justify-self-center sm:justify-self-start flex flex-col space-y-1 text-lg">
                    <label class="space-x-2 cursor-pointer">
                        <input type="radio" :value="'summarize'" v-model="summaryType">
                        <span :class="{ 'font-bold': summaryType === 'summarize' }">Text summary</span>
                    </label>
                    <label class="space-x-2 cursor-pointer">
                        <input type="radio" :value="'summarize_point'" v-model="summaryType">
                        <span :class="{ 'font-bold': summaryType === 'summarize_point' }">Bullet list summary</span>
                    </label>
                    <label class="space-x-2 cursor-pointer">
                        <input type="radio" :value="'classificate'" v-model="summaryType">
                        <span :class="{ 'font-bold': summaryType === 'classificate' }">Categorize content</span>
                    </label>
                </div>
            </div>

            <div class="text-center sm:text-left">
                <button class="w-full sm:w-auto px-8 py-2 sm:py-4 button" :disabled="!file || isBusy" @click="submit">Upload and analyze file</button>
            </div>

            <div class="text-center sm:text-left" v-if="summary">
                <p style="white-space: pre-line"
                    class="block p-8 bg-slate-700 border border-slate-900 text-white rounded-lg text-lg">{{ summary }}</p>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            apiUrl: '',
            summaryType: 'summarize',
            file: null,
            isBusy: false,
            summary: null,
        }
    },

    created() {
        const config = useRuntimeConfig();
        this.apiUrl = config.public.apiUrl;
    },

    methods: {
        async submit() {
            this.isBusy = true;
            this.summary = null;
            let formData = new FormData();
            formData.append('num_items', 4);
            formData.append('summ_prompt', this.summaryType);
            formData.append('file', this.file);
            const uploadUrl = this.apiUrl + '/upload_summarize';
            try {
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
