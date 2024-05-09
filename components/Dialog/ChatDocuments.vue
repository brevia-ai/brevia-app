<template>
    <div class="w-full">
        <div class="flex justify-between items-center pb-4 mb-4 rounded-t border-b sm:mb-5">
            <h3 class="text-xl font-semibold text-gray-900">{{ $t('DOCUMENTS_FOUND') }}</h3>
            <Icon class="text-2xl hover:cursor-pointer hover:bg-sky-100" name="ph:x-bold" @click="$closeModal()"/>
        </div>
        <div class="mb-4 p-2 w-full whitespace-break-spaces overflow-y-auto max-h-[60vh]">
            <div class="flex flex-col space-y-3" v-if="documents.length > 0">
                <div v-for="(doc, n) in documents" :key="n" class="bg-sky-100 shadow-md p-3 rounded-lg ">
                    <p class="text-lg font-bold">{{ $t('DOCUMENT') }} {{ (n + 1) }}.</p>
                    <p class="pt-2 pb-2">{{ doc.page_content }}</p>
                    <p class="font-semibold" v-if="doc.metadata.type">type: <span class="text-sm font-thin italic">{{ doc.metadata.type }}</span></p>
                    <p class="font-semibold" v-if="doc.metadata.file">file: <span class="text-sm font-thin italic">{{ doc.metadata.file }}</span></p>
                    <a class="font-semibold" v-if="doc.metadata.url" :href="doc.metadata.url" target="_blank">url: <span class="text-sm font-thin italic">{{ doc.metadata.url }}</span></a>
                    <div v-if="doc.metadata" v-for="(meta, key) in doc.metadata" :key="key">
                        <p v-if="key.toString() !== 'type' && key.toString() !== 'file' && key.toString() !== 'url'">
                            <span class="font-semibold">{{ key }}:</span> <span class="text-sm font-thin italic">{{ meta }}</span>
                        </p>
                    </div>
                </div>
            </div>
            <div class="flex flex-col space-y-3" v-else>
                <p class="text-sm font-bold">{{ $t('NO_DOCUMENTS') }}</p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const props = defineProps(['session_id', 'documents'])
const emit = defineEmits(['enlargeWindow']);
onMounted(() => {
        emit('enlargeWindow');
    });
</script>
