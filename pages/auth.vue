<template>
    <main class="mt-16">
        <div class="mt-6 max-w-sm mx-auto space-y-8" v-if="!statesStore.isLogged">
            <form class="flex flex-col space-y-8" @submit.stop.prevent>
                <UIXInput
                    autocomplete="username" autocorrect="off" autocapitalize="none"
                    :placeholder="$t('LOGIN_PLACEHOLDER')"
                    v-model="username" @keydown.enter="login"
                    required />

                <div class="flex flex-col space-y-3">
                    <UIXInput password
                        autocomplete="current-password" autocorrect="off" autocapitalize="none"
                        :placeholder="$t('PASSWORD_PLACEHOLDER')"
                        v-model="password" @keydown.enter="login"
                        required />

                    <NuxtLink to="/forgot-password" class="text-xs text-end mt-0 pt-0 text-sky-600">{{ $t('FORGOT_PASS') }}</NuxtLink>
                </div>

                <button class="p-4 button text-lg"
                    :class="{ 'is-loading': isLoading }"
                    @click="login">{{ $t('SIGN_IN') }}</button>

                <div class="text-sm text-center" v-if="enableSignup">
                    {{ $t('NOT_A_MEMBER') }}
                    <NuxtLink class="text-sky-800" to="/signup">{{ $t('SIGN_UP_HERE') }}</NuxtLink>
                </div>
            </form>
            <div class="w-full bg-red-100 border border-red-400 rounded text-center" v-if="error">
                {{ $t('WRONG_CREDENTIALS') }}
            </div>


            <div class="text-xs text-center text-neutral-400" >
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

<script>
import { useStatesStore } from '~~/store/states';
import { mapStores } from 'pinia';
import { useReCaptcha } from 'vue-recaptcha-v3';

export default {
    data() {
        return {
            error: false,
            menu: [],
            username: '',
            password: '',
            isLoading: false,
            enableSignup: this.$config.public.features.signupAvailable,
            recaptchaInstance: useReCaptcha(),
        }
    },

    computed: {
        ...mapStores(useStatesStore),

    },

    created() {
        if (this.statesStore.isLogged)
            navigateTo('/');
    },

    methods: {
        async login() {
            if (!this.username || !this.password) {
                return;
            }

            this.error = false;
            this.isLoading = true;
            try {
                // Waiting for recaptcha
                await this.recaptchaInstance?.recaptchaLoaded();
                const recaptcha = async () => await this.recaptchaInstance?.executeRecaptcha('login');
                const recaptcha_token = await recaptcha();

                const data = await $fetch('/api/login', {
                    method: 'POST',
                    body: {
                        username: this.username,
                        password: this.password,
                        recaptcha_token,
                    },
                });

                this.statesStore.userLogin(filterUserDataToStore(data));
                navigateTo('/');

                this.isLoading = false;
            } catch (error) {
                this.error = true;
                this.isLoading = false;
            }
        },
    },
}
</script>
