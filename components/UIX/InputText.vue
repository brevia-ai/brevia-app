<template>
<div class="flex flex-col space-y-2">
    <label class="flex align-top leading-none space-x-1" :for="uniqueId">
        <span>{{ label }}</span>
        <Icon name="carbon:star-filled" size="12" class="text-red-600" v-if="required" />
    </label>

    <input :type="type" class="block w-full rounded-md border px-3.5 py-2 shadow-sm sm:text-sm sm:leading-6"
        :id="uniqueId"
        :autocapitalize="autocapitalize"
        :autocorrect="autocorrect"
        :autocomplete="autocomplete"
        :placeholder="placeholder"
        :required="required"
        @input="handleInput">
</div>
</template>

<script lang="ts" setup>
const props = defineProps({
    modelValue: {
        type: String,
        default: '',
    },
    label: {
        type: String,
        required: true,
    },
    required: {
        type: Boolean,
        default: false,
    },
    placeholder: {
        type: String,
        default: '',
    },
    autocapitalize: {
        type: String,
        default: 'none',
    },
    autocorrect: {
        type: String,
        default: 'off',
    },
    autocomplete: {
        type: String,
        default: false,
    },
    password: {
        type: Boolean,
        default: false,
    },
});

const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void
}>();

const handleInput = (event: Event) => {
    const target = event.target as HTMLInputElement;
    emit('update:modelValue', target.value);
};

const uniqueId = computed(() => 'input-text-' + Date.now().toString(36) + Math.random().toString(36).substring(2));
const type = computed(() => props.password? 'password' : 'text');
</script>
