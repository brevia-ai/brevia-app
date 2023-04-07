<template>
    <label class="block p-8 bg-slate-700 border border-slate-900 hover:bg-slate-600 hover:border-slate-600 text-white rounded-lg text-lg cursor-pointer text-center"
        :class="{ '!bg-slate-600 !border-slate-600': isDragging }"
        @dragover="onDragOver"
        @dragleave="onDragLeave"
        @drop="onDrop">
            <div class="max-w-full overflow-hidden text-ellipsis" v-if="file">{{ file.name }}</div>
            <div v-else-if="isDragging">Drop file</div>
            <div v-else>Drop a PDF file here or click to open dialog</div>

            <input type="file" name="file" id="fileInput" ref="fileInput"
                class="opacity-0 w-px h-px absolute overflow-hidden"
                accept=".pdf"
                @change="onChangeFile" />
    </label>
</template>

<script>
export default {
    data() {
        return {
            isDragging: false,
            file: null,
        };
    },

    methods: {
        onChangeFile(e) {
            this.file = [...this.$refs.fileInput.files][0];
            this.$emit('fileChange', this.file);
        },
        onDragOver(e) {
            e.preventDefault();
            this.isDragging = true;
        },
        onDragLeave() {
            this.isDragging = false;
        },
        onDrop(e) {
            e.preventDefault();
            this.file = [...e.dataTransfer.files][0];
            this.$emit('fileChange', [...e.dataTransfer.files][0]);
            this.isDragging = false;
        },
    },
};
</script>
