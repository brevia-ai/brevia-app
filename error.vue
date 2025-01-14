<template>
  <div class="flex flex-col h-[100dvh] justify-center">
    <div class="mx-auto space-y-2 place-items-center">
      <img alt="error-image" src="./public/brevia-logo-shatter.png" class="h-36" />
      <div class="text-7xl md:text-9xl font-bold">OPS! {{ error.statusCode}}</div>
      <div>{{ getErrorMessage() }}</div>


    </div>
    <NuxtLink v-if="!error.data?.noBackHome" to="/" class="button mx-auto mt-8">
        Torna alla home
      </NuxtLink>
  </div>
</template>

<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps({
  error: Object as () => NuxtError
})

const getErrorMessage = () => {
  switch (props.error.statusCode) {
    case 401:
      return "Non si dispone delle autorizzazioni necessarie per visitare questa pagina";
    case 403:
      return "Non si dispone delle autorizzazioni necessarie per visitare questa pagina";
    case 404:
      return "Pagina non trovata!";
    case 500:
      return "Errore server, contattare il supporto";
  }
}

</script>
