<template>
    <div class="max-w-sm mx-auto flex flex-col space-y-8">
        <ElementLogo class="mt-0.5 h-[128px] w-auto mx-auto" />
        <div class="flex mx-auto ">
            <p class="py-1 pl-2 text-xl">{{ user?.attributes?.username }}</p>
        </div>
        <div>
            <p class="text-xs text-sky-600">{{ $t('FIRST_NAME') }}</p>
            <div class="relative">
                <input v-model="name" @focusin="saveNameVisible=true" @focusout="revertChanges" class="w-full py-1 pl-2 pr-14 text-xl focus:outline-none text-sky-950 bg-transparent rounded focus:border-sky-500 focus:ring-sky-500 focus:ring-2">
                <button v-if="saveNameVisible" @mousedown.left="changeName" class="absolute right-2 top-1">
                    <Icon name="ic:outline-task-alt" class="text-3xl text-primary hover:text-lime-500" />
                </button>
            </div>
            <p class="pl-2 text-red-600 text-sm" v-if="nameError">{{ $t('FIRST_NAME_ERROR') }}</p>
        </div>
        <div>
            <p class="text-xs text-sky-600">{{ $t('LAST_NAME') }}</p>
            <div class="relative">
                <input v-model="surname" @focusin="saveSurnameVisible=true" @focusout="revertChanges" class="w-full py-1 pl-2 pr-14 text-xl focus:outline-none text-sky-950 bg-transparent rounded focus:border-sky-500 focus:ring-sky-500 focus:ring-2">
                <button v-if="saveSurnameVisible" @mousedown.left="changeSurname" class="absolute right-2 top-1">
                    <Icon name="ic:outline-task-alt" class="text-3xl text-primary hover:text-lime-500" />
                </button>
            </div>
            <p class="pl-2 text-red-600 text-sm" v-if="surnameError">{{ $t('LAST_NAME_ERROR') }}</p>
        </div>
        <div class="space-y-2">
            <p class="text-md text-sky-600" v-if="lastLoginErr">{{ $t('LAST_LOGIN_ERROR') }} {{ lastLoginErr }}</p>
            <p class="text-md text-sky-600" >{{ $t('LAST_PASSWORD_CHANGE') }} {{ lastPassMod }}</p>
            <button @click="$openModal('DialogChangePassword')" class="p-4 button w-full mt-6 rounded-md px-3.5 py-2.5 text-center text-sm font-semibold">
                    {{ $t('CHANGE_PASSWORD') }}
            </button>
            <button @click="$openModal('DialogDeleteAccount')" class="p-4 button-danger w-full mt-6 rounded-md px-3.5 py-2.5 text-center text-sm font-semibold">
                    {{ $t('DELETE') }} account
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { type JsonApiResourceObject } from '@atlasconsulting/bedita-sdk';
import { type ApiResponseBodyResource, type UserAuth } from '@atlasconsulting/nuxt-bedita';

const { locale } = useI18n();
const { user: sessionUser } = useBeditaAuth();

const { data } = await useFetch<ApiResponseBodyResource>('/api/bedita/auth/user'); // get complete user data
const user = ref(data.value?.formattedData?.data as JsonApiResourceObject);
let name = ref(user.value?.attributes?.name);
let surname = ref(user.value?.attributes?.surname);
let nameError = ref(false);
let surnameError = ref(false);
let lastLoginErr = ref('');
let lastPassMod = ref('');
let saveNameVisible = ref(false);
let saveSurnameVisible = ref(false);
let nameChanging = ref(false);
let surnameChanging = ref(false);

if (user.value?.meta?.last_login_err) {
    lastLoginErr.value = `${new Date(user.value?.meta?.last_login_err).toLocaleDateString(locale.value)} ${new Date(user.value?.meta?.last_login_err).toLocaleTimeString(locale.value)}`;
}
if (user.value?.meta?.password_modified) {
    lastPassMod.value = `${new Date(user.value?.meta?.password_modified).toLocaleDateString(locale.value)} ${new Date(user.value?.meta?.password_modified).toLocaleTimeString(locale.value)}`;
}

function revertChanges() {
    if (saveNameVisible.value) {
        saveNameVisible.value = false;
    }
    if (saveSurnameVisible.value) {
        saveSurnameVisible.value = false;
    }
    if (!nameChanging.value) {
        name.value = user.value?.attributes?.name;
    }
    if (!surnameChanging.value) {
        surname.value = user.value?.attributes?.surname;
    }
}

async function changeName() {
    let newName = name.value;
    nameChanging.value = true;
    if (!name.value.length) {
        nameError.value = true;
        nameChanging.value = false;
        return;
    }
    try {
        nameError.value = false;
        const response = await $fetch<UserAuth>('/api/bedita/auth/user', {
            method: 'PATCH',
            body: {
                name: newName,
            },
        });
        sessionUser.value = filterUserDataToStore(response);
        user.value = response.data;
        name.value = user.value?.attributes?.name;
        saveNameVisible.value = false;
        nameChanging.value = false;
    } catch (error) {
        console.log(error);
        nameChanging.value = false;
    }
}

async function changeSurname() {
    let newSurname = surname.value;
    surnameChanging.value = true;
    if (!surname.value.length) {
        surnameError.value = true;
        surnameChanging.value = false;
        return;
    }
    try {
        surnameError.value = false;
        const response = await $fetch<UserAuth>('/api/bedita/auth/user', {
            method: 'PATCH',
            body: {
                surname: newSurname,
            },
        });
        sessionUser.value = filterUserDataToStore(response);
        user.value = response.data;
        surname.value = user.value?.attributes?.surname;
        saveSurnameVisible.value = false;
        surnameChanging.value = false;
    } catch (error) {
        console.log(error);
        surnameChanging.value = false;
    }
}

</script>
