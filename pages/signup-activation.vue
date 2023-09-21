<template>
    <main class="grow">
        <div class="mt-6  max-w-lg  mx-auto flex flex-col  space-y-4">
            <div>
                <h1 class="text-center text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                    ACCOUNT ACTIVATION PAGE
                </h1>
            </div>
            <p v-if="loading"> checking...</p>
            <p v-else-if="err" class="text-center">An error occurred: {{ err.response._data.message }}</p>
            <p class="text-center" v-else>
                <h1 class="text-center text-2xl font-bold">Success!</h1><br>
                <img class="mx-auto" src="/check.png"><br>
                Your account has been successfully activated!<br>
                You can now log in with your new account.<br>
                <div class="text-center mt-10">
                    <a class="p-4 button text-sm rounded-md" href="/auth" @click.prevent.stop="loginUser">Go to login page</a>
                </div>
            </p> 
        </div>
    </main>
</template>

<script setup>
    import { useStatesStore } from '~~/store/states';
    const route = useRoute();
    const {data:resp, pending:loading, error:err} = await useFetch('api/signup/activation',{
                    method:'POST',
                    body: JSON.stringify({
                        uuid: route.query?.uuid,
                    }),
                })
    function loginUser(){
        const store = useStatesStore();
        store.userLogout();
    }
    
</script>