<template>
  <div class="flex flex-col space-y-2">
    <label v-if="label" class="flex align-top leading-none space-x-1" :for="uniqueId">
      <span>{{ label }}</span>
      <Icon v-if="required" name="ph:star-fill" size="12" class="text-pink-600" />
    </label>

    <input
      :id="uniqueId"
      ref="input"
      :type="type"
      class="w-full"
      :autocapitalize="autocapitalize"
      :autocorrect="autocorrect"
      :autocomplete="autocomplete"
      :placeholder="placeholder"
      :required="required"
      :value="modelValue"
      :readonly="readonly"
      @input="handleInput"
      @change="handleChange"
    />
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
    default: null,
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
    default: null,
  },
  password: {
    type: Boolean,
    default: false,
  },
  noTrim: {
    type: Boolean,
    default: false,
  },
  autofocus: {
    type: Boolean,
    default: false,
  },
  readonly: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();

const input = ref<HTMLInputElement>();
onMounted(() => {
  if (props.autofocus) {
    setTimeout(() => {
      input.value?.focus();
    }, 100);
  }
});

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit('update:modelValue', target.value);
};

const handleChange = (event: Event) => {
  if (props.noTrim) return;

  const target = event.target as HTMLInputElement;
  target.value = target.value.trim();
  emit('update:modelValue', target.value);
};

const uniqueId = computed(() => 'input-text-' + Date.now().toString(36) + Math.random().toString(36).substring(2));
const type = computed(() => (props.password ? 'password' : 'text'));
</script>
