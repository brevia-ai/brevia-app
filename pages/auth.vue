<template>
  <main class="mt-16">
    <div v-if="!statesStore.isLogged()" class="mt-6 max-w-sm mx-auto space-y-8">
      <form class="flex flex-col space-y-8" @submit.stop.prevent>
        <UIXInput
          v-model="username"
          autocomplete="username"
          autocorrect="off"
          autocapitalize="none"
          :placeholder="$t('LOGIN_PLACEHOLDER')"
          required
          @keydown.enter.stop.prevent="signIn"
        />

        />

        <div class="flex flex-col space-y-3">
          <UIXInput
            v-model="password"
            password
            autocomplete="current-password"
            autocorrect="off"
            autocapitalize="none"
            :placeholder="$t('PASSWORD_PLACEHOLDER')"
            required
            @keydown.enter.stop.prevent="signIn"
          />

          />

          <NuxtLink v-if="features.changePassword" to="/forgot-password" class="text-xs text-end mt-0 pt-0 text-sky-600">{{ $t('FORGOT_PASS') }}</NuxtLink>
        </div>

        <button class="p-4 button text-lg" :class="{ 'is-loading': isLoading }" @click="signIn">{{ $t('SIGN_IN') }}</button>

        <div v-if="features.signup" class="text-sm text-center">
          {{ $t('NOT_A_MEMBER') }}
          <NuxtLink class="text-sky-800" to="/signup">{{ $t('SIGN_UP_HERE') }}</NuxtLink>
        </div>
      </form>
      <div v-if="error" class="w-full bg-red-100 border border-red-400 rounded text-center">
        {{ $t('WRONG_CREDENTIALS') }}
      </div>

      <div v-if="features.privacyDocuments" class="text-xs text-center text-neutral-400">
        <i18n-t keypath="RECAPTCHA" tag="p">
          <template #privacyPolicy>
            <a class="font-semibold" href="https://policies.google.com/privacy">{{ $t('PRIVACY_POLICY') }}</a>
          </template>
          <template #termsOfService>
            <a class="font-semibold" href="https://policies.google.com/terms">{{ $t('TERMS_OF_SERVICE') }}</a>
          </template>
        </i18n-t>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
const statesStore = useStatesStore();
const { login } = useIntegrationAuth();

definePageMeta({
  middleware: [
    function () {
      const statesStore = useStatesStore();
      if (statesStore.isLogged()) {
        return navigateTo('/');
      }
    },
  ],
});

const error = ref(false);
const username = ref('');
const password = ref('');
const isLoading = ref(false);
const features = useIntegrationFeatures();

const signIn = async () => {
  isLoading.value = true;
  error.value = false;
  try {
    await login(username.value, password.value);
    await navigateTo('/');
  } catch (e) {
    error.value = true;
  }
  isLoading.value = false;
};
</script>
