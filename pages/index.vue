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

        <div class="max-w-sm mx-auto flex flex-col space-y-3" v-if="!logged">
            <!-- <input class="text-lg p-2 border-sky-500 mb-3" type="text"
                placeholder="Username"
                v-model="user"
            > -->
            <input class="text-lg p-4 border-sky-500 mb-3" type="text"
                placeholder="Codice di accesso"
                v-model="password">

                <button class="p-4 button shadow-md mb-3"
                @click="login" >
                <span>Entra</span>
            </button>

            <p class="p-2 text-red-600 text-lg font-bold text-center" v-if="failed">Codice errato</p>
        </div>
    </main>
</template>

<script>
export default {
    data() {
        return {
            menu: [],
            password: '',
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
            const found = acl.find(
                (i) => (i.password == this.password)
            );
            this.menu = found?.menu || [];
            if (this.menu.length > 0) {
                localStorage.setItem('menu', JSON.stringify(this.menu))
                this.logged = true;
            } else {
                this.failed = true;
            }
        }
    }
}
</script>
