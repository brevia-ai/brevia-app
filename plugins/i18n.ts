import { useI18n } from 'vue-i18n';
import type { JsonApiResourceObject } from '@atlasconsulting/bedita-sdk';

export default defineNuxtPlugin((nuxtApp) => {
  // called right after a new locale has been set
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  nuxtApp.hook('i18n:localeSwitched', ({ oldLocale, newLocale }) => {
    useHead({
      htmlAttrs: {
        lang: newLocale,
      },
    });
  });

  return {
    provide: {
      i18nField: (object: JsonApiResourceObject | undefined, field: string) => {
        if (!object) {
          return '';
        }
        const { locale } = useI18n();
        const trLang = object?.relationships?.translations?.data?.[0]?.attributes.lang;
        if (object?.attributes?.lang == locale.value || trLang != locale.value) {
          return object?.attributes?.[field] || object?.meta?.[field];
        }

        // look for translation
        const val =
          object?.relationships?.translations?.data?.[0]?.attributes?.translated_fields?.[field];
        if (!val) {
          return object?.attributes?.[field] || object?.meta?.[field];
        }

        return val;
      },
    },
  };
});
