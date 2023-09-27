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
            <div v-else-if="isFileError">{{ $t('PLEASE_DROP_A_FILE') }}</div>
            <div v-else-if="isDragging">{{ $t('DROP_FILE') }}</div>
            <div v-else>{{ $t('PLEASE_DROP_A_FILE') }}</div>

            <input type="file" name="file" id="fileInput" ref="fileInput"
                class="opacity-0 w-px h-px absolute overflow-hidden"
                :accept="acceptTypes"
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
        acceptTypes: {
            // comma separated lists of accepted mime types
            type: String,
            default: 'application/pdf',
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
            (this.$refs.fileInput as any).value = '';
        },
        onChangeFile() {
            this.file = [...(this.$refs.fileInput as any).files][0];
            this.$emit('fileChange', this.file);
        },
        onDragOver(e: DragEvent) {
            e.preventDefault();
            this.isDragging = true;
        },
        onDragLeave() {
            this.isDragging = false;
        },
        onDrop(e: DragEvent) {
            e.preventDefault();
            const file = [...(e.dataTransfer?.files as any)][0] || null;
            if (!this.isFileAccepted(file)) {
                this.file = null;
                this.isDragging = false;
                this.isFileError = true;
                setTimeout(() => { this.isFileError = false; }, 2000);
                return;
            }

            this.file = file;
            this.$emit('fileChange', [...(e.dataTransfer?.files as any)][0]);
            this.isDragging = false;
        },
        isFileAccepted(file: File) {
            if (!file || !file.type) {
                return false;
            }
            const acceptList = this.acceptTypes.split(',');

            const itemParts = file.type.split('/');
            const fileType = itemParts[0];
            const fileSubtype = itemParts?.[1];
            let found = false;
            acceptList.forEach((item) => {
                const parts = item.split('/');
                if (
                    parts[0] === fileType &&
                    (parts?.[1] === '*' || parts?.[1] === fileSubtype)
                ) {
                    found = true;
                }
            });

            return found;
        }
    },
};
</script>
