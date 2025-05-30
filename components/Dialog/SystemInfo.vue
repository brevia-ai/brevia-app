<template>
  <div class="space-y-8 leading-tight">
    <div class="flex justify-between items-center pb-4 mb-4 s\m:mb-5">
      <h3 class="text-xl font-semibold text-gray-900">{{ $t('SYSTEM_INFO') }}</h3>
      <Icon class="text-2xl hover:cursor-pointer hover:bg-sky-100" name="ph:x-bold" @click="$closeModal()" />
    </div>

    <div class="gap-3 tracking-wider">
      <span class="col-span-3 justify-self-end whitespace-nowrap">
        Brevia App <strong>v{{ appVersion }}</strong>
      </span>
    </div>

    <hr class="border-t border-gray-300" />

    <div class="gap-3 tracking-wider">
      <template v-if="versions?.brevia">
        <span class="col-span-3 justify-self-end whitespace-nowrap">
          Brevia API <strong>v{{ versions.brevia }}</strong>
        </span>
        <br />
        <template v-if="statesStore.lowBreviaVersion()">
          <span class="col-span-3 justify-self-end whitespace-nowrap text-red-600">
            {{ $t('MIN_BREVIA_VERSION_WARNING', { version: minBreviaVersion }) }}
          </span>
          <br />
        </template>
      </template>
      <template v-if="versions?.apiName && versions?.apiVersion">
        <span class="col-span-3 justify-self-end whitespace-nowrap">
          {{ versions.apiName }} API <strong>v{{ versions.apiVersion }}</strong>
        </span>
        <br />
      </template>
      <span class="col-span-3 justify-self-end whitespace-nowrap">
        API Base URL <strong>{{ versions.baseUrl }}</strong>
      </span>
    </div>

    <hr v-if="integration !== 'brevia'" class="border-t border-gray-300" />

    <div v-if="integration !== 'brevia'" class="gap-3 tracking-wider">
      <template v-if="integrationVersions?.get(integration)">
        <span class="col-span-3 justify-self-end whitespace-nowrap">
          {{ integrationName }} API <strong>v{{ integrationVersions?.get(integration) }}</strong>
        </span>
        <br />
      </template>
      <template v-if="integrationVersions?.get('apiName') && integrationVersions?.get('apiVersion')">
        <span class="col-span-3 justify-self-end whitespace-nowrap">
          {{ integrationVersions?.get('apiName') }} API <strong>v{{ integrationVersions?.get('apiVersion') }}</strong>
        </span>
        <br />
      </template>
      <span class="col-span-3 justify-self-end whitespace-nowrap">
        API Base URL <strong>{{ integrationVersions?.get('baseUrl') }}</strong>
      </span>
    </div>
  </div>
</template>

<script lang="ts" setup>
const appVersion = useRuntimeConfig().public.version;
const statesStore = useStatesStore();
const versions = statesStore.versions;
const minBreviaVersion = useRuntimeConfig().public.minBreviaVersion;

const integration = useIntegration();
const integrationName = integration.charAt(0).toUpperCase() + integration.slice(1);
const integrationVersions = await useIntegrationVersion();
</script>
