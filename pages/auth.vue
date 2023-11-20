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
        </div>
    </main>
</template>

<script>
import { useStatesStore } from '~~/store/states';
import { mapStores } from 'pinia';

export default {
    data() {
        return {
            error: false,
            menu: [],
            username: '',
            password: '',
            isLoading: false,
            enableSignup: this.$config.public.features.signupAvailable,
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
                const data = await $fetch('/api/login', {
                    method: 'POST',
                    body: {
                        username: this.username,
                        password: this.password,
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
