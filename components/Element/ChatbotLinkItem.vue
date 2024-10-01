<template>
  <div>
    <div
      v-if="editMode"
      class="p-4 sm:p-6 text-white shadow-md rounded"
      :class="{
        'bg-slate-900': linkIsIndexed && !linkIsError,
        'bg-orange-900': linkIsIndexed && linkIsError,
        'bg-red-900': !linkIsIndexed,
      }"
    >
      <FormChatbotLink
        :item="item"
        @close="
          editMode = false;
          $emit('close', true);
        "
        @index_link="indexThisLink()"
      />
    </div>

    <div v-else>
      <div
        class="px-4 pt-3.5 pb-4 flex items-start justify-between space-x-4 text-white"
        :class="{
          'bg-gradient-to-br from-slate-700 to-slate-950': linkIsIndexed && !linkIsError,
          'bg-gradient-to-br from-orange-700 to-slate-950': linkIsIndexed && linkIsError,
          'bg-gradient-to-br from-red-700 to-slate-950': !linkIsIndexed,
        }"
      >
        <div>
          <a class="text-lg leading-snug break-words break-all" target="_blank" :href="item.cmetadata?.url">{{ item.cmetadata?.url }}</a>
          <p v-if="linkIsError" class="text-xs italic">Errore nella lettura del contenuto - codice errore {{ linkIsError }}</p>
        </div>
        <div class="px-4 flex items-start justify-between space-x-4">
          <button
            v-if="linkIsIndexed"
            class="button-transparent text-white hover:from-white hover:to-white hover:text-sky-500"
            title="Chunks"
            @click.stop.prevent="$openModal('SeeDocumentChunks', { documentId: item.custom_id })"
          >
            <Icon name="ph:code-block-bold" class="text-xl" />
          </button>
          <button
            v-if="linkIsIndexed"
            class="button-transparent text-white hover:from-white hover:to-white hover:text-sky-500"
            title="Metadata"
            @click.stop.prevent="$openModal('DialogEditMetadata', { document: item })"
          >
            <Icon name="ph:code-bold" class="text-xl" />
          </button>

          <button class="text-sky-600 hover:text-sky-400" title="Edit Link" @click="editMode = true">
            <Icon name="ph:pencil-simple-bold" class="text-2xl" />
            <span class="sr-only">{{ $t('EDIT') }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
  indexed: Boolean,
  httperror: {
    type: String,
    required: false,
    default: '',
  },
});
defineEmits(['close']);
const editMode = ref(false);
const linkIsIndexed = ref(props.indexed);
const linkIsError = ref(props.httperror);

const indexThisLink = () => {
  if (!linkIsIndexed.value) linkIsIndexed.value = true;
  if (linkIsError.value) linkIsError.value = '';
};
</script>
