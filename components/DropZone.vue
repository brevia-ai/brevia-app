<template>
    <label class="flex items-center p-8 min-h-[6rem] justify-center bg-slate-700 border border-slate-900 hover:bg-sky-800 hover:border-sky-800 text-white rounded-lg text-lg text-center select-none cursor-pointer"
        :class="{
            '!bg-sky-800 !border-sky-800': isDragging,
            '!bg-neutral-500 !border-neutral-500 !text-neutral-300 !cursor-not-allowed pointer-events-none': disabled,
            '!bg-slate-800': file && !disabled && !isDragging,
            '!bg-red-900': isFileError,
        }"
        @dragover="onDragOver"
        @dragleave="onDragLeave"
        @drop="onDrop">
            <div class="max-w-full text-sm font-mono text-green-300 overflow-hidden text-ellipsis" v-if="file">{{ file.name }}</div>
            <div v-else-if="isFileError">Please drop a supported file type</div>
            <div v-else-if="isDragging">Drop file</div>
            <div v-else>Please drop a file</div>

            <input type="file" name="file" id="fileInput" ref="fileInput"
                class="opacity-0 w-px h-px absolute overflow-hidden"
                :accept="acceptType"
                :disabled="disabled"
                @change="onChangeFile" />
    </label>
</template>

<script lang="ts">

export default {
    props: {
        disabled: {
            type: Boolean,
            default: false,
        },
        acceptType: {
            type: String,
            default: '.pdf',
        },
    },
    data() {
        return {
            isDragging: false,
            isFileError: false,
            file: null,
        };
    },

    methods: {
        reset() {
            this.isDragging = false;
            this.file = null;
        },
        onChangeFile() {
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
            const file = [...e.dataTransfer.files][0] || null;
            if (!file || !file.type || file.type !== 'application/pdf') {
                this.isDragging = false;
                this.isFileError = true;
                setTimeout(() => { this.isFileError = false; }, 2000);
                return;
            }

            this.file = file;
            this.$emit('fileChange', [...e.dataTransfer.files][0]);
            this.isDragging = false;
        },
    },
};
</script>
