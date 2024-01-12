<template>
<div class="space-y-8 leading-tight">
    <div class="text-center space-y-4">
        <p class="text-lg">{{ $t('EDIT_METADATA') }}</p>
    </div>

    <div class="flex flex-col space-y-2.5">
        <div class="flex flex-col space-y-1" v-for="(meta, name, index) in properties">

            <slot v-if="isSelect(meta)">
                <label class="flex items-center space-x-2" for="item_{{ index}}">{{ name }}</label>
                <select name="item_{{ index}}" id="item_{{ index}}" v-model="metadata[name]">
                    <option v-for="(item, index) in meta.enum" :value="item">{{ item }}</option>
                </select>

            </slot>

            <slot v-if="isDate(meta)">
                <label class="flex items-center space-x-2">
                    <span>{{ name }}</span>
                    <input type="text" name="item_{{ index}}" id="item_{{ index}}" v-model="metadata[name]">
                </label>
            </slot>

            <slot v-if="isCheckbox(meta)">
                <label class="flex items-center space-x-2">
                    <span>{{ name }}</span>
                    <input type="checkbox" name="item_{{ index}}" id="item_{{ index}}" v-model="metadata[name]">
                </label>
            </slot>
        </div>
    </div>


    <div class="flex justify-between space-x-4">
        <button class="button button-secondary uppercase" @click="$closeModal">{{ $t('CANCEL') }}</button>

        <button class="button button-danger uppercase"
            @click="updateMetadata">
            {{ $t('SAVE') }}
        </button>
    </div>
</div>
</template>

<script lang="ts" setup>
const props = defineProps({
    document: {
        type: Object,
        default: {},
    },
});

const statesStore = useStatesStore();

const metadata = ref({});

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
</script>
