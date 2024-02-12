<template>
    <div class="space-y-8 leading-tight">
        <div class="text-center space-y-4">
            <p class="text-lg font-bold uppercase">{{ $t('CHANGE_PASSWORD') }}</p>
            <p>{{ $t('PASSWORD_ADVICE') }}</p>
        </div>
        <form class="space-y-6" v-if="!success">
            <div>
                <label for="currentPwd">{{ $t('CURRENT_PASSWORD') }}</label>
                <input id="currentPwd" type="password" autocomplete='off' class="w-full" v-model="oldPass" />
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
            <p class="text-red-600 text-sm" v-if="newPass !== confirmPass">{{ $t('PASSWORD_MISMATCH') }}</p>
            <div class="flex justify-between space-x-4">
                <button class="button button-secondary uppercase" @click="$closeModal">{{ $t('CANCEL') }}</button>

                <button class="button uppercase" :disabled="isButtonDisabled" :class="{ 'is-loading': loading }"
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

<script setup lang="ts">
import { NuxtError } from 'nuxt/app';

const { $closeModal } = useNuxtApp();

const emit = defineEmits(['stopClick']);

let oldPass = ref('');
let newPass = ref('');
let confirmPass = ref('');
let changeError = ref(false);
let pwdError = ref(false);
let loading = ref(false);
let success = ref(false);

const isButtonDisabled = computed(() => {
    if (oldPass.value.length === 0 || newPass.value.length === 0 || confirmPass.value.length === 0) {
        return true;
    }

    return newPass.value !== confirmPass.value;
})

onMounted(() => {
    emit('stopClick');
});

const changePassword = async () => {
    try {
        pwdError.value = false
        changeError.value = false;
        loading.value = true;
        await $fetch('/api/bedita/auth/user', {
            method: 'PATCH',
            body: {
                password: newPass.value,
                old_password: oldPass.value,
            },
        });
        success.value = true;
    } catch (e: NuxtError | any) {
        success.value = false;
        if (['Wrong password', 'Missing current password'].includes(e?.data?.error?.title)) {
            pwdError.value = true;
        } else {
            changeError.value = true;
        }
    }
    loading.value = false;
}

</script>
