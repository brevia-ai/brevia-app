<template>
  <svg xmlns="http://www.w3.org/2000/svg" :width="loaderDim" :height="loaderDim" viewBox="0 0 24 24" class="animate-spin">
    <g fill="#0284c7">
      <path
        fill-rule="evenodd"
        d="M12 19a7 7 0 1 0 0-14a7 7 0 0 0 0 14m0 3c5.523 0 10-4.477 10-10S17.523 2 12 2S2 6.477 2 12s4.477 10 10 10"
        clip-rule="evenodd"
        opacity=".1"
      />
      <path fill="112233" d="M2 12C2 6.477 6.477 2 12 2v3a7 7 0 0 0-7 7z" />
    </g>
  </svg>
</template>

<script setup lang="ts">
defineProps({ loaderDim: { type: Number, default: 24 } });
</script>
