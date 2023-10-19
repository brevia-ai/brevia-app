<template>
    <!-- header -->
    <header class="space-y-2">
        <div class="flex items-start justify-between space-x-4">
            <h1 class="text-3xl text-sky-900 leading-none">{{ $t('CREATE_NEW_CHATBOT') }}</h1>
            <button type="button"
                class="close-button"
                @click.stop="$closeModal">
                <Icon name="carbon:close-large" />
                <span class="sr-only">{{ $t('CLOSE') }}</span>
            </button>
        </div>

        <p>{{ $t('GIVE_THE_NEW_CHATBOT_A_TITLE_AND_INCLUDE_A_BRIEF_DESCRIPTION') }}</p>
    </header>

    <div class="space-y-5">
        <form class="flex flex-col space-y-6" @submit="create">
            <UIXInput :label="$t('TITLE')"
                :placeholder="$t('TITLE_PLACEHOLDER')"
                autocapitalize="on"
                v-model.trim="title" @keydown.enter="create"
                required />

            <textarea :placeholder="$t('DESCRIPTION_PLACEHOLDER')"
                v-model="description" rows="4"></textarea>

            <div class="p-3 bg-neutral-100 text-center font-semibold text-brand_primary" v-if="error">
                {{ $t('AN_ERROR_OCCURRED_PLEASE_RETRY') }}
            </div>

            <button type="submit" class="button button-primary w-full max-w-lg mx-auto uppercase"
                :class="{'is-loading': isLoading}"
                :disabled="!title"
                @click.stop.prevent="create">{{ $t('CREATE') }} chatbot</button>
        </form>
    </div>
</template>

<script lang="ts" setup>
const error = ref(false);
const isLoading = ref(false);
const title = ref('');
const description = ref('');

const { $closeModal } = useNuxtApp();
const store = useStatesStore();

const create = async () => {
    if (isLoading.value)
        return;

    isLoading.value = true;
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
            params: null
        });
        store.setMenu(menu);

        isLoading.value = false;
        $closeModal();
    } catch (err) {
        error.value = true;
        isLoading.value = false;
    }
}
</script>
