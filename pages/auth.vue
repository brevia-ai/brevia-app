<template>
    <main>
        <div class="mt-6 max-w-sm mx-auto flex flex-col space-y-4">
            <input class="text-lg p-4 border border-sky-800 rounded" type="text"
                autocomplete="username" autocorrect="off" autocapitalize="none"
                placeholder="Enter your username"
                v-model="username"
                @keydown.enter="login" required>

            <input class="text-lg p-4 border border-sky-800 rounded" type="password"
                autocomplete="current-password" autocorrect="off" autocapitalize="none"
                placeholder="Enter your password"
                v-model="password"
                @keydown.enter="login" required>

            <button class="p-4 button text-lg" @click="login">ENTER</button>

            <p class="text-red-600 text-lg font-bold text-center" v-if="failed">Credenziali errate</p>
        </div>
    </main>
</template>

<script>
import { useStatesStore } from '~~/store/states';

export default {
    data() {
        return {
            menu: [],
            username: '',
            password: '',
            failed: false,
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

    methods: {
        async login() {
            if (!this.username || !this.password) {
                return;
            }
            this.failed = false;
            this.isBusy = true;
            try {
                const response = await fetch('/api/login', {
                    method: 'POST',
                    body: JSON.stringify({
                        username: this.username,
                        password: this.password,
                    }),
                });
                const data = await response.json();
                if (data.error) {
                    this.error = `There has been an error\n${data.error}`;
                    console.log(data.error);
                    this.failed = true;
                } else if (data) {
                    this.setUserMenu(data);
                }
            } catch (error) {
                this.error = error;
                console.log(error);
                this.failed = true;
            }
            this.isBusy = false;
        },

        setUserMenu(data) {
            const menu = this.menuItems(data);
            const store = useStatesStore();
            store.userLogin(menu);
            // TODO: user options
            // store.setOptions(found.options);
        },

        menuItems(data) {
            const included = data?.included || [];
            let items = [];
            for (const item of included) {
                const title = item?.attributes?.title;
                const description = item?.attributes?.description;
                let link = null;
                if (item?.type === 'features') {
                    link = `/${item?.attributes?.feature_type}`;
                } else if (item?.type === 'collections') {
                    link = `/chatbot/${item?.attributes?.uname}`;
                }
                if (link) {
                    items.push({link, title, description});
                }
            }

            return items;
        },
    },
}
</script>
