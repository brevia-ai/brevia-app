<template>
    <ClientOnly>
        <head> <title>Chatlas</title> </head>
    </ClientOnly>
    <main class="space-y-8">
        <div class="p-4 bg-neutral-200 rounded space-y-3">
            <div class="text-sm text-neutral-600">
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Reiciendis perferendis, repudiandae beatae nisi voluptas magni! Sint fugit, temporibus dolores exercitationem nobis repellat.</p>
            </div>

            <div v-if="dialog.length">
                <hr class="my-6 border-neutral-300">

                <div class="flex flex-col space-y-6 pb-4">
                    <div class="bubble" v-for="(item, i) in dialog" :key="i">
                        <div>{{ item.who }}</div>
                        <p>{{ item.message }}</p>
                    </div>
                </div>
            </div>
        </div>

        <div class="flex space-x-4">
            <input class="grow text-lg p-2 rounded disabled:bg-neutral-400" type="text"
                ref="prompt"
                :disabled="isBusy"
                @keydown.enter="submit">

            <button class="bg-sky-700 text-white px-4 rounded disabled:bg-neutral-400" :disabled="!apiUrl || isBusy">
                <span class="md:hidden">›</span>
                <span class="hidden md:inline">invia</span>
            </button>
        </div>
   </main>
</template>

<script>
export default {
    data() {
        return {
            apiUrl: '',
            sessionId: '',
            collection: '',

            isBusy: false,
            hasAnswer: false,
            dialog: [],
        }
    },

    created() {
        const config = useRuntimeConfig();
        this.apiUrl = config.public.apiUrl;
        if (process.client) {
            this.sessionId = self.crypto.randomUUID();
        }
    },

    methods: {
        async submit() {
            if (!this.apiUrl)
                return;

            this.isBusy = true;
            const prompt = this.$refs['prompt'].value;
            this.$refs['prompt'].value = '';

            this.dialog.push( this.dialogItem('me', prompt) );

            try {
                const response = await fetch(this.apiUrl, {
                    method: 'POST',
                    headers: {
                        'Content-type': 'application/json',
                        'X-Chat-Session': this.sessionId,
                    },
                    body: JSON.stringify({
                        question: prompt,
                        collection: this.collection,
                    })
                });

                if (response.ok) {
                    const data = await response.json();
                    const parsedData = data.bot.trim();
                    this.dialog.push( this.dialogItem('him', parsedData) );
                } else {
                    const err = await response.text();

                    messageDiv.innerHTML = 'Qualcosa non ha funzionato';
                    console.log(err);
                }
                this.isBusy = false;
                setTimeout(() => {
                    this.$refs['prompt'].focus();
                }, 100);
            } catch (error) {
                this.isBusy = false;
                console.log(error);
            }
        },

        dialogItem(who, message) {
            return {
                who,
                message,
            }
        }
    }
}
</script>
