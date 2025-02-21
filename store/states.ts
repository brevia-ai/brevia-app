import { defineStore } from 'pinia';
import { type UserDataStore } from '~~/utils/user-data-store';

export enum ItemEditLevel {
  ReadWrite = 'READ_WRITE',
  ReadOnly = 'READ_ONLY',
  None = 'NONE',
}

export interface menuItem {
  link: string;
  type: string;
  title: string;
  description: string;
  params: any;
  edit: ItemEditLevel;
}

export interface collectionItem {
  name: string;
  uuid: string;
  cmetadata: any;
}

export const useStatesStore = defineStore('states', {
  state: () => ({
    user: null as UserDataStore | null,
    menu: [] as menuItem[],
    collection: null as collectionItem | null,
    project: null as string | null, // selected project in multi-project mode
  }),

  actions: {
    /**
     * Verify if user has access to internal link, redirect to `/` if not
     */
    userAccess(link: string) {
      const found = this.menu.find((m) => m.link === link);
      if (found) {
        return;
      }

      console.warn(`Forbidden access to ${link}`);
      navigateTo('/');
    },

    getMenuItem(link: string) {
      return this.menu.find((m) => m.link === link);
    },

    getJobInfo(name: string) {
      const item = localStorage.getItem(name);
      if (item === null) return null;

      return JSON.parse(item);
    },

    setJobInfo(name: string, value: any) {
      if (!value) {
        localStorage.removeItem(name);
        return;
      }

      localStorage.setItem(name, JSON.stringify(value));
    },

    clearCollection() {
      this.collection = null;
    },

    userHasRole(name: string) {
      return !!(this.user as UserDataStore)?.roles?.find((r) => r === name);
    },

    isLogged() {
      return !!this.user;
    },

    userLogin(data: any) {
      this.user = data;
    },
  },
});
