<template>
    <div class="mt-6 max-w-sm mx-auto flex flex-col space-y-4">
        <h2 text-3xl class="font-bold tracking-tight text-gray-900 sm:text-4xl" >{{ $t('PASSWORD_RESET') }}</h2>
        <div class="flex flex-col space-y-4" v-if="mailSent && !error">
            <img class="mx-auto" width="40" height="40" src="/check.png">
            <p>{{ $t('MAIL_TO') }} <span class="font-semibold"> {{ resetMail }}</span></p>
            <p>{{ $t('CHECK_YOUR_INBOX') }}</p>
        </div>
        <div class="flex flex-col space-y-4" v-else-if="!mailSent && error">
            <p class="text-lg text-center font-bold text-red-600">{{ $t('AN_ERROR_OCCURRED') }} </p>
            <button class="p-4  py-2.5 button text-sm font-semibold" @click="retry">Riprova</button>
        </div>
        <div class="flex flex-col space-y-4" v-else >
            <p>{{ $t('RESET_INSTRUCTIONS') }}</p>
            <input
                v-model="resetMail"
                ref="mailInput"
                type="email"
                class="block w-full rounded-md border border-sky-800 px-3.5 py-2 shadow-sm sm:text-sm sm:leading-6"
                required
                :placeholder="$t('EMAIL_PLACEHOLDER', { email: 'name.surname@email.com' })"
            >
            <p class="text-sm font-bold text-red-600" v-if="resetMail && !isValidEmail()" >{{ $t('NOT_VALID_EMAIL') }}</p>
            <button 
                :disabled="!resetMail || !isValidEmail()"
                type="submit"
                class="p-4  py-2.5 button text-sm font-semibold"
                :class = " loading.value ? 'loading' : '' " 
                @click="sendResetMail">
                {{ $t('SEND') }} Email
            </button>
        </div>
        <NuxtLink class="p-4  py-2.5 button text-sm font-semibold" to="/auth">{{ $t('GO_TO_LOGIN_PAGE') }}</NuxtLink>
    </div>
</template>

<script setup>
    const loading = ref(false)
    const mailSent = ref(false);
    const error = ref(false);
    const resetMail = ref('');
    const mailInput = ref(null);

    const isValidEmail = () => {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return emailRegex.test(resetMail.value);
            }

    async function sendResetMail() {
        loading.value = true;
        try {
            const resp = await $fetch('api/auth/reset', {
                method: 'POST',
                body: {
                    contact: resetMail.value,
                }
            });
            mailSent.value = true;
        } catch(err) {
            console.log(err);
            error.value = true;
        } finally {
            loading.value = false;
        } 
        
    }

    function retry() {
        error.value = false;
        mailSent.value = false;
        resetMail.value = '';
        mailInput.value = null;
        loading.value = false;
    }

    
</script>
