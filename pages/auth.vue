<template>
    <main>
        <div class="mt-6 max-w-sm mx-auto space-y-8" v-if="!logged || !store.isLogged">
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

                <div class="text-sm text-center">
                    {{ $t('NOT_A_MEMBER') }}
                    <NuxtLink class="text-sky-800" to="/signup">{{ $t('SIGN_UP_HERE') }}</NuxtLink>
                </div>
            </form>

            <div class="w-full bg-red-100 border border-red-400 rounded text-center" v-if="error">
                {{ $t('WRONG_CREDENTIALS') }}
            </div>
        </div>

        <div v-else>
            Welcome {{ logged.name }} {{ logged.surname }} ({{ logged.email }})
        </div>
    </main>
</template>

<script>
import { useStatesStore } from '~~/store/states';

export default {
    data() {
        return {
            error: false,
            menu: [],
            username: '',
            password: '',
            logged: false,
            store: null,
            isLoading: false,
        }
    },

    mounted() {
        this.store = useStatesStore();
    },

    created() {
        const store = useStatesStore();
        const menu = store.getMenu();
        store.readOptions();
        if(menu?.length)
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
                console.log('flex flex-col')
                const data = await $fetch('/api/login', {
                    method: 'POST',
                    body: {
                        username: this.username,
                        password: this.password,
                    },
                });

                this.setUserMenu(data);
                this.logged = {
                    name: data?.data?.attributes?.name || '',
                    surname: data?.data?.attributes?.surname || '',
                    email: data?.data?.attributes?.email || '',
                };

                this.isLoading = true;
            } catch (error) {
                this.error = true;
                this.isLoading = false;
            }
        },

        setUserMenu(data) {
            const store = useStatesStore();
            const included = data?.included || [];
            if (included?.length === 0) {
                store.userLogin([]);

                return;
            }
            let items = [];
            const collections = included.filter(item => item?.type === 'collections');
            for (const item of collections) {
                items.push({
                    link: `/chatbot/${item?.attributes?.uname}`,
                    type: 'chatbot',
                    title: this.field(item, 'title'),
                    description: this.field(item, 'description'),
                    params: null
                });
            }
            const features = included.filter(item => item?.type === 'features');
            for (const item of features) {
                const params = item?.attributes?.feature_params || {};
                if (!('payload' in params)) {
                    params['payload'] = {};
                }
                params['payload']['prompts'] = item?.attributes?.prompts || null;
                items.push({
                    link: `/${item?.attributes?.feature_type}`,
                    type: item?.attributes?.feature_type || '',
                    title: this.field(item, 'title'),
                    description: this.field(item, 'description'),
                    params
                });
            }
            store.userLogin(items);
        },

        field(obj, field) {
            return obj?.attributes?.[field] || obj?.meta?.[field] || '';
        },
    },
}
</script>
