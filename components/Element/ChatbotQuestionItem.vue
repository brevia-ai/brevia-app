<template>
<div>
    <div class="p-4 sm:p-6 bg-slate-900 text-white shadow-md rounded" v-if="editMode">
        <FormChatbotQuestion :item="item" @close="editMode = false" />
    </div>

    <div v-else>
        <div class="px-3.5 pt-3.5 pb-4 flex items-start justify-between space-x-4
            bg-gradient-to-br from-slate-700 to-slate-950 text-white">
            <h2 class="text-lg leading-snug break-words">{{ item.attributes.title }}</h2>

            <button class="text-sky-500" @click="editMode = true">
                <Icon name="carbon:pen" class="text-2xl" />
                <span class="sr-only">{{ $t('EDIT') }}</span>
            </button>
        </div>

        <div class="pl-3.5 pr-2 flex gap-4 cursor-pointer bg-white hover:bg-sky-50 text-sky-800"
            @click="expanded = !expanded">
            <div class="my-3" :class="{'text-sm line-clamp-1': !expanded}"
                v-html="item.attributes.body"></div>

            <button class="text-sky-600 leading-none">
                <Icon name="carbon:caret-down" class="text-4xl" v-if="!expanded" />
                <Icon name="carbon:caret-up" class="text-4xl" v-else />
                <span class="sr-only">{{ $t('EDIT') }}</span>
            </button>
        </div>
    </div>
</div>
</template>

<script lang="ts" setup>
defineProps({
    item: {
        type: Object,
        required: true,
    },
});

const expanded = ref(false);
const editMode = ref(false);
</script>
