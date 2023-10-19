<template>
    <main>
        <div class="text-red-600" v-if="!collectionName">
            <p>{{ $t('COLLECTION_NOT_FOUND') }}</p>
        </div>

        <div class="space-y-8" v-else>
            <div class="space-y-6">
                <h2 class="text-2xl md:text-3xl lg:text-4xl leading-tight font-bold">{{ collection.cmetadata?.title }}</h2>
                <div class="text-neutral-600"
                    v-html="collection.cmetadata?.description" v-if="collection.cmetadata?.description"></div>
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

            <div class="space-y-4">
                <div class="flex space-x-4">
                    <input type="text"
                        class="grow text-lg p-2 rounded border border-sky-500 disabled:bg-neutral-100 disabled:border-neutral-300 shadow-md"
                        ref="input"
                        v-model.trim="prompt"
                        :disabled="isBusy"
                        @keydown.enter="submit">

                    <button class="px-6 button shadow-md disabled:shadow-none"
                        :disabled="isBusy"
                        @click="submit">
                        <span class="sm:hidden">›</span>
                        <span class="hidden sm:inline">{{ $t('SEND') }}</span>
                    </button>
                </div>

                <div class="flex space-x-4">
                    <label class="grow text-lg space-x-2 cursor-pointer">
                        <input type="checkbox" v-model="showDocs" :disabled="isBusy">
                        <span>{{ $t('SHOW_DOCUMENTS_FOUND') }}</span>
                    </label>
                </div>
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

<script lang="ts" setup>
useHead({ title: 'Chatbot | Brevia', });

interface DialogItem {
    who: string;
    message: string;
    error: boolean;
}

const { t } = useI18n();

const collection = ref<{name?: string, uuid?: string, cmetadata?: any}>({});
const isBusy = ref(false);
const prompt = ref('');
const input = ref<HTMLElement|null>(null);
const dialog = ref<DialogItem[]>([]);
const showDocs = ref(false);
const docs = ref<any>([]);

let sessionId = '';
let collectionName = '';

onBeforeMount(async () => {
    const route = useRoute();
    collectionName = route.params.id as string;

    // check if user has access to this page (TODO: refactor to use middleware)
    const store = useStatesStore();
    store.userAccess(`/chatbot/${collectionName}`);

    // TODO: refactor in store
    store.readOptions();

    isBusy.value = true;
    const data = await $fetch(`/api/collections?name=${collectionName}`);
    collection.value = data.find((x: any) => x.name === collectionName);

    if (!collection.value?.uuid) {
        throw createError({
            statusCode: 404,
            message: 'not found',
            fatal: true
        });
    }

    sessionId = crypto.randomUUID();
    isBusy.value = false;
});

watch(isBusy, (val) => {
    if (!val) {
        setTimeout(() => {
            input.value?.focus();
        }, 100);
    }
});

// methods
const formatDialogItem = (who: string, message: string, error = false): DialogItem => {
    return {
        who,
        message,
        error,
    }
};

const submit = async () => {
    if (!prompt.value)
        return;

    isBusy.value = true;

    dialog.value.push(formatDialogItem('YOU', prompt.value));
    dialog.value.push(formatDialogItem('CHATLAS', ''));

    const currIdx = dialog.value.length - 1;

    try {
        await streamingFetchRequest(currIdx);
        isBusy.value = false;
    } catch (error) {
        isBusy.value = false;
        showErrorInDialog(currIdx);
        console.log(error);
    }
};

const streamingFetchRequest = async (currIdx: number) => {
    const question = prompt.value;
    prompt.value = '';

    const response = await fetch('/api/prompt', {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
            'X-Chat-Session': sessionId,
        },
        body: JSON.stringify({
            question,
            collection: collectionName,
            source_docs: showDocs.value,
            streaming: true,
        }),
    });

    const reader = response?.body?.getReader();
    if (reader) {
        for await (const chunk of readChunks(reader)) {
            const text = new TextDecoder().decode(chunk);
            handleStreamText(text, currIdx);
        }
    }
};

const readChunks = (reader: ReadableStreamDefaultReader) => {
    return {
        async* [Symbol.asyncIterator]() {
            let readResult = await reader.read();
            while (!readResult.done) {
                yield readResult.value;
                readResult = await reader.read();
            }
        },
    };
};

const handleStreamText = (text: string, currIdx: number) => {
    if (text.includes('[{"page_content":')) {
        const idx = text.indexOf('[{"page_content":')
        dialog.value[currIdx].message += text.slice(0, idx);
        try {
            docs.value = JSON.parse(text.slice(idx));
            if (!showDocs.value)
                return;

            docs.value.forEach((doc: any, i: number) => {
                console.log('\n\n' + (i + 1) + ').');
                console.log(doc.page_content);
                console.log(doc.metadata);
            });
        } catch (e) {
            return console.error(e);
        }
    } else if (text.startsWith('{"error":')) {
        try {
            const err = JSON.parse(text);
            console.error(`Error response from API "${err?.error}"`);
            showErrorInDialog(currIdx);
        } catch (e) {
            return console.error(e);
        }
    } else {
        dialog.value[currIdx].message += text;
    }
};

const showErrorInDialog = (index: number) => {
    const dialogItem = formatDialogItem('CHATLAS', t('SOMETHING_WENT_WRONG'), true);

    if (index) {
        dialog.value[index] = dialogItem;
        return;
    }

    dialog.value.push(dialogItem);
};
</script>
