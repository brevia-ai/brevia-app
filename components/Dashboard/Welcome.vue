<template>
  <div class="grow w-full max-w-lg mx-auto p-8 sm:p-16 sm:bg-white sm:shadow-lg rounded space-y-5">
    <h1 class="text-lg">
      <i18n-t keypath="HELLO">
        <template #name
          ><span class="font-bold">{{ user?.name }} {{ user?.surname }}</span
          >,</template
        >
      </i18n-t>
    </h1>

    <div>
      <p>{{ $t('WELCOME_ON_BREVIA') }}.</p>

      <div v-if="addEnabled" class="space-y-16">
        <p>{{ $t('DASHBOARD_EMPTY') }}.</p>

        <div class="w-48 mx-auto">
          <button class="w-full flex flex-col items-center space-y-2 hover:text-sky-500" @click="$openModal('DialogNewChatbot')">
            <Icon name="ph:plus-bold" size="128" />
            <span>{{ $t('CREATE_NEW_CHATBOT') }}</span>
          </button>
        </div>
      </div>

      <div v-else>
        <p>{{ $t('NO_AI_TOOL_HAS_BEEN_SET_UP_JUST_FOR_YOU') }}.</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
defineProps({
  user: {
    type: Object,
    required: true,
  },

  addEnabled: {
    type: Boolean,
    default: true,
  },
});
</script>
