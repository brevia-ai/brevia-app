<template>
    <ClientOnly>
        <head> <title>Chatlas</title> </head>
    </ClientOnly>

    <main>
        <div class="grid sm:grid-cols-2 gap-8" v-if="logged">
            <NuxtLink
                class="big-button shadow-xl hover:shadow-2xl hover:shadow-sky-800"
                :to="item.link"
                v-for="(item, i) in menu" :key="i"
                >
                <div class="text-4xl font-bold" v-if="item.link != '/summary'">SC</div>
                <div class="text-4xl font-bold" v-else>DS</div>
                <div class="text-center leading-tight">
                    <slot v-if="item.link != '/summary'">
                        {{ item.title }} <span class="font-bold">chatbot</span>
                    </slot>
                    <slot v-else>
                        Document <span class="font-bold">summary</span>
                    </slot>
                </div>
            </NuxtLink>
        </div>

        <!-- LOGIN WITH CODE -->
        <div class="mt-8 max-w-sm mx-auto flex flex-col space-y-4" v-if="!logged">
            <input class="text-lg p-4 border border-sky-800 rounded" type="text"
                placeholder="Codice di accesso"
                v-model="code"
                @keydown.enter="login">

            <button class="p-4 button text-lg" @click="login">ENTER</button>

            <p class="text-red-600 text-lg font-bold text-center" v-if="failed">Codice non valido</p>
        </div>
    </main>
</template>

<script>
export default {
    data() {
        return {
            menu: [],
            code: '',
            logged: false,
            failed: false,
        }
    },

    created() {
        if (!process.client) {
            return;
        }
        this.menu = JSON.parse(localStorage.getItem('menu') || '[]');
        if (this.menu.length > 0) {
            this.logged = true;
        }
    },

    methods: {
        login() {
            this.failed = false;
            const acl = this.$config.public?.aclMenu || [];
            const found = acl.find(i => i.code == this.code);
            this.menu = found?.menu || [];
            if (this.menu.length > 0) {
                localStorage.setItem('menu', JSON.stringify(this.menu))
                this.logged = true;
                this.failed = false;
            } else {
                this.failed = true;
            }
        }
    }
}
</script>
