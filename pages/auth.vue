<template>
    <main>
        <div class="mt-6 max-w-sm mx-auto flex flex-col space-y-4" v-if="!logged || !store?.isLogged">
            <input class="text-lg p-4 border border-sky-800 rounded" type="text"
                autocomplete="username" autocorrect="off" autocapitalize="none"
                :placeholder="$t('LOGIN_PLACEHOLDER')"
                v-model="username"
                @keydown.enter="login" required>

            <input class="text-lg p-4 border border-sky-800 rounded" type="password"
                autocomplete="current-password" autocorrect="off" autocapitalize="none"
                :placeholder="$t('PASSWORD_PLACEHOLDER')"
                v-model="password"
                @keydown.enter="login" required>
            <NuxtLink to="/forgot-password" class="text-xs text-end mt-0 pt-0 text-sky-600">{{ $t('FORGOT_PASS') }}</NuxtLink>
            <button class="p-4 button text-lg" @click="login">{{ $t('SIGN_IN') }}</button>

            <p>{{ $t('NOT_A_MEMBER') }} <a class="text-sky-800" href="/signup" @click.prevent.stop="signup">{{ $t('SIGN_UP_HERE') }}</a></p>

            <p class="text-red-600 text-lg font-bold text-center" v-if="error">{{ $t('WRONG_CREDENTIALS') }}</p>
        </div>
        <div v-else>
            <h1>{{ $t('HELLO', { name: `${logged.name} ${logged.surname} (${logged.email})` }) }}</h1>
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
        }
    },

    created() {
        const store = useStatesStore();
        const menu = store.getMenu();
        store.readOptions();
        if(menu?.length > 0) {
            navigateTo('/');
        }
    },

    mounted() {
        this.store = useStatesStore();
    },

    methods: {
        async login() {
            if (!this.username || !this.password) {
                return;
            }
            this.error = false;
            try {
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
            } catch (error) {
                this.error = true;
            }
        },

        signup() {
            const store = useStatesStore();
            store.userSignup();
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
