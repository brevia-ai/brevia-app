<template>
    <div class="max-w-sm mx-auto flex flex-col space-y-8">
        <ElementLogo class="mt-0.5 h-[128px] w-auto mx-auto" />
        <div class="flex mx-auto ">
            <p class="py-1 pl-2 text-xl">{{ user.username }}</p>
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
                <input v-model="surname" @focusin="saveSurnameVisible=true" @focusout="saveSurnameVisible=false; surname=user.surname" class="w-full py-1 pl-2 pr-14 text-xl focus:outline-none text-sky-950 bg-transparent rounded focus:border-sky-500 focus:ring-sky-500 focus:ring-2">
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

<script setup>
    const statesStore = useStatesStore();
    const recaptchaInstance = useReCaptcha();
    let user = statesStore.user;
    let name = ref(user?.name);
    let surname = ref(user?.surname);
    let nameError = ref(false);
    let surnameError = ref(false);
    let lastLoginErr = ref(new Date(user.meta.last_login_err).toLocaleDateString() + ' ' + new Date(user.meta.last_login_err).toLocaleTimeString());
    let lastPassMod = ref(new Date(user?.meta.password_modified).toLocaleDateString() + ' ' + new Date(user?.meta.password_modified).toLocaleTimeString());
    let saveNameVisible = ref(false);
    let saveSurnameVisible = ref(false);
    let nameChanging = ref(false);
    let surnameChanging = ref(false);

    function revertChanges() {
        if(saveNameVisible.value)saveNameVisible.value = false;
        if(saveSurnameVisible.value)saveSurnameVisible.value = false;
        if(!nameChanging.value)name.value = user.name;
        if(!surnameChanging.value)surname.value = user.surname;
    }

    async function changeName() {
        let newName = name.value;
        nameChanging.value = true;
        if(!name.value.length){
            nameError.value = true;
            nameChanging.value = false;
            return
        }
        try {
            nameError.value = false;
            // Waiting for recaptcha
            // await recaptchaInstance?.recaptchaLoaded();
            // const recaptcha = async () => await recaptchaInstance?.executeRecaptcha('login');
            // const recaptcha_token = await recaptcha();

            const data = await $fetch('/api/bedita/auth/user', {
                method: 'PATCH',
                body: {
                    newname: newName,
                    // recaptcha_token,
                },
            });
            statesStore.userLogin(filterUserDataToStore(data));
            user = statesStore.user;
            name.value = user.name;
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
        if(!name.value.length){
            surnameError.value = true;
            surnameChanging.value = false;
            return
        }
        try {
            surnameError.value = false;
            // Waiting for recaptcha
            // await recaptchaInstance?.recaptchaLoaded();
            // const recaptcha = async () => await recaptchaInstance?.executeRecaptcha('login');
            // const recaptcha_token = await recaptcha();

            const data = await $fetch('/api/bedita/auth/user', {
                method: 'PATCH',
                body: {
                    newsurname: newSurname,
                    // recaptcha_token,
                },
            });
            statesStore.userLogin(filterUserDataToStore(data));
            user = statesStore.user;
            surname.value = user.surname;
            saveSurnameVisible.value = false;
            surnameChanging.value = false;
        } catch (error) {
            console.log(error);
            surnameChanging.value = false;
        }
    }

</script>
