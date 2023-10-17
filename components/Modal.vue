<template>
<div tabindex="-1" aria-hidden="true" class="overflow-y-auto overflow-x-hidden fixed inset-0 z-50 w-full h-full">

    <!-- backdrop -->
    <div class="fixed inset-0 bg-slate-700 bg-opacity-80 transition-opacity cursor-pointer"
        @click="$closeModal"></div>

    <!-- main -->
    <div class="flex items-center sm:justify-center min-h-full p-3 sm:p-0">

        <!-- modal content -->
        <div class="pt-5 px-6 pb-6 space-y-8 relative w-full sm:max-w-lg bg-white rounded-lg shadow">

            <!-- header -->
            <header class="space-y-2">
                <div class="flex items-start justify-between space-x-4">
                    <h1 class="text-3xl leading-none">Crea un nuovo bot</h1>
                    <button type="button"
                        class="close-button"
                        @click.stop="$closeModal">
                        <Icon name="carbon:close-large" />
                        <span class="sr-only">Chiudi</span>
                    </button>
                </div>

                <p>Dai un titolo al tuo nuovo chatbot e inserisci una descrizione.</p>
            </header>

            <div class="space-y-5">
                <form class="flex flex-col space-y-6">
                    <UIXInput :label="$t('TITLE')"
                        :placeholder="$t('TITLE_PLACEHOLDER')"
                        v-model="title" @keydown.enter="create"
                        required />

                    <textarea :placeholder="$t('DESCRIPTION_PLACEHOLDER')"
                        v-model="description" rows="4"></textarea>

                    <div class="p-3 bg-neutral-100 text-center font-semibold text-brand_primary" v-if="error">
                        Si è verifcato un errore, si prega di riprovare
                    </div>

                    <button type="submit" class="button button-primary w-full max-w-lg mx-auto uppercase"
                        :class="{'is-loading': isLoading}"
                        :disabled="!title"
                        @click.stop.prevent="create">Crea chatbot</button>
                </form>
            </div>

        </div> <!-- end modal content -->

    </div>
</div>
</template>

<script lang="ts" setup>
const error = ref(false);
const isLoading = ref(false);
const title = ref('');
const description = ref('');

const create = () => {
    if (isLoading.value)
        return;

    isLoading.value = true;
    setTimeout(() => {
        isLoading.value = false;
    }, 2000);
}
</script>
