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
        <FormChatbot isModal />
    </div>
</template>
