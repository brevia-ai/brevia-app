<template>
    <div class="space-y-8 leading-tight" >
        <div class="text-center space-y-4">
            <Icon name="ph:warning-circle-bold" class="text-6xl text-pink-700" />
            <p class="text-lg">{{ $t('ARE_YOU_SURE_YOU_WANT_TO_DELETE_THIS') }} acccount?</p>
        </div>
        <div v-if="!deletionSuccess" class="text-center space-y-4" >
            <div class="text-center space-y-4" >
                <div class="space-y-2 text-sm">
                    <p>{{ $t('THIS_ACTION_CANNOT_BE_UNDONE') }}. {{ $t('THE_FOLLOWING_WILL_ALSO_BE_ELIMINATED') }}</p>
                    <div class="flex justify-center px-12">
                        <ul class="list-square list-outside text-left">
                            <li>{{ $t('ALL_RELATED_TO_THIS', {items: 'chatbot'}) }} account</li>
                        </ul>
                    </div>
                </div>
            </div>
            <form>
                <div>
                    <label for="currentPwd" class="text-sm">
                        <i18n-t keypath="CONFIRM_PWD_TO_DELETE" tag="p">
                            <template v-slot:permanently>
                                <b>{{ $t('PERMANENTLY') }}</b>
                            </template>
                        </i18n-t>
                    </label>
                    <input id="currentPwd" type="password" autocomplete='off' class="w-full" v-model="passWord" />
                </div>
            </form>
            <p class="text-red-600 text-md" v-if="deleteError">{{ $t('SOMETHING_WENT_WRONG') }}</p>
            <div class="flex justify-between space-x-4">
                <button class="button button-secondary uppercase" @click="$closeModal">{{ $t('CANCEL') }}</button>

                <button class="button button-danger uppercase" :disabled="!passWord" :class="{ 'is-loading': loading }" @click="deleteAccount">
                    {{ $t('DELETE') }} account
                </button>
            </div>
        </div>
        <div v-else class="text-center space-y-4">
            <p>Il tuo account è stato eliminato con successo.</p>
            <div class="flex justify-center mt-12 mb-4">
                <button class="button button-secondary uppercase" @click="logout">{{ $t('CLOSE') }}</button>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { useReCaptcha } from 'vue-recaptcha-v3';
    import { useStatesStore } from '~~/store/states';
    const { $closeModal } = useNuxtApp();
    const emit = defineEmits(['stopClick']);
    const recaptchaInstance = useReCaptcha();
    const states = useStatesStore();

    let passWord = ref('')
    let loading = ref(false);
    let deletionSuccess = ref(false);
    let deleteError = ref(false);

    onMounted(() => {
        emit('stopClick');
    });

    const deleteAccount = async () => {
        let userName = states.user.username;
        // Waiting for recaptcha
        try {
            loading.value=true;
            await recaptchaInstance?.recaptchaLoaded();
            const recaptcha = async () => await recaptchaInstance?.executeRecaptcha('login');
            const recaptcha_token = await recaptcha();

            const data = await $fetch('/api/bedita/auth/optout', {
                method: 'POST',
                body: {
                    username: userName,
                    password: passWord.value,
                    recaptcha_token,
                },
            });
            loading.value = false
            deleteError.value = false;
            deletionSuccess.value = true;

        } catch (error) {
            loading.value=false;
            deleteError.value = true;
            console.log(error)
        }
    }

    async function logout() {
        $closeModal();
        await $fetch('/api/bedita/auth/logout');
        states.userLogout();
        navigateTo('/auth');
    }

</script>
