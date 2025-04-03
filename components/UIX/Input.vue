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
      :readonly="readonly"
      v-model="model"
      @change="handleChange"
    />
  </div>
</template>

<script setup lang="ts">
const model = defineModel<string>({ default: '' });

const props = defineProps({
  label: { type: String, default: '' },
  required: { type: Boolean, default: false },
  placeholder: { type: String, default: '' },
  autocapitalize: { type: String, default: 'none' },
  autocorrect: { type: String, default: 'off' },
  autocomplete: { type: String, default: undefined },
  password: { type: Boolean, default: false },
  noTrim: { type: Boolean, default: false },
  autofocus: { type: Boolean, default: false },
  readonly: { type: Boolean, default: false },
});

const input = ref<HTMLInputElement>();
const uniqueId = useId(); // stabile per istanza

onMounted(() => {
  if (props.autofocus) {
    setTimeout(() => input.value?.focus(), 100);
  }
});

const type = computed(() => (props.password ? 'password' : 'text'));

const handleChange = () => {
  if (props.noTrim || !input.value) return;
  const trimmed = input.value.value.trim();
  if (trimmed !== model.value) {
    model.value = trimmed;
  }
};
</script>
