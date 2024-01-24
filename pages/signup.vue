<template>
    <main>
        <div class="max-w-lg mx-auto space-y-6">
            <header class="space-y-4">
                <h2 class="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                    <span v-if="done">{{ $t('TITLES.REGISTER_CONFIRM_EMAIL') }}</span>
                    <span v-else>{{ $t('TITLES.REGISTER_ACCOUNT') }}</span>
                </h2>

                <div class="text-lg" v-if="done">
                    <p>{{ $t('CONFIRMATION_MAIL_TO', { email: userMail }) }}.</p>
                    <p>{{ $t('CHECK_YOUR_INBOX') }}.</p>
                </div>

                <div v-else>{{ $t('COMPILE_SUBSCRIPTION_FORM') }}.</div>
            </header>

            <form class="space-y-4" ref="signupForm" @submit.prevent v-if="!done">
                <div class="grid sm:grid-cols-2 gap-6">
                    <UIXInput
                        :label="$t('FIRST_NAME')" :placeholder="$t('FIRST_NAME_PLACEHOLDER')"
                        autocomplete="given-name" required
                        v-model="firstName" />

                    <UIXInput
                        :label="$t('LAST_NAME')" :placeholder="$t('LAST_NAME_PLACEHOLDER')"
                        autocomplete="family-name" required
                        v-model="lastName" />

                    <UIXInput class="sm:col-span-2"
                        :label="$t('EMAIL')" :placeholder="$t('EMAIL_PLACEHOLDER')"
                        autocomplete="username" required
                        v-model="userMail" />

                    <div class="flex flex-col space-y-1.5">
                        <UIXInput
                            :label="$t('PASSWORD')" :placeholder="$t('PASSWORD_PLACEHOLDER')"
                            :password="!showPassword" :no-trim="true"
                            autocomplete="new-password" required
                            v-model="userPass" />

                        <label class="flex items-center space-x-2 cursor-pointer">
                            <input type="checkbox" @click="showPassword = !showPassword">
                            <span class="text-sm ml-2">{{ $t('SHOW_PASSWORD') }}</span>
                        </label>
                    </div>

                    <div class="flex flex-col space-y-1.5">
                        <UIXInput
                            :label="$t('CONFIRM_PASSWORD')" :placeholder="$t('CONFIRM_PASSWORD_PLACEHOLDER')"
                            :password="!showPassword" :no-trim="true"
                            autocomplete="off" required
                            v-model="confirmPass" />

                        <p class="text-red-600 text-sm" v-if="userPass != confirmPass">{{ $t('PASSWORD_MISMATCH') }}</p>
                    </div>
                </div>

                <div class="text-red-600 text-sm" v-if="error">{{ error }}. {{ $t('RETRY') }}</div>

                <slot v-if="displayTerms">
                    <div class="pt-2">
                        <label class="flex items-center space-x-2 cursor-pointer">
                            <input type="checkbox" v-model="termsAccepted">
                            <span class="text-sm ml-2">
                                {{ $t('CONFIRM_READ_ACCEPT') }} <a href="https://www.iubenda.com/termini-e-condizioni/49496944" target="_blank" rel="noopener"
                :title="$t('TERMS_AND_CONDITIONS')">{{ $t('TERMS_AND_CONDITIONS') }}</a>
                            </span>
                        </label>
                    </div>
                    <div class="pt-2">
                        <label class="flex items-center space-x-2 cursor-pointer">
                            <input type="checkbox" v-model="privacyAccepted">
                            <span class="text-sm ml-2">{{ $t('CONFIRM_READ') }}
                                <a href="https://www.iubenda.com/privacy-policy/49496944" target="_blank" rel="noopener"
                                    title="Privacy Policy">Privacy Policy</a>
                            </span>
                        </label>
                    </div>
                </slot>
                <div class="pt-2">
                    <button type="submit" class="block w-full sm:max-w-xs mx-auto button text-lg"
                        @click.prevent.stop="userSignup"
                        :disabled="!formIsValid">
                        {{ $t('SIGN_UP') }}
                    </button>
                </div>

                <div class="text-center">
                    {{ $t('ALREADY_REGISTERED') }}
                    <NuxtLink class="text-sky-800" to="/auth">{{ $t('SIGN_IN') }}</NuxtLink>
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
            </form>
        </div>
    </main>
</template>

<script setup lang="ts">
import { ApiResponseBodyError } from '@atlasconsulting/bedita-sdk';

definePageMeta({
    middleware: [
        function () {
            const { isLogged } = useBeditaAuth();
            if (isLogged.value) {
                return navigateTo('/');
            }
        },
    ],
});

const { t, locale } = useI18n();
const { signup } = useBeditaSignup();

const firstName = ref('');
const lastName = ref('');
const userMail = ref('');
const userPass = ref('');
const confirmPass = ref('');
const done = ref(false);
const showPassword = ref(false);
const displayTerms = ref(useRuntimeConfig().public?.cookiesPrivacyTerms !== '');
const termsAccepted = ref(false);
const privacyAccepted = ref(false);
const loading = ref(false);
const error = ref('');

const formIsValid = computed(() => {
    const completed = firstName.value && lastName.value && userMail.value && userPass.value && confirmPass.value && (userPass.value == confirmPass.value);
    const accepted = displayTerms.value ? termsAccepted.value && privacyAccepted.value : true;
    return completed && accepted && emailIsValid.value;
});
const emailIsValid = computed(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return emailRegex.test(userMail.value);
});

const errorMessage = (err: ApiResponseBodyError) => {
    if (err?.error?.code === 'be_user_exists') {
        return t('USER_ALREADY_EXISTS');
    }

    return t('AN_ERROR_OCCURRED');
};

const userSignup = async () => {
    error.value = '';
    loading.value = true;
    try {
        const terms_accepted = displayTerms.value ? new Date().toISOString().slice(0, 10) : null;
        await signup({
            name: firstName.value,
            surname: lastName.value,
            username: userMail.value,
            password: userPass.value,
            email: userMail.value,
            user_preferences: {
                lang: locale.value,
            },
            terms_accepted,
        });

        done.value = true;
    } catch (e: any) {
        console.error(e?.data);
        error.value = errorMessage(e?.data);
    }

    loading.value = false;
};

</script>
