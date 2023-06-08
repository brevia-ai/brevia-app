<template>
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

        <div class="flex flex-col space-y-3" v-if="!isBusy && docs.length > 0">
            <div class="text-xl">
                <p>Documenti</p>
            </div>
            <div v-for="(doc, n) in docs" :key="n">
                <p class="text-xs">{{ (n + 1) }}.</p>
                <p>{{ doc.page_content }}</p>
                <p class="text-xs italic">{{ doc.metadata }}</p>
            </div>
        </div>
    </main>
</template>

<script setup>
    useHead({ title: 'Chatbot | Chatlas', });
</script>

<script>
import { useRoute } from 'vue-router';
import { useStatesStore } from '~~/store/states';

export default {
    data() {
        return {
            sessionId: '',
            collection: '',

            hasCollection: false,
            collectionDescription: '', // collection
            isBusy: false,
            hasAnswer: false,
            lastPrompt: '',
            sourceDocs: false,
            docs: [],
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
        const store = useStatesStore();
        store.readOptions();
        this.sourceDocs = Boolean(store.options?.['chatbotDocs']);
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
            this.lastPrompt = this.$refs['prompt']?.value?.trim();
            this.$refs['prompt'].value = '';
            if (!this.lastPrompt || !this.apiUrl) {
                return;
            }
            this.isBusy = true;

            this.dialog.push( this.dialogItem('YOU', this.lastPrompt) );
            const promptUrl = this.apiUrl + '/prompt';

            try {
                const response = await fetch(promptUrl, {
                    method: 'POST',
                    headers: {
                        'Content-type': 'application/json',
                        'X-Chat-Session': this.sessionId,
                    },
                    body: JSON.stringify({
                        question: this.lastPrompt,
                        collection: this.collection,
                        source_docs: this.sourceDocs,
                    })
                });

                if (response.ok) {
                    const data = await response.json();
                    const parsedData = data.bot.trim();
                    this.docs = data.docs || [];
                    this.viewDocs();
                    this.dialog.push( this.dialogItem('CHATLAS', parsedData) );
                } else {
                    const err = await response.text();
                    this.showErrorMessage();
                    console.log(err);
                }

                this.isBusy = false;
                setTimeout(() => {
                    this.$refs['prompt'].focus();
                }, 100);
            } catch (error) {
                this.isBusy = false;
                this.showErrorMessage();
                console.log(error);
            }
        },

        viewDocs() {
            if (!this.sourceDocs) {
                return;
            }
            console.log('DOCUMENTI TROVATI per "' + this.lastPrompt + '"')
            this.docs.forEach((doc, i) => {
                console.log('\n\n' + (i + 1) + ').');
                console.log(doc.page_content);
                console.log(doc.metadata);
            });
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
                    this.showErrorMessage();
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

        showErrorMessage() {
            this.dialog.push(this.dialogItem('CHATLAS', 'Qualcosa è andato storto', true) );
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
