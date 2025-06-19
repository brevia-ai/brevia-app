<template>
  <main>
    <div class="space-y-12">
      <div class="flex justify-between items-start space-x-4">
        <div class="space-y-4">
          <h2 class="text-2xl md:text-3xl leading-tight font-bold">{{ $t('CONVERSATION.TITLE') }}</h2>
          <div class="text-neutral-600">
            <p class="text-lg">{{ $t('CONVERSATION.DESCRIPTION') }}</p>
            <ul class="list-disc ml-8">
              <li>
                <i18n-t keypath="CONVERSATION.CUSTOMIZE_INFO">
                  <template #customizeModel>
                    <button class="italic cursor-pointer hover:underline hover:text-black" @click="scrollToConfig()">
                      {{ $t('CONVERSATION.CUSTOMIZE_MODEL') }}
                    </button>
                  </template>
                </i18n-t>
              </li>
              <li>
                <i18n-t keypath="CONVERSATION.DEFAULT">
                  <template #settings>
                    <NuxtLink to="/general-config" class="italic cursor-pointer hover:underline hover:text-black">{{ $t('SETTINGS') }}</NuxtLink>
                  </template>
                </i18n-t>
              </li>
            </ul>
          </div>
        </div>
        <div class="flex justify-between space-x-4">
          <div class="mt-0.5 text-sky-700 hover:text-sky-500 hover:cursor-pointer">
            <Icon name="ph:arrow-clockwise-bold" class="text-4xl" @click="chatZone.refreshChat()" />
          </div>
        </div>
      </div>
      <div>
        <h2 ref="customizeOpts" class="relative text-lg md:text-xl leading-tight font-bold mb-6 border-b-2" @click="showHideConfig()">
          {{ $t('CONVERSATION.CUSTOMIZE_MODEL') }}
          <button class="absolute right-0">
            <Icon :name="configVisible ? 'ph:caret-up' : 'ph:caret-down'" />
          </button>
        </h2>
        <Transition name="section-fade">
          <div v-if="configVisible" class="space-y-6">
            <ConfigLlm v-model="qaCompletionLLM" title="" />
            <label class="p-1.5 flex items-center gap-2">
              <input type="checkbox" id="advanced" name="advanced" @click="moreConfig = !moreConfig" />
              <span class="font-normal leading-tight">{{ $t('CONVERSATION.ADVANCED_CONFIG') }}</span>
            </label>
            <Transition name="section-fade">
              <div v-if="moreConfig">
                <ConfigLlm v-model="qaFollowupLLM" title="Followup LLM" />
              </div>
            </Transition>
          </div>
        </Transition>
      </div>
      <ChatZone
        ref="chatZone"
        :is-full-page="false"
        :max-messages="maxChatMessages"
        :config="getConfig()"
        bot-name="test-chat"
        @update-left="updateLeftMessages"
        @feedback="(feed) => handleFeedback(feed)"
      >
        <template #messageCounter>
          <div v-if="isDemo" class="flex space-x-4">
            <span class="grow text-lg">{{ $t('MESSAGES_LEFT') }}: {{ messagesLeft }}</span>
          </div>

          <div v-if="isDemo && messagesLeft == 0" class="space-x-4">
            <div class="w-full bg-red-100 border border-red-400 rounded text-center">
              {{ $t('NO_MORE_CHAT_MESSAGES') }}
            </div>
          </div>
        </template>
      </ChatZone>
    </div>
  </main>
</template>

<script lang="ts" setup>
const config = useRuntimeConfig();
const store = useStatesStore();
const modalStore = useModalStore();
useHead({ title: `Chatbot | ${config.public.appName}` });

const chatZone = ref();
const customizeOpts = ref();
const isBusy = ref(false);
const input = ref<HTMLElement | null>(null);
const isDemo = ref(store.userHasRole('demo'));
const maxChatMessages = isDemo.value ? parseInt(config.public.demo.maxChatMessages) : 0;
const messagesLeft = ref(maxChatMessages);

const configVisible = ref(false);
const moreConfig = ref(false);
const breviaConfig: any = await $fetch('/api/brevia/config');
const qaFollowupLLM = ref(breviaConfig.qa_followup_llm);
const qaCompletionLLM = ref(breviaConfig.qa_completion_llm);

onBeforeMount(async () => {
  await initProviders();
});

watch(isBusy, (val) => {
  if (!val) {
    setTimeout(() => {
      input.value?.focus();
    }, 100);
  }
});

const showHideConfig = () => (configVisible.value = !configVisible.value);

const scrollToConfig = () => {
  if (!configVisible.value) showHideConfig();
  setTimeout(() => customizeOpts.value.scrollIntoView({ behavior: 'smooth' }), 100);
};

const updateLeftMessages = (left: number) => (messagesLeft.value = left);

const handleFeedback = (feed: any) => {
  modalStore.openModal('GiveFeedback', { feedback: feed });
  modalStore.$onAction(({ after, onError }) => {
    after((result) => {
      if (result === 'refreshFeedback') {
        chatZone.value.updateFeedbackThumbs();
      }
    });
    onError((error) => {
      console.log(error);
    });
  }, false);
};

const getConfig = () => {
  // Serve fare check sul tipo perchè il componente salva object in string al cambiamento
  return {
    qa_completion_llm: typeof qaCompletionLLM.value === 'object' ? qaCompletionLLM.value : JSON.parse(qaCompletionLLM.value),
    qa_followup_llm: typeof qaFollowupLLM.value === 'object' ? qaFollowupLLM.value : JSON.parse(qaFollowupLLM.value),
  };
};
</script>

<style>
/* Entrata */
.section-fade-enter-active {
  transition: opacity 0.5s ease;
}
.section-fade-enter-from {
  opacity: 0;
}
.section-fade-enter-to {
  opacity: 1;
}
/* Uscita */
.section-fade-leave-active {
  transition: opacity 0.1s ease;
}
.section-fade-leave-from {
  opacity: 1;
}
.section-fade-leave-to {
  opacity: 0;
}
</style>
