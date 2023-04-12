<template>
    <ClientOnly>
        <head> <title>Chatbot - Chatlas</title> </head>
    </ClientOnly>
    <main class="space-y-8">
        <div class="p-4 bg-white shadow-md rounded space-y-3">
            <div class="text-sm text-neutral-600" v-if="hasCollection">
                <p>{{ collectionDescription }}</p>
            </div>
            <div class="text-sm text-red-600" v-else-if="!isBusy && !hasCollection">
                <p>COLLECTION non trovata.</p>
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
                :disabled="!isReady"
                @keydown.enter="submit">

            <button class="px-4 button shadow-md disabled:shadow-none"
                :disabled="!isReady"
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
            sessionId: '',
            collection: '',

            hasCollection: false,
            collectionDescription: '', // collection
            isBusy: false,
            hasAnswer: false,
            dialog: [],
            collections: [],
        }
    },

    watch: {
        collection() {
            this.readCollections();
        }
    },

    created() {
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

    computed: {
        apiUrl() {
            const apiUrl = this.$config.public?.apiUrl?.trim();
            if (!apiUrl) {
                console.error('API url not set via `API_BASE_URL` env var');
            }
            return apiUrl;
        },
        isReady() {
            return !this.isBusy && this.hasCollection;
        },
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
            const promptUrl = this.apiUrl + '/prompt';

            try {
                const response = await fetch(promptUrl, {
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

        async readCollections() {
            this.isBusy = true;
            const collectionsUrl = this.apiUrl + '/collections';
            try {
                const response = await fetch(collectionsUrl, {
                    method: 'GET',
                });

                if (!response.ok) {
                    const err = await response.text();
                    this.isBusy = false;
                    this.dialog.push(this.dialogItem('CHATLAS', 'Qualcosa è andato storto', true) );
                    console.log(err);

                    return;
                }

                const data = await response.json();
                this.collections = data;
                const coll = this.collections.find((x) => x.name === this.collection);
                this.hasCollection = !!coll;
                this.collectionDescription = coll?.description;

                this.isBusy = false;
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
        },
    }
}
</script>
