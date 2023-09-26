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
}));
