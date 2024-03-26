<template>
<div class="space-y-8 leading-tight">
    <div class="text-center space-y-4">
        <p class="text-lg">{{ $t('EDIT_METADATA') }}</p>
    </div>

    <div class="flex justify-center" v-if="properties.length == 0">
        <span class="font-semibold">{{ $t('NO_METADATA') }}</span>
    </div>

    <div class="flex justify-center" v-else-if="!docsFound && properties.length == 0">
        <span class="font-semibold">{{ $t('NO_INDEXED_DOCUMENTS') }}</span>
    </div>

    <div class="flex flex-col space-y-2.5" v-else>
        <div class="mx-12 content-start grid grid-cols-2 gap-2" v-for="(meta, name, index) in properties">

            <slot v-if="isSelect(meta)">
                <label class="items-center space-x-2 justify-end py-1" for="item_{{ index}}">{{ name }}</label>
                <select class="justify-self-start border rounded border-slate-300 p-1" name="item_{{ index}}" id="item_{{ index}}" v-model="metadata[name]">
                    <option v-for="(item, index) in meta.enum" :value="item">{{ item }}</option>
                </select>
            </slot>

            <slot v-if="isDate(meta)">
                <label class="flex items-center space-x-2">
                    <span>{{ name }}</span>
                    <!-- <input type="text" name="item_{{ index}}" id="item_{{ index}}" v-model="metadata[name]"> -->
                </label>
                <VueDatePicker v-model="metadata[name]"
                    :range="false"
                    :enable-time-picker="false"
                    text-input position="center"
                    model-type="yyyy-MM-dd"
                    :format="formatDate">
                </VueDatePicker>
            </slot>

            <slot v-if="isCheckbox(meta)">
                <label class="flex flex-row items-center space-x-2">
                    <span>{{ name }}</span>
                </label>
                <input type="checkbox" class="justify-self-start" name="item_{{ index}}" id="item_{{ index}}" v-model="metadata[name]">
            </slot>
            <span class="w-full mt-0 text-xs font-semibold opacity-75">{{ meta?.description }}</span>
        </div>
    </div>

    <div class="flex justify-center space-x-4">
        <button class="button button-secondary uppercase" @click="$closeModal">{{ $t('CANCEL') }}</button>

        <button class="button button-danger uppercase"
            @click="updateMetadata"
            :disabled="properties.length == 0 || !docsFound">
            {{ $t('SAVE') }}
        </button>
    </div>
</div>
</template>

<script lang="ts" setup>
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
const props = defineProps({
    document: {
        type: Object,
        default: {},
    },
});

const statesStore = useStatesStore() as any;

const metadata = ref<any>({});
const docsFound = ref(false);

// documents metadata JSON Schema
const schema = statesStore.collection?.cmetadata?.documents_metadata || {};
const properties = schema?.properties || [];
const error = ref(false);

onBeforeMount(async () => {
    try {
        const response = await fetch(
            `/api/brevia/index/${statesStore.collection?.uuid}/${props.document.id}`
        )
        const data = await response.json();
        docsFound.value = (data?.length || 0) > 0;
        metadata.value = data?.[0]?.cmetadata || {};
    } catch (error) {
        console.log(error);
    }
});

const { $closeModal } = useNuxtApp();

const isSelect = (prop: any) => {
    return prop?.type == 'string' && prop?.enum;
}

const isDate = (prop: any) => {
    return prop?.type == 'string' && prop?.format == 'date';
}

const isCheckbox = (prop: any) => {
    return prop?.type == 'boolean';
}


const updateMetadata = async () => {
    try {
        await $fetch('/api/brevia/index/metadata', {
            method: 'POST',
            body: {
                collection_id: statesStore.collection?.uuid || '',
                document_id: props.document.id,
                metadata: metadata.value,
            },
        });
        $closeModal();

    } catch (err) {
        console.log(err);
        error.value = true;
    }
}

const formatDate = (date: any) => {

    if(!date) {
        return ``
    }
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
}
</script>
