<template>
  <label
    class="p-8 min-h-[5rem] flex items-center justify-center bg-slate-700 border border-slate-900 text-white rounded-lg text-lg text-center select-none cursor-pointer hover:bg-sky-800 hover:border-sky-800 focus-within:outline-double focus-within:outline-4 focus-within:outline-sky-800"
    :class="{
      '!bg-sky-800 !border-sky-800': isDragging,
      '!bg-neutral-500 !border-neutral-500 !text-neutral-300 !cursor-not-allowed pointer-events-none': disabled,
      '!bg-slate-800': file && !disabled && !isDragging,
      '!bg-red-900': isFileError,
    }"
    @dragover="onDragOver"
    @dragleave="onDragLeave"
    @drop="onDrop"
  >
    <div v-if="file && !disabled" class="max-w-full text-sm font-mono text-green-300 overflow-hidden text-ellipsis">{{ file.name }}</div>
    <div v-else-if="file && disabled" class="max-w-full text-sm font-mono text-neutral-300 overflow-hidden text-ellipsis flex flex-col items-center gap-4">
      <ElementLoader height="64" width="64" />
      <p class="animate-pulse">{{ $t('WAIT_PROCESSING') }}</p>
    </div>
    <div v-else-if="isFileError">{{ fileErrorMessage }}</div>
    <div v-else-if="isDragging">{{ $t('DROP_FILE') }}</div>
    <div v-else>{{ $t('PLEASE_DROP_A_FILE') }}</div>

    <input
      id="fileInput"
      ref="fileInput"
      type="file"
      name="file"
      class="opacity-0 w-px h-px absolute overflow-hidden"
      :accept="acceptTypes"
      :disabled="disabled"
      @change="onChangeFile"
    />
  </label>
</template>

<script setup lang="ts">
const { $fileTypeAccepted, $fileSizeAccepted } = useNuxtApp();
const { t } = useI18n();

const props = defineProps({
  disabled: {
    type: Boolean,
    default: false,
  },
  acceptTypes: {
    // comma separated lists of accepted mime types, e.g. 'application/pdf,text/plain'
    // if empty, all types are accepted
    type: String,
    default: '',
  },
});

const emits = defineEmits(['fileChange']);
const isDragging = ref(false);
const isFileError = ref(false);
const file = ref<File | null>(null);
const fileErrorMessage = ref('');
const fileInput = ref();

const reset = () => {
  isDragging.value = false;
  file.value = null;
  fileInput.value = '';
};

const onChangeFile = () => {
  const f = [...fileInput.value.files][0] || null;
  if (!checkFile(f)) {
    return;
  }
  file.value = f;
  emits('fileChange', file.value);
};

const onDragOver = (e: DragEvent) => {
  e.preventDefault();
  isDragging.value = true;
};

const onDragLeave = () => {
  isDragging.value = false;
};

const onDrop = (e: DragEvent) => {
  e.preventDefault();
  const f = [...(e.dataTransfer?.files as any)][0] || null;
  if (!checkFile(f)) {
    return;
  }

  file.value = f;
  emits('fileChange', f);
  isDragging.value = false;
};

const checkFile = (f: File) => {
  const typeOk = $fileTypeAccepted(f, props.acceptTypes);
  const sizeOk = $fileSizeAccepted(f);
  if (typeOk && sizeOk) {
    return true;
  }
  file.value = null;
  isDragging.value = false;
  fileErrorMessage.value = !typeOk ? t('FILE_TYPE_NOT_ACCEPTED') : t('FILE_SIZE_ERROR');
  isFileError.value = true;
  console.error(!typeOk ? `Wrong file type ${f.type}` : `File too big ${f.size}`);
  setTimeout(() => {
    isFileError.value = false;
  }, 4000);

  return false;
};

defineExpose({
  reset,
  onDrop,
  onDragLeave,
  onDragOver,
  isDragging,
});
</script>
