<template>
    <main>
        <div class="mt-6 max-w-sm mx-auto flex flex-col space-y-4">
            <input class="text-lg p-4 border border-sky-800 rounded" type="text"
                placeholder="Codice di accesso"
                v-model="code"
                ref="input"
                @keydown.enter="login">

            <button class="p-4 button text-lg" @click="login">ENTER</button>

            <p class="text-red-600 text-lg font-bold text-center" v-if="failed">Codice non valido</p>
        </div>
    </main>
</template>

<script>
import { useStatesStore } from '~~/store/states';

export default {
    data() {
        return {
            menu: [],
            code: '',
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
        login() {
            this.failed = false;
            const acl = this.$config.public?.aclMenu || []
            const found = acl.find(i => i.code === this.code);
            if (!found?.menu?.length) {
                this.code = '';
                this.failed = true;
                return;
            }

            const store = useStatesStore();
            store.userLogin(found.menu);
            store.setOptions(found.options);
        }
    }
}
</script>
