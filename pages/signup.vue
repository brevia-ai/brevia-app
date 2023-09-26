<template>
    <main>
        <div class="mt-6  max-w-lg  mx-auto flex flex-col  space-y-4">
            <div class="mx-auto max-w-2xl text-center">
                <h2 class="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">{{ $t('REGISTER_ACCOUNT') }}</h2>
            </div>
            <div class = "block text-sm text-gray-900 mx-12" v-if="registrationDone">
                <p>{{ $t('CONFIRMATION_MAIL_TO', { email: userMail }) }}.</p>
                <p>{{ $t('CHECK_YOUR_INBOX') }}</p>
            </div>
            <form action="#" ref="signupForm" method="POST" class="mx-12 mt-16 max-w-xl sm:mt-20" v-if="!registrationDone">
                <div class="grid  grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-1">
                    <div class="sm:col-span-2">
                        <label for="first-name" class="block text-sm font-semibold leading-6 text-gray-900">{{ $t('FIRST_NAME') }} <span class="text-red-400">*</span></label>
                        <div class="mt-2.5">
                            <input
                                v-model="firstName"
                                type="text"
                                :placeholder="$t('FIRST_NAME_PLACEHOLDER')"
                                required
                                autocapitalize="none"
                                autocorrect="off"
                                @focusout="activateSignupButton"
                                class="block w-full rounded-md border px-3.5 py-2 shadow-sm sm:text-sm sm:leading-6"
                                :class="firstName ? 'ring-gray-300 ring-1' : 'ring-red-500 ring-1'">
                        </div>
                    </div>
                    <div class="sm:col-span-2">
                        <label for="last-name" class="block text-sm font-semibold leading-6 text-gray-900">{{ $t('LAST_NAME') }} <span class="text-red-400">*</span></label>
                        <div class="mt-2.5">
                            <input
                                v-model="lastName"
                                type="text"
                                :placeholder="$t('LAST_NAME_PLACEHOLDER')"
                                required
                                autocapitalize="none"
                                autocorrect="off"
                                @focusout="activateSignupButton"
                                class="block w-full rounded-md border px-3.5 py-2 shadow-sm sm:text-sm sm:leading-6"
                                :class="lastName ? 'ring-gray-300 ring-1' : 'ring-red-500 ring-1'">
                        </div>
                    </div>
                    <div class="sm:col-span-4">
                        <label for="company" class="block text-sm font-semibold leading-6 text-gray-900">{{ $t('EMAIL') }} <span class="text-red-400">*</span></label>
                        <div class="mt-2.5">
                            <input
                                v-model="userMail"
                                type="email"
                                :placeholder="$t('EMAIL_PLACEHOLDER', { email: 'name.surname@email.com' })"
                                required
                                autocapitalize="none"
                                autocorrect="off"
                                autocomplete="userMail"
                                class="block w-full border-0 rounded-md px-3.5 py-2 text-gray-900 shadow-sm ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                :class="isValidEmail ? 'ring-gray-300 ring-1' : 'ring-red-500 ring-1'">
                        </div>
                    </div>
                    <div class="sm:col-span-4">
                        <label for="email" class="block text-sm font-semibold leading-6 text-gray-900">{{ $t('PASSWORD') }} <span class="text-red-400">*</span></label>
                        <div class="mt-2.5">
                            <input
                                v-model="userPass"
                                :type="showPassword ? 'text' : 'password'"
                                :placeholder="$t('PASSWORD_PLACEHOLDER')"
                                required
                                autocapitalize="none"
                                autocorrect="off"
                                autocomplete="userPass"
                                class="block w-full rounded-md border px-3.5 py-2 shadow-sm sm:text-sm sm:leading-6"
                                :class="userPass ? 'ring-gray-300 ring-1' : 'ring-red-500 ring-1'">
                        </div>
                        <div class="mx-2.5">
                            <input
                                type="checkbox"
                                class="inline"
                                @click="showPassword = !showPassword"
                                >
                            <span class="inline text-sm ml-2">{{ $t('SHOW_PASSWORD') }}</span>
                        </div>
                    </div>
                    <div class="sm:col-span-4">
                        <label for="email" class="block text-sm font-semibold leading-6 text-gray-900">{{ $t('CONFIRM_PASSWORD') }}</label>
                        <div class="mt-2.5">
                            <input
                                v-model="confirmPass"
                                type="password"
                                :placeholder="$t('CONFIRM_PASSWORD_PLACEHOLDER')"
                                required
                                autocapitalize="none"
                                autocorrect="off"
                                autocomplete="confirmPass"
                                class="block w-full rounded-md border px-3.5 py-2 shadow-sm sm:text-sm sm:leading-6">
                        </div>
                        <p class="text-red-600 text-sm font-bold" v-if="userPass != confirmPass">{{ $t('PASSWORD_MISMATCH') }}</p>
                    </div>
                </div>
                <div v-if="loading">...</div>
                <div v-if="error">{{ $t('AN_ERROR_OCCURRED') }}</div>

                <div class="mt-10 mx-20">
                    <button
                        type="submit"
                        class="p-4 button w-full rounded-md px-3.5 py-2.5 text-center text-sm font-semibold"
                        @click.prevent.stop="validateRegitration"
                        :disabled="disableSignup">
                        {{ $t('SIGN_UP_HERE') }}
                    </button>
                </div>
                <p class="text-center">{{ $t('ALREADY_REGISTERED') }} <a class="text-sky-800" href="/auth" @click.prevent.stop="loginUser" >{{ $t('SIGN_IN') }}</a></p>
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
                showPassword: false,
                loading: false,
                registrationDone: false,
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
                    this.registrationDone = true;
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
