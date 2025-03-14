import { defineStore } from 'pinia';

export interface ModelItem {
  name: string;
  tokens_limit?: number;
}

export interface Provider {
  model_provider: string;
  models: ModelItem[];
}

export interface EnvVarItem {
  name: string;
  value: string;
}

export const useProvidersStore = defineStore('providers', {
  state: () => ({
    providers: [] as Provider[],
    envVars: new Map() as Map<string, EnvVarItem[]>,
    knownVars: new Map() as Map<string, string[]>,
  }),

  actions: {

    setKnownVars(conf: any) {
      this.knownVars.clear();
      for (const [key, value] of Object.entries(conf)) {
        this.knownVars.set(key, value);
      }
    },

    setupEnvVarsMap(confEnvVars: any) {
      this.envVars.clear();
      const providerVars: string[] = [];
      const keys = Object.keys(confEnvVars);
      for (const [provider, items] of this.knownVars.entries()) {
        const varList: EnvVarItem[] = [];
        for (const item of items) {
          if (keys.includes(item)) {
            varList.push({name: item, value: String(confEnvVars[item])});
            providerVars.push(item);
          }
        }
        this.envVars.set(provider, varList);
      }
      // put every other var in a special `_keep` variable
      const otherVars = keys.filter(key => !providerVars.includes(key));
      this.envVars.set('_keep', otherVars.map(key => ({ name: key, value: String(confEnvVars[key])})));
    },
  },
});
