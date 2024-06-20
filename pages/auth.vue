<template>
    <main class="mt-16">
        <div class="mt-6 max-w-sm mx-auto space-y-8" v-if="!statesStore.isLogged()">
            <form class="flex flex-col space-y-8" @submit.stop.prevent>
                <UIXInput
                    autocomplete="username" autocorrect="off" autocapitalize="none"
                    :placeholder="$t('LOGIN_PLACEHOLDER')"
                    v-model="username" @keydown.enter.stop.prevent="signIn"
                    required />

                <div class="flex flex-col space-y-3">
                    <UIXInput password
                        autocomplete="current-password" autocorrect="off" autocapitalize="none"
                        :placeholder="$t('PASSWORD_PLACEHOLDER')"
                        v-model="password" @keydown.enter.stop.prevent="signIn"
                        required />

                    <NuxtLink v-if="features.changePassword" to="/forgot-password" class="text-xs text-end mt-0 pt-0 text-sky-600">{{ $t('FORGOT_PASS') }}</NuxtLink>
                </div>

                <button class="p-4 button text-lg"
                    :class="{ 'is-loading': isLoading }"
                    @click="signIn">{{ $t('SIGN_IN') }}</button>

                <div class="text-sm text-center" v-if="features.signup">
                    {{ $t('NOT_A_MEMBER') }}
                    <NuxtLink class="text-sky-800" to="/signup">{{ $t('SIGN_UP_HERE') }}</NuxtLink>
                </div>
            </form>
            <div class="w-full bg-red-100 border border-red-400 rounded text-center" v-if="error">
                {{ $t('WRONG_CREDENTIALS') }}
            </div>


            <div class="text-xs text-center text-neutral-400" v-if="features.privacyDocuments">
                <i18n-t keypath="RECAPTCHA" tag="p">
                    <template v-slot:privacyPolicy>
                        <a class="font-semibold" href="https://policies.google.com/privacy">{{ $t('PRIVACY_POLICY') }}</a>
                    </template>
                    <template v-slot:termsOfService>
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
            const statesStore = useStatesStore();;
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
