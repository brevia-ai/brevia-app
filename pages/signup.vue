<template>
    <main>
        <div class="max-w-lg mx-auto space-y-6">
            <header class="space-y-4">
                <h2 class="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                    <span v-if="done">{{ $t('TITLES.REGISTER_CONFIRM_EMAIL') }}</span>
                    <span v-else>{{ $t('TITLES.REGISTER_ACCOUNT') }}</span>
                </h2>

                <div class="rich-text text-lg" v-if="done">
                    <p>{{ $t('CONFIRMATION_MAIL_TO', { email: userMail }) }}.</p>
                    <p>{{ $t('CHECK_YOUR_INBOX') }}.</p>
                </div>

                <div class="rich-text" v-else>Compila il modulo di iscrizione. Tutti i campi sono obbligatori.</div>
            </header>

            <form class="space-y-4" ref="signupForm" @submit.prevent v-if="!done">
                <div class="grid sm:grid-cols-2 gap-6">
                    <UIXInputText
                        :label="$t('FIRST_NAME')" :placeholder="$t('FIRST_NAME_PLACEHOLDER')"
                        autocomplete="given-name" required
                        v-model="firstName" />

                    <UIXInputText
                        :label="$t('LAST_NAME')" :placeholder="$t('LAST_NAME_PLACEHOLDER')"
                        autocomplete="family-name" required
                        v-model="lastName" />

                    <UIXInputText class="sm:col-span-2"
                        :label="$t('EMAIL')" :placeholder="$t('EMAIL_PLACEHOLDER')"
                        autocomplete="username" required
                        v-model="userMail" />

                    <div class="flex flex-col space-y-1">
                        <UIXInputText
                            :label="$t('PASSWORD')" :placeholder="$t('PASSWORD_PLACEHOLDER')"
                            :password="!showPassword"
                            autocomplete="new-password" required
                            v-model="userPass" />

                        <label class="flex items-center space-x-2">
                            <input type="checkbox" @click="showPassword = !showPassword">
                            <span class="text-sm ml-2">{{ $t('SHOW_PASSWORD') }}</span>
                        </label>
                    </div>

                    <div class="flex flex-col space-y-1">
                        <UIXInputText
                            :label="$t('CONFIRM_PASSWORD')" :placeholder="$t('CONFIRM_PASSWORD_PLACEHOLDER')"
                            :password="!showPassword"
                            autocomplete="off" required
                            v-model="confirmPass" />

                        <p class="text-red-600 text-sm" v-if="userPass != confirmPass">{{ $t('PASSWORD_MISMATCH') }}</p>
                    </div>
                </div>

                <div v-if="loading">...</div>
                <div v-if="error">{{ $t('AN_ERROR_OCCURRED') }}</div>

                <div class="pt-2">
                    <button type="submit" class="block w-full max-w-xs mx-auto button text-lg"
                        @click.prevent.stop="validateRegitration"
                        :disabled="disableSignup">
                        {{ $t('SIGN_UP') }}
                    </button>
                </div>

                <div class="text-center">
                    {{ $t('ALREADY_REGISTERED') }}
                    <NuxtLink class="text-sky-800" to="/auth">{{ $t('SIGN_IN') }}</NuxtLink>
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
                error: false,
            }
        },
        computed: {
            disableSignup() {
                return !this.firstName || !this.lastName || !this.userMail || !this.userPass || !this.confirmPass || (this.userPass !== this.confirmPass);
            },

            isValidEmail() {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

                return emailRegex.test(this.userMail);
            },
        },

        created() {
            const store = useStatesStore();
            const menu = store.getMenu();
            store.readOptions();
            if(menu?.length)
                navigateTo('/');
        },

        methods: {
            async validateRegitration() {
                this.error = false;
                this.loading = true;
                // Register user
                try {
                    const data = await $fetch('/api/signup', {
                        method: 'POST',
                        body: {
                            name: this.firstName,
                            surname: this.lastName,
                            username: this.userMail,
                            password: this.userPass,
                            email: this.userMail
                        },
                    });

                    console.log("DATA:");
                    console.log(data);
                    this.done = true;
                } catch (error) {
                    console.log(error.data);
                    this.error = true;
                }
                this.loading = false;
            },

            loginUser(){
                const store = useStatesStore();
                store.userLogout();
            },
        },
    }
</script>
