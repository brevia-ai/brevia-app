<template>
  <div class="space-y-8 leading-tight">
    <div class="text-center space-y-4">
      <Icon name="ph:warning-circle-bold" class="text-6xl text-pink-700" />
      <p class="text-lg">{{ $t('ARE_YOU_SURE_YOU_WANT_TO_RESET_CONFIG') }}</p>
    </div>

    <div class="text-center space-y-4">
      <div class="space-y-2 text-sm">
        <p>{{ $t('THIS_ACTION_CANNOT_BE_UNDONE') }}. {{ $t('THE_MODIFIED_CONFIGURATION_WILL_BE_LOST') }}</p>
      </div>
    </div>

    <div class="flex justify-between space-x-4">
      <button class="button button-secondary uppercase" @click="$closeModal">{{ $t('CANCEL') }}</button>

      <button class="button button-danger uppercase" :class="{ 'is-loading': isLoading }" @click="resetConfig">{{ $t('RESET') }}</button>
    </div>

    <div v-if="error" class="p-3 bg-neutral-100 text-center font-semibold text-brand_primary">
      {{ $t('AN_ERROR_OCCURRED_PLEASE_RETRY') }}
    </div>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  settings: {
    type: Array,
    default: () => [],
  },
});
const { $closeModal } = useNuxtApp();

const error = ref(false);
const isLoading = ref(false);

const resetConfig = async () => {
  error.value = false;
  isLoading.value = true;
  try {
    await $fetch('/api/brevia/config/reset', { method: 'POST', body: props.settings });
  } catch (err) {
    error.value = true;
    console.error(err);
  }
  isLoading.value = false;

  $closeModal();
};
</script>
