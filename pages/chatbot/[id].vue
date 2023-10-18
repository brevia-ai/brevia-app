<template>
    <main>
        <div class="text-red-600" v-if="!collectionId">
            <p>{{ $t('COLLECTION_NOT_FOUND') }}</p>
        </div>

        <div class="space-y-8" v-else>
            <div class="space-y-6">
                <h2 class="text-2xl md:text-3xl lg:text-4xl leading-tight font-bold">{{ collection.title }}</h2>
                <div class="text-neutral-600"
                    v-html="collection.description" v-if="collection.description"></div>
            </div>

            <div v-if="dialog.length">
                <!-- <hr class="my-6 border-neutral-300"> -->
                <div class="px-4 pt-6 pb-4 bg-white shadow-md rounded space-y-3">
                    <div class="flex flex-col space-y-6 pb-4">

                        <div class="chat-balloon space-y-2" v-for="(item, i) in dialog" :key="i" :class="{ 'bg-pink-800': item.error}">
                            <div class="flex space-x-3 justify-between">
                                <p class="text-xs">{{ item.who }}</p>
                                <div class="chat-balloon-status" :class="{'busy': isBusy && i === dialog.length - 1}"></div>
                            </div>
                            <p>{{ item.message }} &nbsp;</p>
                        </div>

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
                    <span class="hidden md:inline">{{ $t('SEND') }}</span>
                </button>
            </div>

            <div class="flex space-x-4">
                <label class="grow text-lg space-x-2 cursor-pointer">
                    <input type="checkbox" v-model="sourceDocs" :disabled="isBusy">
                    <span>{{ $t('SHOW_DOCUMENTS_FOUND') }}</span>
                </label>
            </div>


            <div class="flex flex-col space-y-3" v-if="!isBusy && docs.length > 0">
                <div class="text-xl">
                    <p>{{ $t('DOCUMENTS') }}</p>
                </div>
                <div v-for="(doc, n) in docs" :key="n">
                    <p class="text-xs">{{ (n + 1) }}.</p>
                    <p>{{ doc.page_content }}</p>
                    <p class="text-xs italic">{{ doc.metadata }}</p>
                </div>
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
            collectionId: '',
            hasCollection: false,

            collection: {},
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
        collectionId() {
            this.readCollections();
        }
    },

    created() {
        const store = useStatesStore();
        if (process.client) {
            this.sessionId = self.crypto.randomUUID();
            const route = useRoute();
            this.collectionId = route.params.id;
            store.userAccess(`/chatbot/${this.collectionId}`);
        }
        store.readOptions();
    },

    mounted() {
        setTimeout(() => {
            this.$refs['prompt']?.focus();
        }, 100);
    },

    computed: {
        isReady() {
            return !this.isBusy && this.hasCollection;
        },
    },

    methods: {
        async submit() {
            this.lastPrompt = this.$refs['prompt']?.value?.trim();
            this.$refs['prompt'].value = '';
            if (!this.lastPrompt) {
                return;
            }
            this.isBusy = true;

            this.dialog.push( this.dialogItem('YOU', this.lastPrompt) );
            this.dialog.push( this.dialogItem('CHATLAS', '') );
            const currIdx = this.dialog.length - 1;

            try {
                await this.streamingFetchRequest(currIdx);
                this.isBusy = false;
                setTimeout(() => {
                    this.$refs['prompt'].focus();
                }, 100);
            } catch (error) {
                this.isBusy = false;
                this.showErrorMessage(currIdx);
                console.log(error);
            }
        },

        async streamingFetchRequest(currIdx) {
            await fetch('/api/prompt', {
                    method: 'POST',
                    headers: {
                        'Content-type': 'application/json',
                        'X-Chat-Session': this.sessionId,
                    },
                    body: JSON.stringify({
                        question: this.lastPrompt,
                        collection: this.collectionId,
                        source_docs: this.sourceDocs,
                        streaming: true,
                    }),
                }).then(async (response) => {
                    // response.body is a ReadableStream
                    const reader = response?.body?.getReader();
                    for await (const chunk of this.readChunks(reader)) {
                        const text = new TextDecoder().decode(chunk);
                        this.handleStreamText(text, currIdx)
                    }
                });
        },

        handleStreamText(text, currIdx) {
            if (text.includes('[{"page_content":')) {
                const idx = text.indexOf('[{"page_content":')
                this.dialog[currIdx].message += text.substr(0, idx);
                try {
                    this.docs = JSON.parse(text.substr(idx));
                    this.logDocs();
                } catch (e) {
                    return console.error(e);
                }
            } else if (text.startsWith('{"error":')) {
                try {
                    const err = JSON.parse(text);
                    console.error(`Error response from API "${err?.error}"`);
                    this.showErrorMessage(currIdx);
                } catch (e) {
                    return console.error(e);
                }
            } else {
                this.dialog[currIdx].message += text;
            }
        },

        logDocs() {
            if (!this.sourceDocs) {
                return;
            }

            this.docs.forEach((doc, i) => {
                console.log('\n\n' + (i + 1) + ').');
                console.log(doc.page_content);
                console.log(doc.metadata);
            });
        },

        readChunks(reader) {
            return {
                async* [Symbol.asyncIterator]() {
                    let readResult = await reader.read();
                    while (!readResult.done) {
                        yield readResult.value;
                        readResult = await reader.read();
                    }
                },
            };
        },

        async readCollections() {
            this.isBusy = true;
            try {
                const data = await $fetch(`/api/collections?name=${this.collectionId}`);
                this.collections = data;
                const coll = this.collections.find(x => x.name === this.collectionId);
                this.hasCollection = !!coll;
                console.log(coll);
                this.collection.title = coll?.cmetadata?.title || '';
                this.collection.description = coll?.cmetadata?.description || '';

                this.isBusy = false;
            } catch (error) {
                this.isBusy = false;
                console.log(error);
            }
        },

        showErrorMessage(index) {
            if (index) {
                this.dialog[index] = this.dialogItem('CHATLAS', this.$i18n.t('SOMETHING_WENT_WRONG'), true);
            } else {
                this.dialog.push(this.dialogItem('CHATLAS', this.$i18n.t('SOMETHING_WENT_WRONG'), true) );
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
