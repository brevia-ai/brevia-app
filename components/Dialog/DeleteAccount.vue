<template>
  <div class="space-y-8 leading-tight">
    <div class="text-center space-y-4">
      <Icon name="ph:warning-circle-bold" class="text-6xl text-pink-700" />
      <p class="text-lg">{{ $t('ARE_YOU_SURE_YOU_WANT_TO_DELETE_THIS') }} account?</p>
    </div>
    <div v-if="!deletionSuccess" class="text-center space-y-4">
      <div class="text-center space-y-4">
        <div class="space-y-2 text-sm">
          <p>{{ $t('THIS_ACTION_CANNOT_BE_UNDONE') }}. {{ $t('THE_FOLLOWING_WILL_ALSO_BE_ELIMINATED') }}</p>
          <div class="flex justify-center px-12">
            <ul class="list-square list-outside text-left">
              <li>{{ $t('ALL_RELATED_TO_THIS', { items: 'chatbot' }) }} account</li>
            </ul>
          </div>
        </div>
      </div>
      <form>
        <div>
          <label for="currentPwd" class="text-sm">
            <i18n-t keypath="CONFIRM_PWD_TO_DELETE" tag="p">
              <template #permanently>
                <b>{{ $t('PERMANENTLY') }}</b>
              </template>
            </i18n-t>
          </label>
          <input id="currentPwd" v-model="password" type="password" autocomplete="off" class="w-full" />
        </div>
      </form>
      <p v-if="deleteError" class="text-red-600 text-md">{{ $t('SOMETHING_WENT_WRONG') }}</p>
      <div class="flex justify-between space-x-4">
        <button class="button button-secondary uppercase" @click="$closeModal">{{ $t('CANCEL') }}</button>

        <button class="button button-danger uppercase" :disabled="!password" :class="{ 'is-loading': loading }" @click="deleteAccount">
          {{ $t('DELETE') }} account
        </button>
      </div>
    </div>
    <div v-else class="text-center space-y-4">
      <p>{{ $t('ACCOUNT_DELETED') }}.</p>
      <div class="flex justify-center mt-12 mb-4">
        <button class="button button-secondary uppercase" @click="exit">{{ $t('CLOSE') }}</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { $closeModal } = useNuxtApp();
const statesStore = useStatesStore();

const emit = defineEmits(['stopClick']);

const password = ref('');
const loading = ref(false);
const deletionSuccess = ref(false);
const deleteError = ref(false);
const integration = useIntegration();

onMounted(() => {
  emit('stopClick');
});

const deleteAccount = async () => {
  try {
    loading.value = true;
    deleteError.value = false;
    await $fetch(`/api/${integration}/optout`, {
      method: 'POST',
      body: {
        password: password.value,
      },
    });
    deletionSuccess.value = true;
  } catch (error) {
    deleteError.value = true;
    console.log(error);
  }
  loading.value = false;
};

async function exit() {
  $closeModal();
  await $fetch(`/api/${integration}/logout`, { method: 'POST' });
  statesStore.$reset();
  await navigateTo('/auth');
}
</script>
