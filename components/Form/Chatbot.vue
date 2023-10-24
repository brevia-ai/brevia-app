<template>
<form class="flex flex-col space-y-6" @submit="save">
    <UIXInput :label="$t('TITLE')"
        :placeholder="$t('TITLE_PLACEHOLDER')"
        autocapitalize="on"
        v-model.trim="title" @keydown.enter="save"
        autofocus
        required />

    <textarea :placeholder="$t('DESCRIPTION_PLACEHOLDER')"
        v-model="description" rows="4"></textarea>

    <div class="p-3 bg-neutral-100 text-center font-semibold text-brand_primary" v-if="error">
        {{ $t('AN_ERROR_OCCURRED_PLEASE_RETRY') }}
    </div>

    <div :class="{'flex justify-between space-x-4': collection?.name}">
        <NuxtLink class="button button-secondary uppercase"
            :disabled="!title"
            :to="collection.name" v-if="collection?.name">{{ $t('EXIT') }}</NuxtLink>

        <button type="submit" class="button button-primary uppercase"
            :class="{
                'w-full max-w-lg mx-auto': !collection?.name,
                'is-loading': isLoading
            }"
            :disabled="!title"
            @click.stop.prevent="save">
                <template v-if="collection?.name">{{ $t('SAVE') }}</template>
                <template v-else>{{ $t('CREATE') }}</template>
                chatbot
        </button>
    </div>
</form>
</template>

<script lang="ts" setup>
const props = defineProps({
    collection: {
        type: Object,
        default: null,
    },
    isModal: {
        type: Boolean,
        default: false,
    },
});

const error = ref(false);
const isLoading = ref(false);
const title = ref('');
const description = ref('');

const { $closeModal, $html2text } = useNuxtApp();
const store = useStatesStore();

if (props.collection) {
    title.value = props.collection.cmetadata?.title || '';
    description.value = $html2text(props.collection.cmetadata?.description);
}

const emit = defineEmits(['saveTitle', 'saveDescription']);

// methods
const save = async () => {
    if (isLoading.value)
        return;

    isLoading.value = true;
    if (props.collection) {
        await update();
        emit('saveTitle', title.value);
        emit('saveDescription', description.value);
    } else {
        await create();
    }
    isLoading.value = false;

    if (props.isModal)
        $closeModal();
}

const create = async () => {
    try {
        const data = await $fetch('/api/collection', {
            method: 'POST',
            body: {
                title: title.value,
                description: description.value,
            },
        });

        const menu = store.getMenu();
        menu.push({
            link: `/chatbot/${data.data?.attributes?.uname}`,
            type: 'chatbot',
            title: data.data?.attributes?.title,
            description: data.data?.attributes?.description,
            params: null,
            edit: ItemEditLevel.ReadWrite,
        });
        store.setMenu(menu);

    } catch (err) {
        error.value = true;
    }
}

const update = async () => {
    try {
        await $fetch('/api/collection', {
            method: 'PATCH',
            body: {
                id: String(props.collection.cmetadata?.id),
                attributes: {
                    title: title.value,
                    description: description.value,
                },
            },
        });

        // update menu
        const menu = store.getMenu();
        const newMenu = menu.map((item: any) => {
            if (item.type === 'chatbot' && item.link === `/chatbot/${props.collection.name}`) {
                item.title = title.value;
                item.description = description.value;
            }

            return item;
        });

        store.setMenu(newMenu);
    } catch (err) {
        error.value = true;
    }
}
</script>
