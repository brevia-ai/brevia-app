<template>
    <ClientOnly>
        <head> <title>Chatlas</title> </head>
    </ClientOnly>
    <main class="space-y-8">
        <div class="p-4 bg-white shadow-md rounded space-y-3">
            <div class="text-sm text-neutral-600">
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Reiciendis perferendis, repudiandae beatae nisi voluptas magni! Sint fugit, temporibus dolores exercitationem nobis repellat.</p>
            </div>

            <div v-if="dialog.length">
                <hr class="my-6 border-neutral-300">

                <div class="flex flex-col space-y-6 pb-4">
                    <div class="bubble space-y-2" v-for="(item, i) in dialog" :key="i" :class="{ 'bg-pink-800': item.error}">
                        <p class="text-xs">{{ item.who }}</p>
                        <p>{{ item.message }}</p>
                    </div>

                    <div class="loading" v-if="isBusy"></div>
                </div>
            </div>
        </div>

        <div class="flex space-x-4">
            <input class="grow text-lg p-2 rounded border border-sky-500 disabled:bg-neutral-100 disabled:border-neutral-300 shadow-md" type="text"
                ref="prompt"
                :disabled="isBusy"
                @keydown.enter="submit">

            <button class="px-4 button shadow-md disabled:shadow-none"
                :disabled="!isBusy"
                @click="submit">
                <span class="md:hidden">›</span>
                <span class="hidden md:inline">invia</span>
            </button>
        </div>
   </main>
</template>

<script>
import { useRoute } from 'vue-router';

export default {
    data() {
        return {
            apiUrl: '',
            sessionId: '',
            collection: '',

            isBusy: false,
            hasAnswer: false,
            dialog: [],
        }
    },

    created() {
        const config = useRuntimeConfig();
        this.apiUrl = config.public.apiUrl;
        if (process.client) {
            this.sessionId = self.crypto.randomUUID();
            const route = useRoute();
            this.collection = route.params.id;
        }
    },

    mounted() {
        setTimeout(() => {
            this.$refs['prompt'].focus();
        }, 100);
    },

    methods: {
        async submit() {
            const prompt = this.$refs['prompt']?.value?.trim();
            this.$refs['prompt'].value = '';
            if (!prompt || !this.apiUrl) {
                return;
            }
            this.isBusy = true;

            this.dialog.push( this.dialogItem('YOU', prompt) );

            try {
                const response = await fetch(this.apiUrl, {
                    method: 'POST',
                    headers: {
                        'Content-type': 'application/json',
                        'X-Chat-Session': this.sessionId,
                    },
                    body: JSON.stringify({
                        question: prompt,
                        collection: this.collection,
                    })
                });

                if (response.ok) {
                    const data = await response.json();
                    const parsedData = data.bot.trim();
                    this.dialog.push( this.dialogItem('CHATLAS', parsedData) );
                } else {
                    const err = await response.text();
                    this.dialog.push( this.dialogItem('CHATLAS', 'Qualcosa è andato storto', true) );
                    console.log(err);
                }

                this.isBusy = false;
                setTimeout(() => {
                    this.$refs['prompt'].focus();
                }, 100);
            } catch (error) {
                this.isBusy = false;
                console.log(error);
            }
        },

        dialogItem(who, message, error = false) {
            return {
                who,
                message,
                error,
            }
        }
    }
}
</script>
