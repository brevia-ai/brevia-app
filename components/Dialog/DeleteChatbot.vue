<template>
    <!-- header -->
    <header class="space-y-2">
        <div class="flex items-start justify-between space-x-4">
            <h1 class="text-3xl text-sky-900 leading-none">{{ $t('DELETE') }} chatbot</h1>
            <button type="button"
                class="close-button"
                @click.stop="$closeModal">
                <Icon name="carbon:close-large" />
                <span class="sr-only">{{ $t('CLOSE') }}</span>
            </button>
        </div>
    </header>

    <div class="space-y-8">
        <div class="space-y-4">
            <p class="text-lg">
                {{ $t('ARE_YOU_SURE_YOU_WANT_TO_DELETE_THIS') }} chatbot?
            </p>

            <div class="space-y-2 text-sm">
                <p>{{ $t('THE_FOLLOWING_WILL_ALSO_BE_ELIMINATED') }}</p>
                <ul class="list-square list-inside">
                    <li>{{ $t('ALL_DOWNLOADED_DOCUMENTS_RELATED_TO_THIS') }} chatbot</li>
                    <li>{{ $t('THE_WHOLE_SET_OF_PERSONALISED_QUESTIONS_AND_ANSWERS_RELATED_TO_THIS') }} chatbot</li>
                </ul>
            </div>
        </div>

        <div class="flex justify-between space-x-4">
            <button type="submit" class="button button-danger uppercase" @click="deleteChatbot">
                {{ $t('DELETE') }} chatbot
            </button>

            <button class="button button-secondary uppercase" @click="$closeModal">{{ $t('CANCEL') }}</button>
        </div>
    </div>
</template>

<script lang="ts" setup>
const { $closeModal } = useNuxtApp();

onMounted(() => {
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            $closeModal();
        }
    });
});

const deleteChatbot = () => {
    $closeModal();
}
</script>
