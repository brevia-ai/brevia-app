<template>
<div>
    <div class="p-4 sm:p-6 bg-slate-900 text-white shadow-md rounded" v-if="editMode">
        <FormChatbotQuestion :item="item" :collection-id="collectionId"
            @close="editMode = false; $emit('close', true)" />
    </div>

    <div v-else>
        <div class="px-4 pt-3.5 pb-4 flex items-start justify-between space-x-4
            bg-gradient-to-br from-slate-700 to-slate-950 text-white">
            <h2 class="text-lg leading-snug break-words">{{ item.attributes.title }}</h2>

            <div class="px-4 flex items-start justify-between space-x-4">
                <button class="button-transparent text-white hover:from-white hover:to-white hover:text-sky-500"
                    @click.stop.prevent="$openModal('DialogEditMetadata', {document: item})">
                    <Icon name="ph:code-bold" class="text-xl" />
                </button>

                <button class="text-sky-600 hover:text-sky-400" @click="editMode = true">
                    <Icon name="ph:pencil-simple-bold" class="text-2xl" />
                    <span class="sr-only">{{ $t('EDIT') }}</span>
                </button>
            </div>

        </div>

        <div class="pl-3.5 pr-2.5 flex justify-between gap-4 cursor-pointer bg-white hover:bg-sky-50 text-sky-800"
            @click="expanded = !expanded">
            <div class="my-3" :class="{'text-sm line-clamp-1': !expanded}"
                v-html="item.attributes.body || '&nbsp;'"></div>

            <button class="text-sky-600 leading-none" v-if="item.attributes.body">
                <Icon name="ph:caret-down-bold" class="text-4xl" v-if="!expanded" />
                <Icon name="ph:caret-up-bold" class="text-4xl" v-else />
                <span class="sr-only">{{ $t('EDIT') }}</span>
            </button>
        </div>
    </div>
</div>
</template>

<script lang="ts" setup>
defineProps({
    collectionId: {
        type: [ String, Number ],
        required: true,
    },
    item: {
        type: Object,
        required: true,
    },
});

const expanded = ref(false);
const editMode = ref(false);

const highlight = (htmltext: string, part: string) => {
    if (!htmltext.includes(part)) {
        return htmltext;
    }
    const partIdx = htmltext.indexOf(part);

    return `${htmltext.substring(0, partIdx)}<span class='bg-sky-900 text-white'>${part}</span>${htmltext.substring(partIdx + part.length)}`;
}
</script>
