<template>
  <label
    class="inline-flex button"
    :class="[
      {
        'disabled pointer-events-none': disabled,
        '!bg-slate-800': file && !disabled,
        'button-danger': isFileError,
        'is-loading after:!left-auto after:right-3': isLoading,
      },
      labelClasses,
    ]"
  >
    <div v-if="file" class="text-sm font-mono text-green-300 overflow-hidden text-ellipsis">{{ file.name }}</div>
    <div v-else>
      <span v-if="isFileError">{{ fileErrorMessage }}</span>
      <span v-else-if="isDragging">{{ $t('DROP_FILE') }}</span>
      <span v-else>{{ $t('PLEASE_DROP_A_FILE') }}</span>
    </div>
    <div v-if="icon && !isLoading">
      <Icon :name="icon" class="text-sky-600 text-2xl" />
    </div>

    <input
      ref="inputFile"
      type="file"
      name="file"
      class="opacity-0 w-px h-px absolute overflow-hidden"
      :accept="acceptTypes"
      :disabled="disabled"
      @change="onChangeFile"
    />
  </label>

  <Teleport to="body">
    <div v-if="isDragging" class="fixed inset-0 z-50 bg-sky-700 bg-opacity-80 flex flex-col items-center justify-center space-y-1">
      <span class="text-white text-5xl font-bold">{{ $t('DROP FILE') }}</span>
      <Icon name="ph:arrow-circle-down" class="text-white text-8xl" />
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
  // e.g. 'application/pdf,text/plain'
  // if empty, all types are accepted
  acceptTypes: {
    type: String,
    default: '',
  },
  labelClasses: {
    type: String,
    default: '',
  },
  icon: {
    type: String,
    default: 'ph:upload-simple-bold',
  },
});

const emit = defineEmits(['fileChange']);
const { $fileTypeAccepted, $fileSizeAccepted } = useNuxtApp();
const { t } = useI18n();

const inputFile = ref();
const lastTarget = ref(null);
const isDragging = ref(false);
const isFileError = ref(false);
const fileErrorMessage = ref('');
const file = ref<File | null>(null);

onMounted(() => {
  window.addEventListener('dragenter', onDragEnter);
  window.addEventListener('dragleave', onDragLeave);
  window.addEventListener('dragover', onDragOver);
  window.addEventListener('drop', onDrop);
});

onUnmounted(() => {
  window.removeEventListener('dragenter', onDragEnter);
  window.removeEventListener('dragleave', onDragLeave);
  window.removeEventListener('dragover', onDragOver);
  window.removeEventListener('drop', onDrop);
});

// methods
function onDragEnter(e: Event) {
  if (props.isLoading || props.disabled) return;

  lastTarget.value = e.target as any;
  isDragging.value = true;
}
function onDragLeave(e: Event) {
  if (props.isLoading || props.disabled) return;

  if (e.target === lastTarget.value) {
    isDragging.value = false;
  }
}
function onDragOver(e: Event) {
  e.preventDefault();
  if (props.isLoading || props.disabled) return;
}
function onDrop(e: DragEvent) {
  e.preventDefault();
  if (props.isLoading || props.disabled) return;

  isDragging.value = false;
  if (e.dataTransfer != undefined) {
    const files: File[] = Array.from(e.dataTransfer.files);
    if (!checkFile(files[0])) {
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

const checkFile = (newfile: File) => {
  const typeOk = $fileTypeAccepted(newfile, props.acceptTypes);
  const sizeOk = $fileSizeAccepted(newfile);
  if (typeOk && sizeOk) {
    return true;
  }
  file.value = null;
  fileErrorMessage.value = !typeOk ? t('FILE_TYPE_NOT_ACCEPTED') : t('FILE_SIZE_ERROR');
  isFileError.value = true;
  setTimeout(() => {
    isFileError.value = false;
  }, 4000);

  return false;
};
</script>
