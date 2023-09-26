<template>
    <main class="grow">
        <div class="mt-6  max-w-lg  mx-auto flex flex-col  space-y-4">
            <div>
                <h1 class="text-center text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                    {{ $t('ACCOUNT_ACTIVATION_PAGE') }}
                </h1>
            </div>
            <p v-if="loading"> {{ $t('CHECKING') }}...</p>
            <p v-else-if="error" class="text-center">{{ $t('AN_ERROR_OCCURRED') }}</p>
            <p class="text-center" v-else>
                <h1 class="text-center text-2xl font-bold">{{ $t('SUCCESS') }}!</h1><br>
                <img class="mx-auto" src="/check.png"><br>
                {{ $t('ACCOUNT_ACTIVATED') }}!<br>
                {{ $t('CAN_ACCESS_NOW') }}.<br>
                <div class="text-center mt-10">
                    <a class="p-4 button text-sm rounded-md" href="/auth" @click.prevent.stop="loginUser">{{ t('GO_TO_LOGIN_PAGE') }}</a>
                </div>
            </p>
        </div>
    </main>
</template>

<script setup>
import { useStatesStore } from '~~/store/states';

const route = useRoute();
const { pending: loading, error } = await useFetch('api/signup/activation',{
    method:'POST',
    body: {
        uuid: route.query?.uuid,
    },
});

function loginUser() {
    const store = useStatesStore();
    store.userLogout();
}

</script>
