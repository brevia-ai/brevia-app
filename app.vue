<template>
  <ClientOnly>
    <NuxtLayout>
      <UIXProgressLinear v-if="modalStore.isLoadingPage" class="z-10 absolute top-24 w-full" />
    </NuxtLayout>

    <AppModal v-if="$isActiveModal()" />
  </ClientOnly>
</template>

<script setup lang="ts">
import { useModalStore } from '~~/store/modal';
const { $isActiveModal } = useNuxtApp();
const { locale, t } = useI18n();

const modalStore = useModalStore();
modalStore.$onAction(
  ({
    // name, // name of the action
    store, // store instance, same as `someStore`
    // args, // array of parameters passed to the action
    after, // hook after the action returns or resolves
    // onError, // hook if the action throws or rejects
  }) => {
    after(() => {
      if (store.activeModal) {
        document.body.classList.add('overflow-hidden');
      } else {
        document.body.classList.remove('overflow-hidden');
      }
    });
  },
);

const config = useRuntimeConfig();

useHead({
  title: config.public.appName,
  meta: [
    {
      name: 'description',
      content: config.public.appDescription || t('TITLES.ATLAS_AI_POWERED_TOOLS'),
    },
  ],
  htmlAttrs: {
    lang: locale.value,
  },
});

onMounted(() => {
  if (!config.public.cookiesPrivacyTerms) {
    return;
  }
  useHead({
    script: [
      {
        src: 'https://cdn.iubenda.com/iubenda.js',
        defer: true,
      },
    ],
  });
});
</script>
