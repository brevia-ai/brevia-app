<template>
<label class="inline-flex button"
    :class="[{
        'disabled pointer-events-none': disabled,
        '!bg-slate-800': file && !disabled,
        'button-danger': fileTypeError,
        'is-loading after:!left-auto after:right-3': isLoading,
    }, labelClasses]">

    <div class="text-sm font-mono text-green-300 overflow-hidden text-ellipsis" v-if="file">{{ file.name }}</div>
    <div v-else>
        <span v-if="fileTypeError">{{ $t('FILE_TYPE_NOT_ACCEPTED') }}</span>
        <span v-else-if="isDragging">{{ $t('DROP_FILE') }}</span>
        <span v-else>{{ $t('PLEASE_DROP_A_FILE') }}</span>
    </div>
    <div v-if="icon && !isLoading">
        <Icon :name="icon" class="text-sky-600 text-xl" />
    </div>

    <input type="file" name="file" ref="inputFile"
        class="opacity-0 w-px h-px absolute overflow-hidden"
        :accept="acceptTypes"
        :disabled="disabled"
        @change="onChangeFile" />
</label>

<Teleport to="body">
    <div class="fixed inset-0 z-50 bg-sky-700 bg-opacity-80 flex flex-col items-center justify-center" v-if="isDragging">
        <span class="text-white text-5xl font-bold">DROP FILE</span>
        <Icon name="carbon:arrow-shift-down" class="text-white text-8xl" />
    </div>
</Teleport>
</template>

<script lang="ts" setup>
const props = defineProps({
    disabled: {
        type: Boolean,
        required: false,
    },
    isLoading: {
        type: Boolean,
        required: false,
    },
    // comma separated lists of accepted mime types
    acceptTypes: {
        type: String,
        default: 'application/pdf',
    },
    labelClasses: {
        type: String,
        default: '',
    },
    icon: {
        type: String,
        default: 'carbon:upload',
    },
});

const emit = defineEmits(['fileChange']);

const inputFile = ref();
const lastTarget = ref(null);
const isDragging = ref(false);
const fileTypeError = ref(false);
const file = ref<File | null>(null);

onMounted(() => {
    window.addEventListener('dragenter', onDragEnter);
    window.addEventListener('dragleave', onDragLeave);
    window.addEventListener('dragover', onDragOver);
    window.addEventListener('drop', onDrop);
})

onUnmounted(() => {
    window.removeEventListener('dragenter', onDragEnter);
    window.removeEventListener('dragleave', onDragLeave);
    window.removeEventListener('dragover', onDragOver);
    window.removeEventListener('drop', onDrop);
})

// methods
function onDragEnter(e: Event) {
    if (props.isLoading || props.disabled)
        return;

    lastTarget.value = e.target as any;
    isDragging.value = true;
}
function onDragLeave(e: Event) {
    if (props.isLoading || props.disabled)
        return;

    if (e.target === lastTarget.value) {
        isDragging.value = false;
    }
}
function onDragOver(e: Event) {
    e.preventDefault();
    if (props.isLoading || props.disabled)
        return;
}
function onDrop(e: DragEvent) {
    e.preventDefault();
    if (props.isLoading || props.disabled)
        return;

    isDragging.value = false;
    if(e.dataTransfer != undefined) {
        const files: File[] = Array.from(e.dataTransfer.files);
        if (!isAccepted(files[0])) {
            fileTypeError.value = true;
            setTimeout(() => { fileTypeError.value = false; }, 5000);
            return;
        }

        file.value = files[0];
        emit('fileChange', file.value);
    }
}

const onChangeFile = (e: Event) => {
    const target = e.target as HTMLInputElement;
    const files = target.files as FileList;
    file.value = files[0];
    emit('fileChange', file.value);
};

const reset = () => {
    inputFile.value.value = null;
    file.value = null;
};
defineExpose({ reset });

const isAccepted = (file: File) => {
    if (!file)
        return;

    const acceptTypesArray = props.acceptTypes.toLowerCase().split(',').map(item => item.trim());
    const fileName = (file.name || '').toLowerCase();
    const mimeType = (file.type || '').toLowerCase();
    const baseMimeType = mimeType.replace(/\/.*$/, '');

    return acceptTypesArray.some((type: string) => {
        if (type.charAt(0) === '.') {
            return fileName.endsWith(type);
        } else if (type.endsWith('/*')) { // e.g. image/*
            return baseMimeType === type.replace(/\/.*$/, '');
        }

        return mimeType === type;
    });
}
</script>
