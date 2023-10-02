<template>
    <div class="mt-6 max-w-sm mx-auto flex flex-col space-y-4">
        <h2 class="font-bold tracking-tight text-gray-900 sm:text-4xl" >{{ $t('PASSWORD_RESET') }}</h2>
        <form v-if="!passSet && !error">
            <label for="newPass" class="block text-sm font-semibold leading-6 text-gray-900">{{ $t('NEW_PASSWORD') }} <span class="text-red-400">*</span></label>
            <input
                id="newPass"
                v-model="newPass"
                :type="showPassword ? 'text' : 'password'"
                :placeholder="$t('PASSWORD_PLACEHOLDER')"
                required
                autocapitalize="none"
                autocorrect="off"
                autocomplete="userPass"
                class="block w-full rounded-md border px-3.5 py-2 shadow-sm sm:text-sm sm:leading-6"
                :class="newPass ? 'ring-sky-800 ring-1' : 'ring-red-500 ring-1'">
                <div class="mx-2.5">
                    <input
                        type="checkbox"
                        class="inline"
                        @click="showPassword = !showPassword"
                        >
                    <span class="inline text-sm ml-2">{{ $t('SHOW_PASSWORD') }}</span>
                </div>
            <label for="confirmPass" class="block mt-6 text-sm font-semibold leading-6 text-gray-900">{{ $t('CONFIRM_PASSWORD') }} <span class="text-red-400">*</span></label>
            <input
                id="confirmPass"
                v-model="confirmPass"
                :type="showPassword ? 'text' : 'password'"
                :placeholder="$t('CONFIRM_PASSWORD_PLACEHOLDER')"
                required
                autocapitalize="none"
                autocorrect="off"
                autocomplete="userPass"
                class="block w-full rounded-md border px-3.5 py-2 shadow-sm sm:text-sm sm:leading-6"
                :class="confirmPass ? 'ring-sky-800 ring-1' : 'ring-red-500 ring-1'">
            <p class="mt-4 text-center" v-if="!newPass">{{ $t('CHOOSE_NEW_PASSWORD') }}</p>
            <p class="mt-4 text-center" v-if="!confirmPass && newPass">{{ $t('CONFIRM_NEW_PASSWORD') }}</p>
            <p class="mt-4 text-center text-red-600 font-semibold" v-if="confirmPass && newPass && (newPass !== confirmPass)">{{ $t('PASSWORD_MISMATCH') }}</p>
            <p class="mt-4 text-center text-green-600 font-semibold" v-if="confirmPass && newPass && (newPass === confirmPass)">{{ $t('PASSWORD_MATCH') }}</p>
            <button
                type="submit"
                class="p-4 button w-full mt-6 rounded-md px-3.5 py-2.5 text-center text-sm font-semibold"
                :class="loading ? 'loading' : '' "
                @click.prevent.stop="resetPassword"
                :disabled="!(confirmPass && newPass && (newPass === confirmPass))">
                {{ $t('SET_NEW_PASSWORD') }}
            </button>
        </form>
        <div class="flex flex-col space-y-4" v-if="error">
            <p class="text-lg text-center font-bold text-red-600">{{ $t('AN_ERROR_OCCURRED') }} </p>
        </div>
        <div class="flex flex-col space-y-4" v-if="passSet">
            <img class="mx-auto" src="/check.png"><br>
            <p class="text-lg">{{ $t('PASSWORD_CHANGED') }} </p>
            <NuxtLink class="p-4 button w-full mt-6 rounded-md px-3.5 py-2.5 text-center text-sm font-semibold" to="/auth">{{ $t('GO_TO_LOGIN_PAGE') }}</NuxtLink>
        </div>
    </div>
</template>

<script setup>

    definePageMeta({
        middleware: [
            function (to) {
                if (to.query?.uuid == null || to.query?.uuid.length == 0 ) {
                    return navigateTo('/');
                }
            },
        ],
    });

    const newPass = ref('');
    const confirmPass = ref('');
    const loading = ref(false);
    const error = ref(false);
    const passSet = ref(false);
    const showPassword = ref(false);
    const route = useRoute();

    async function resetPassword() {
        loading.value = true;
        error.value = false;
        try {
            await $fetch('api/auth/change', {
                method: 'PATCH',
                body: {
                  uuid: route.query?.uuid,
                  password: newPass.value,
                  login: false,
                }
            });
            passSet.value = true;
        } catch (err) {
            error.value = true;
        } finally {
            loading.value = false;
        }
    }

</script>
