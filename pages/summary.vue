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
                    <DropZone @file-change="file = $event"/>
                </div>

                <div class="sm:self-center justify-self-center sm:justify-self-start flex flex-col space-y-1 text-lg">
                    <label class="space-x-2 cursor-pointer">
                        <input type="radio" :value="1" v-model="summaryType">
                        <span :class="{ 'font-bold': summaryType === 1 }">Text summary</span>
                    </label>
                    <label class="space-x-2 cursor-pointer">
                        <input type="radio" :value="2" v-model="summaryType">
                        <span :class="{ 'font-bold': summaryType === 2 }">Bullet list summary</span>
                    </label>
                    <label class="space-x-2 cursor-pointer">
                        <input type="radio" :value="3" v-model="summaryType">
                        <span :class="{ 'font-bold': summaryType === 3 }">Categorize content</span>
                    </label>
                </div>
            </div>

            <div class="text-center sm:text-left">
                <button class="w-full sm:w-auto px-8 py-2 sm:py-4 button" :disabled="!file">Upload and analyze file</button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            summaryType: 1,
            file: null,
        }
    },

    methods: {

    }
}
</script>
