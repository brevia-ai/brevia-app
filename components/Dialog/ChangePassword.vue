<template>
    <div class="space-y-8 leading-tight">
        <div class="text-center space-y-4">
            <p class="text-lg font-bold uppercase">{{ $t('CHANGE_PASSWORD') }}</p>
            <p>{{ $t('PASSWORD_ADVICE') }}</p>
        </div>
        <form class="space-y-6" v-if="!success">
            <div>
                <label for="currentPwd">{{ $t('CURRENT_PASSWORD') }}</label>
                <input id="currentPwd" type="password" autocomplete='off' class="w-full" v-model="oldPass" @focusout="checkOldPwd"/>
            </div>
            <p class="text-red-600 text-sm" v-if="pwdError">{{ $t('PASSWORD_ERROR') }}</p>
            <div class="pt-16">
                <label for="newPwd" >{{ $t('NEW_PASSWORD') }}:</label>
                <input id="newPwd" type="password" autocomplete='off' class="w-full" v-model="newPass"/>
            </div>
            <div>
                <label for="confirmPwd">{{ $t('CONFIRM_NEW_PASSWORD') }}:</label>
                <input id="confirmPwd" type="password" autocomplete='off' class="w-full border-red-300" v-model="confirmPass" />
            </div>
            <p class="text-red-600 text-sm" v-if="newPass != confirmPass">{{ $t('PASSWORD_MISMATCH') }}</p>
            <div class="flex justify-between space-x-4">
                <button class="button button-secondary uppercase" @click="$closeModal">{{ $t('CANCEL') }}</button>

                <button class="button uppercase" :disabled="(newPass != confirmPass || pwdError)" :class="{ 'is-loading': loading }"
                    @click.prevent.default="changePassword">
                    {{ $t('CHANGE_PASSWORD') }}
                </button>
            </div>
            <p class="text-red-600 text-md" v-if="changeError">{{ $t('SOMETHING_WENT_WRONG') }}</p>
        </form>
        <div v-if="success">
            <img class="mx-auto" width="40" height="40" src="/check.png">
            <h1 class="text-lg font-bold text-center uppercase">{{ $t('PASSWORD_MODIFIED') }}</h1>
            <div class="flex justify-center mt-12 mb-4">
                <button class="button button-secondary uppercase" @click="$closeModal">{{ $t('CLOSE') }}</button>
            </div>
        </div>

    </div>
</template>

<script setup>
    import { useReCaptcha } from 'vue-recaptcha-v3';
    import { useStatesStore } from '~~/store/states';
    const { $closeModal } = useNuxtApp();
    const recaptchaInstance = useReCaptcha();
    const states = useStatesStore();
    const emit = defineEmits(['stopClick']);
    const user = states.user;
    let oldPass = ref('');
    let newPass = ref('');
    let confirmPass = ref('');
    let changeError = ref(false);
    let pwdError = ref(false);
    let loading = ref(false);
    let success = ref(false);

    onMounted(() => {
        emit('stopClick');
    });

    const changePassword = async () => {
        try {
            loading.value = true;
            // Waiting for recaptcha
            await recaptchaInstance?.recaptchaLoaded();
            const recaptcha = async () => await recaptchaInstance?.executeRecaptcha('login');
            const recaptcha_token = await recaptcha();

            const data = await $fetch('/api/bedita/auth/user', {
                method: 'PATCH',
                body: {
                    newpassword: newPass.value,
                    oldpassword: oldPass.value,
                    recaptcha_token,
                },
            });
            console.log(data);
            loading.value = false;
            changeError.value = false;
            success.value = true;
            //$closeModal();

        } catch (changeError) {
            console.log(changeError);
            success.value = false;
            loading.value = false;
            changeError.value = true;
        }
    }

    const checkOldPwd = async () => {
        try{
            console.log(user);
            // Waiting for recaptcha
            await recaptchaInstance?.recaptchaLoaded();
            const recaptcha = async () => await recaptchaInstance?.executeRecaptcha('login');
            const recaptcha_token = await recaptcha();

            const data = await $fetch('/api/bedita/auth/login', {
                    method: 'POST',
                    body: {
                        username: user.username,
                        password: oldPass.value,
                        recaptcha_token,
                    },
                });
            console.log(data)
            pwdError.value = false
        } catch (changeError) {
            console.log(changeError)
            pwdError.value = true
        }
    }

</script>
