<template>
<div class="space-y-8 leading-tight">
    <div class="text-center space-y-4">
        <p class="text-lg">{{ $t('EDIT_METADATA') }}</p>
    </div>

    <template v-if="loaded">
        <div class="flex justify-center" v-if="properties.length == 0">
            <span class="font-semibold">{{ $t('NO_METADATA') }}</span>
        </div>

        <div class="flex justify-center" v-else-if="properties && !docsFound">
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
    </template>
    <template v-else>
        <div class="h-28 flex">
            <svg aria-hidden="true" class="mx-auto mt-4 h-16 animate-spin fill-blue-600" viewBox="0 0 100 101" xmlns="http://www.w3.org/2000/svg"><path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/><path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/></svg>
        </div>
    </template>
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
const loaded = ref(false);

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
        loaded.value = true;
    } catch (error) {
        console.log(error);
        loaded.value = true;
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
