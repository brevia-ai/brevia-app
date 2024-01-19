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
                <div class="pt-2">
                    <button type="submit" class="block w-full sm:max-w-xs mx-auto button text-lg"
                        @click.prevent.stop="signup"
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

<script>
    import { useStatesStore } from '~~/store/states';

    export default {
        data(){
            return{
                firstName: '',
                lastName: '',
                userMail: '',
                userPass: '',
                confirmPass: '',

                done: false,
                showPassword: false,
                loading: false,
                error: '',
                recaptchaInstance: useReCaptcha(),
            }
        },
        computed: {
            formIsValid() {
                const completed = this.firstName && this.lastName && this.userMail && this.userPass && this.confirmPass && (this.userPass === this.confirmPass);
                return completed && this.emailIsValid;
            },

            emailIsValid() {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

                return emailRegex.test(this.userMail);
            },
        },

        created() {
            const statesStore = useStatesStore();
            if (statesStore.isLogged)
                navigateTo('/');
        },

        methods: {
            errorMessage(err) {
                if (err?.error?.code === 'be_user_exists') {
                    return this.$t('USER_ALREADY_EXISTS');
                }

                return this.$t('AN_ERROR_OCCURRED');
            },
            async signup() {
                this.error = '';
                this.loading = true;
                // Register user
                try {
                    // Waiting for recaptcha
                    // await this.recaptchaInstance?.recaptchaLoaded();
                    // const recaptcha = async () => await this.recaptchaInstance?.executeRecaptcha('login');
                    // const recaptcha_token = await recaptcha();

                    await $fetch('/api/bedita/signup', {
                        method: 'POST',
                        body: {
                            name: this.firstName,
                            surname: this.lastName,
                            username: this.userMail,
                            password: this.userPass,
                            email: this.userMail,
                            user_preferences: {
                                lang: this.$i18n.locale,
                            },
                            // recaptcha_token,
                        },
                    });

                    this.done = true;
                } catch (error) {
                    console.error(error.data);
                    this.error = this.errorMessage(error.data);
                }

                this.loading = false;
            },
        },
    }
</script>
