<template>
  <div class="space-y-4 leading-tight">
    <h3 class="flex justify-between items-center mb-4 pb-4 rounded-t border-b sm:mb-5">
      <Icon
        :name="feedback.evaluation ? 'ph:thumbs-up-fill' : 'ph:thumbs-down-fill'"
        :class="feedback.evaluation ? 'bg-green-600' : 'bg-red-600'"
        class="rounded-full p-2 text-white text-4xl"
      />
      <p class="text-lg font-bold">{{ $t('FEEDBACK') }}</p>
      <Icon class="text-2xl hover:cursor-pointer hover:bg-sky-100" name="ph:x-bold" @click="$closeModal()" />
    </h3>
    <label for="textareaFeedback" class="text-sm">{{ $t('INSERT_FEEDBACK') }}</label>
    <textarea
      id="textareaFeedback"
      v-model="feedBackMsg"
      rows="4"
      class="block p-2.5 mb-4 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
      :placeholder="$t('FEEDBACK_PLACEHOLDER')"
    ></textarea>

    <label v-if="!feedback.evaluation" for="textareaSuggestion" class="text-sm">{{ $t('SUGGEST_RESPONSE') }}</label>
    <textarea
      v-if="!feedback.evaluation"
      id="textareaSuggestion"
      v-model="suggestionMsg"
      rows="4"
      class="block p-2.5 mb-4 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
      placeholder="Proponi la risposta corretta"
    ></textarea>
    <button
      class="text-white inline-flex items-center bg-primary hover:bg-secondary focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
      @click="sendFeedback"
    >
      Invia
    </button>
  </div>
</template>

<script setup lang="ts">
const stateStore = useStatesStore();
const { $closeModal } = useNuxtApp();
const props = defineProps<{
  feedback?: any;
}>();

const emit = defineEmits(['stopClick']);

const feedBackMsg = ref('');
const suggestionMsg = ref('');

onMounted(() => {
  console.log(props.feedback);
  console.log('Emitted');
  emit('stopClick');
});

const getFeedbackMessage = () => {
  let completeFeedback = feedBackMsg.value;
  if (suggestionMsg.value.length > 0) {
    completeFeedback += '\n\n--- RISPOSTA CORRETTA PROPOSTA ----\n\n';
    completeFeedback += suggestionMsg.value;
  }
  return completeFeedback;
};

const getUser = () => {
  const user = {
    username: stateStore.user?.username,
    name: stateStore.user?.name,
    surname: stateStore.user?.surname,
  };
  return user;
};

const sendFeedback = async () => {
  try {
    await fetch('/api/brevia/evaluate', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        'X-Chat-Session': props.feedback.session,
      },
      body: JSON.stringify({
        uuid: props.feedback.uuid,
        user_evaluation: props.feedback.evaluation,
        user_feedback: getFeedbackMessage(),
        metadata: { user: getUser() },
      }),
    });
    $closeModal();
  } catch (err) {
    console.log(err);
  }
};
</script>
