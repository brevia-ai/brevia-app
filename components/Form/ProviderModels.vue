<template>
  <div v-if="isLoading" class="mt-16 flex flex-row justify-center">
    <ElementLoader :loader-dim="48" />
    <span class="sr-only">loading...</span>
  </div>
  <template v-else>
    <div class="mb-8">
      <!-- Api KEY -->
      <div v-if="apiKey" class="mb-4">
        <div class="flex gap-4">
          <UIXInput
            class="grow"
            v-model="apiKey.value"
            :label="$t('API_KEY')"
            :placeholder="$t('INSERT_API_KEY')"
            :password="!showApiKey"
            autocomplete="none"
          />
          <button class="button button-secondary self-end h-[3.75rem]" @click="showApiKey = !showApiKey">
            <Icon name="ph:eye" class="text-2xl" v-if="showApiKey" />
            <Icon name="ph:eye-slash" class="text-2xl" v-else />
          </button>
        </div>
      </div>

      <!-- Selected env vars -->
      <div class="mb-4">
        <div class="flex gap-4" v-for="e in envVars" :key="e.name">
          <UIXInput class="grow" v-model="e.value" :label="e.name" :placeholder="'Insert ' + e.name" />
          <button class="button button-secondary self-end h-[3.75rem]" @click="delEnvVar(e.name)">
            <Icon name="ph:trash-simple-bold" class="text-2xl" />
          </button>
        </div>
      </div>

      <!-- Available env vars -->
      <div class="mb-4" v-if="availableEnvVars.length > 0">
        <div class="flex mb-4 gap-4">
          <UIXSelect class="grow" v-model="newEnvVar" :label="$t('ADD_ENV_VAR')" :options="availableEnvVars" :placeholder="$t('SELECT_ENV_VAR')" />
          <button class="button button-secondary self-end h-[3.75rem]" @click="addEnvVar()">
            <Icon name="ph:plus-bold" class="text-2xl" />
          </button>
        </div>
      </div>
    </div>

    <!-- Models list and selection -->
    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2" v-if="modelsList.length > 0">
      <label class="p-1.5 flex items-center gap-2">
        <input type="checkbox" :indeterminate="indeterminateCheck" v-model="checkAll" />
        <span class="font-normal text-xs leading-tight">{{ $t('SELECT_ALL') }}</span>
      </label>
      <label class="p-1.5 flex items-center gap-2 bg-slate-200 rounded-sm" v-for="m in modelsList" :key="m.name">
        <input type="checkbox" v-model="m.selected" :id="`${provider}_${m.name}`" @change="updateCheckAll()" />
        <span class="text-xs leading-tight tracking-wide">{{ m.name }}</span>
      </label>
    </div>
    <div v-else>
      {{ $t('NO_MODELS_AVAILABLE') }}
    </div>

    <div class="mt-8 flex justify-between space-x-4">
      <button type="submit" class="button button-primary uppercase" :class="{ 'is-loading': saveLoading }" @click="saveProvidersConfig">
        {{ $t('SAVE') }}
      </button>
    </div>
  </template>
</template>
<script lang="ts" setup>
const props = defineProps({
  provider: {
    type: String,
    required: true,
  },
});

interface ModelSelect {
  name: string;
  selected: boolean;
}

const isLoading = ref(true);

const saveLoading = ref(false);
const showApiKey = ref(false);
const store = useProvidersStore();

const modelsList = ref<ModelSelect[]>([]);
const envVars = ref<EnvVarItem[]>([]);
const apiKey = ref<EnvVarItem | null>(null);
let changedVars = false;
const newEnvVar = ref('');

const availableEnvVars = computed(() => {
  return (
    store.knownVars
      .get(props.provider)
      ?.filter((knownVar) => !isApiKey(knownVar))
      ?.filter((knownVar) => {
        return !envVars.value.some((envVar) => envVar.name === knownVar);
      }) || []
  );
});

const isApiKey = (name: string) => {
  return name.toLowerCase().endsWith('_api_key');
};

const isApiKeyItem = (item: EnvVarItem) => {
  return isApiKey(item.name);
};

