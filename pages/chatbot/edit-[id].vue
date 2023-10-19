<template>
<main>
    <div class="space-y-12" v-if="collection.uuid">
        <form class="flex flex-col space-y-6" @submit="save">
            <UIXInput :label="$t('TITLE')"
                :placeholder="$t('TITLE_PLACEHOLDER')"
                autocapitalize="on"
                v-model="title" @keydown.enter="save"
                required />

            <textarea :placeholder="$t('DESCRIPTION_PLACEHOLDER')"
                v-model="description" rows="4"></textarea>

            <div class="p-3 bg-neutral-100 text-center font-semibold text-brand_primary" v-if="error">
                {{ $t('AN_ERROR_OCCURRED_PLEASE_RETRY') }}
            </div>

            <div class="flex justify-between space-x-4">
                <NuxtLink class="button button-secondary"
                    :disabled="!title"
                    :to="collectionName">{{ $t('CANCEL') }}</NuxtLink>

                <button type="submit" class="button button-primary uppercase"
                    :class="{'is-loading': isLoading}"
                    :disabled="!title"
                    @click.stop.prevent="save">{{ $t('SAVE') }} chatbot</button>
            </div>
        </form>
    </div>
</main>
</template>

<script lang="ts" setup>
useHead({ title: 'Edit Chatbot | Brevia', });

const store = useStatesStore();
const route = useRoute();
const collectionName = route.params.id as string;

const collection = ref<{name?: string, uuid?: string, cmetadata?: any}>({});
const error = ref(false);
const isLoading = ref(false);
const title = ref('');
const description = ref('');

const data = await $fetch(`/api/collections?name=${collectionName}`);
collection.value = data.find((x: any) => x.name === collectionName);
if (!collection.value?.uuid) {
    throw createError({
        statusCode: 404,
        message: 'not found',
        fatal: true
    });
}

title.value = collection.value.cmetadata?.title || '';
// converts HTML to text, TODO: implement rich text editor or for more advanced convertion https://www.npmjs.com/package/html-to-text
description.value = new DOMParser().parseFromString(collection.value.cmetadata?.description, "text/html").documentElement.textContent || '';


const save = async () => {
    if (isLoading.value)
        return;

    isLoading.value = true;
    try {
        await $fetch('/api/collection', {
            method: 'PATCH',
            body: {
                id: String(collection.value.cmetadata?.id),
                attributes: {
                    title: title.value,
                    description: description.value,
                },
            },
        });

        isLoading.value = false;

        // update menu
        const menu = store.getMenu();
        const newMenu = menu.map((item: any) => {
            if (item.type === 'chatbot' && item.link === `/chatbot/${collectionName}`) {
                item.title = title.value;
                item.description = description.value;
            }

            return item;
        });

        store.setMenu(newMenu);
    } catch (err) {
        error.value = true;
        isLoading.value = false;
    }
}
</script>
