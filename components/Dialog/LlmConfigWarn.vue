<template>
  <div class="space-y-4 leading-tight">
    <div class="text-center">
      <p class="text-lg font-bold">{{ $t('LLM_CONF_UNSUPPORTED') }}</p>
      <p class="text-sm">{{ $t('LLM_CONF_UNSUPPORTED_DESCRIPTION') }}</p>
    </div>
    <div class="w-full flex items-center justify-center">
      <button class="mx-auto button button-primary uppercase" @click="$closeModal()">{{ $t('CLOSE') }}</button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineEmits(['setResult']);
</script>
