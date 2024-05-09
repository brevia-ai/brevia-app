<template>
    <div class="w-full">
        <div class="flex justify-between items-center pb-4 mb-4 rounded-t border-b sm:mb-5">
            <h3 class="text-xl font-semibold text-gray-900">{{ $t('DOCUMENTS') }}</h3>
            <Icon class="text-2xl hover:cursor-pointer hover:bg-sky-100" name="ph:x-bold" @click="$closeModal()"/>
        </div>
        <div class="mb-4 p-2 w-full whitespace-break-spaces overflow-y-auto max-h-[60vh]">
            <div class="flex flex-col space-y-3" v-if="documents.length > 0">
                <div v-for="(doc, n) in documents" :key="n" class="bg-sky-100 shadow-md p-3 rounded-lg ">
                    <p class="text-lg font-bold">{{ $t('DOCUMENT') }} {{ (n + 1) }}.</p>
                    <p>{{ doc.page_content }}</p>
                    <p class="font-semibold italic">Categoria <span class="text-sm font-thin italic">{{ doc.metadata.category }}</span></p>
                    <p class="font-semibold italic">{{ $t('VALID_FROM') }}:
                        <span class="text-sm font-thin italic">{{ doc.metadata.valid_from.split('-').reverse().join('/') }}</span>
                        {{ $t('VALID_TO') }}:
                        <span class="text-sm font-thin italic">{{ doc.metadata.valid_to.split('-').reverse().join('/') }}</span>
                    </p>
                    <p class="font-semibold italic" v-if="doc.metadata.file">File <span class="text-sm font-thin italic">{{ doc.metadata.file }}</span></p>
                    <a class="font-semibold italic" v-if="doc.metadata.url" :href="doc.metadata.url" target="_blank">Url: <span class="text-sm font-thin italic">{{ doc.metadata.url }}</span></a>
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