const currentEnvVars = () => {
  return (
    store.envVars
      .get(props.provider)
      ?.filter((item) => !isApiKeyItem(item))
      ?.slice() || []
  );
};

const currentApiKey = (): EnvVarItem | null => {
  const apiKeyName = store.knownVars.get(props.provider)?.find((item) => isApiKey(item));
  if (!apiKeyName) {
    return null;
  }

  return {
    name: apiKeyName,
    value: store.envVars.get(props.provider)?.find((item) => item.name === apiKeyName)?.value || '',
  };
};

envVars.value = currentEnvVars();
apiKey.value = currentApiKey();

const loadModelsList = async () => {
  const items = await $fetch(`/api/brevia/providers/${props.provider}`);
  const selectedModels = store.providers.find((p) => p.model_provider === props.provider)?.models || [];
  const models = items.models || [];
  return models.map((m: any) => {
    return {
      name: m.name,
      selected: selectedModels.some((sm) => sm.name === m.name),
    };
  });
};

modelsList.value = await loadModelsList();
setTimeout(() => (isLoading.value = false), 500);

const allItemsChecked = () => {
  return modelsList.value.length > 0 && modelsList.value.every((model) => model.selected === true);
};

const allItemsUnchecked = () => {
  return modelsList.value.every((model) => model.selected === false);
};

const updateCheckAll = () => {
  if (allItemsChecked() && !checkAll.value) {
    checkAll.value = true;
  }
  if (allItemsUnchecked() && checkAll.value === true) {
    checkAll.value = false;
  }
};

const addEnvVar = () => {
  if (!newEnvVar.value) {
    return;
  }
  envVars.value.push({ name: newEnvVar.value, value: '' });
};

const delEnvVar = (name: string) => {
  const index = envVars.value.findIndex((item) => item.name === name);
  if (index !== -1) {
    envVars.value.splice(index, 1);
  }
};

const checkAll = ref(allItemsChecked());

const indeterminateCheck = computed(() => {
  return modelsList.value.some((model) => model.selected === false) && modelsList.value.some((model) => model.selected === true);
});

watch(checkAll, (newValue) => {
  modelsList.value.forEach((model) => {
    model.selected = newValue;
  });
});

const saveProvidersConfig = async () => {
  if (saveLoading.value) {
    return;
  }
  saveLoading.value = true;
  await updateProvidersConfig();
  saveLoading.value = false;
};

const updateProvidersConfig = async () => {
  try {
    updateProviderStore();
    const body: any = {
      providers: JSON.stringify(store.providers),
    };
    if (changedVars) {
      body.brevia_env_secrets = envVarsToJSON();
    }
    await $fetch('/api/brevia/config', {
      method: 'POST',
      body,
    });
    if (changedVars) {
      modelsList.value = await loadModelsList();
      changedVars = false;
    }
  } catch (err) {
    console.error(err);
  }
};

const envVarsToJSON = () => {
  const varsMap = new Map<string, string>();
  for (const [_k, list] of store.envVars.entries()) {
    list.forEach((item) => {
      varsMap.set(item.name, item.value);
    });
  }

  return JSON.stringify(Object.fromEntries(varsMap));
};

const envVarsChanged = () => {
  const vars = envVars.value.slice();
  if (apiKey.value?.value) {
    vars.push(apiKey.value);
  }
  return JSON.stringify(vars) !== JSON.stringify(store.envVars.get(props.provider));
};

const updateProviderStore = () => {
  const selectedModels = modelsList.value
    .filter((model) => model.selected)
    .map((model) => ({ name: model.name }))
    .slice();
  const providerIndex = store.providers.findIndex((p) => p.model_provider === props.provider);
  if (providerIndex !== -1) {
    store.providers[providerIndex].models = selectedModels;
  } else {
    store.providers.push({ model_provider: props.provider, models: selectedModels });
  }
  if (envVarsChanged()) {
    const vars = envVars.value.slice();
    if (apiKey.value?.value) {
      vars.push(apiKey.value);
    }
    store.envVars.set(props.provider, vars);
    changedVars = true;
  }
};
</script>
