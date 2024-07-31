import en from '~~/locales/en/messages.json';
import it from '~~/locales/it/messages.json';

export default defineI18nConfig(() => ({
  legacy: false,
  globalInjection: true,
  locale: 'it',
  messages: {
    en,
    it,
  },
  detectBrowserLanguage: {
    useCookie: true,
    cookieKey: 'i18n_redirected',
    redirectOn: 'root',
  },
}));
