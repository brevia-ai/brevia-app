<template>
<div class="space-y-8 leading-tight">
    <div class="text-center space-y-4">
        <Icon name="ph:plus-circle-bold" class="text-6xl text-sky-800" />
        <p class="text-lg">{{ $t('CREATE_NEW_CHATBOT') }}</p>
        <p>{{ $t('GIVE_THE_NEW_CHATBOT_A_TITLE_AND_INCLUDE_A_BRIEF_DESCRIPTION') }}</p>
    </div>

    <FormChatbot isModal />
</div>
</template>
