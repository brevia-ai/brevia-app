<template>
  <div class="space-y-8 leading-tight">
    <div class="text-center space-y-4">
      <p class="text-lg font-bold uppercase">{{ $t('CHANGE_PASSWORD') }}</p>
      <p>{{ $t('PASSWORD_ADVICE') }}</p>
    </div>
    <form v-if="!success" class="space-y-6">
      <div>
        <label for="currentPwd">{{ $t('CURRENT_PASSWORD') }}</label>
        <input id="currentPwd" v-model="oldPass" type="password" autocomplete="off" class="w-full" />
      </div>
      <p v-if="pwdError" class="text-red-600 text-sm">{{ $t('PASSWORD_ERROR') }}</p>
      <div class="pt-16">
        <label for="newPwd">{{ $t('NEW_PASSWORD') }}:</label>
        <input id="newPwd" v-model="newPass" type="password" autocomplete="off" class="w-full" />
      </div>
      <div>
        <label for="confirmPwd">{{ $t('CONFIRM_NEW_PASSWORD') }}:</label>
        <input id="confirmPwd" v-model="confirmPass" type="password" autocomplete="off" class="w-full border-red-300" />
      </div>
      <p v-if="newPass !== confirmPass" class="text-red-600 text-sm">{{ $t('PASSWORD_MISMATCH') }}</p>
      <div class="flex justify-between space-x-4">
        <button class="button button-secondary uppercase" @click="$closeModal">{{ $t('CANCEL') }}</button>

        <button class="button uppercase" :disabled="isButtonDisabled" :class="{ 'is-loading': loading }" @click.prevent="changePassword">
          {{ $t('CHANGE_PASSWORD') }}
        </button>
      </div>
      <p v-if="changeError" class="text-red-600 text-md">{{ $t('SOMETHING_WENT_WRONG') }}</p>
    </form>
    <div v-if="success">
      <img class="mx-auto" width="40" height="40" src="/check.png" />
      <h1 class="text-lg font-bold text-center uppercase">{{ $t('PASSWORD_MODIFIED') }}</h1>
      <div class="flex justify-center mt-12 mb-4">
        <button class="button button-secondary uppercase" @click="$closeModal">{{ $t('CLOSE') }}</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { type NuxtError } from 'nuxt/app';

const { $closeModal } = useNuxtApp();

const emit = defineEmits(['stopClick']);

const oldPass = ref('');
const newPass = ref('');
const confirmPass = ref('');
const changeError = ref(false);
const pwdError = ref(false);
const loading = ref(false);
const success = ref(false);

const isButtonDisabled = computed(() => {
  if (oldPass.value.length === 0 || newPass.value.length === 0 || confirmPass.value.length === 0) {
    return true;
  }

  return newPass.value !== confirmPass.value;
});

onMounted(() => {
  emit('stopClick');
});

const changePassword = async () => {
  try {
    const integration = useIntegration();
    pwdError.value = false;
    changeError.value = false;
    loading.value = true;
    await $fetch(`/api/${integration}/auth/user`, {
      method: 'PATCH',
      body: {
        password: newPass.value,
        old_password: oldPass.value,
      },
    });
    success.value = true;
  } catch (e: NuxtError | any) {
    success.value = false;
    if (['Wrong password', 'Missing current password'].includes(e?.data?.error?.title)) {
      pwdError.value = true;
    } else {
      changeError.value = true;
    }
  }
  loading.value = false;
};
</script>
