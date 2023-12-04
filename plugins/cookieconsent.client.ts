import 'vanilla-cookieconsent/dist/cookieconsent.css';
import * as CookieConsent from 'vanilla-cookieconsent';
import type { CookieConsentConfig } from 'vanilla-cookieconsent';

const cookieConfig: CookieConsentConfig = {
    guiOptions: {
        consentModal: {
            layout: 'box',
            position: 'bottom right',
        },
        preferencesModal: {
            layout: 'box',
        },
    },

    onConsent: ({cookie}) => {
        const { grantConsent, revokeConsent } = useGtag();
        console.log('onConsent fired ...', cookie);
        if (cookie.categories.includes('analytics')) {
            grantConsent();
        } else {
            revokeConsent();
        }
    },

    onChange: ({cookie}) => {
        const { grantConsent, revokeConsent } = useGtag();
        if (cookie.categories.includes('analytics')) {
            grantConsent();
        } else {
            revokeConsent();
        }
    },

    categories: {
        necessary: {
            readOnly: true,
            enabled: true,
        },
        analytics: {
            autoClear: {
                cookies: [
                    {
                        name: /^(_ga|_gid)/,
                    },
                ],
            },
        },
    },

    language: {
        default: 'it',

        translations: {
            it: {
                consentModal: {
                    title: "Consenso all'utilizzo dei cookie",
                    description:
                        'Il nostro sito utilizza i cookie per migliorare la tua esperienza di navigazione. Per maggiori informazioni, consulta la nostra <a href="#link" class="cc__link">privacy policy</a>. Puoi gestire le tue preferenze sui cookie in seguito cliccando sul relativo pulsante a pié di pagina.',
                    acceptAllBtn: 'Accetta',
                    acceptNecessaryBtn: 'Rifiuta',
                    showPreferencesBtn: 'Opzioni avanzate',
                    footer: `
                        <a href="https://formacamera.it/formacamerawebinarhub-tec/" target="_blank" rel="noopener">Cookie Policy</a>
                        <a href="https://formacamera.it/privacy-policy" target="_blank" rel="noopener">Termini d'uso</a>
                    `,
                },
                preferencesModal: {
                    title: 'Preferenze cookie',
                    acceptAllBtn: 'Accetta tutti',
                    acceptNecessaryBtn: 'Rifiuta tutti',
                    savePreferencesBtn: 'Salva preferenze',
                    sections: [
                        {
                        title: 'Cookie strettamente necessari',
                        description:
                            'Questi cookie sono strettamente necessari in quanto legati al funzionamento della piattaforma Forma Camera Webinar Hub e alla visione dei video webinar pubblicati.',
                        linkedCategory: 'necessary',
                        cookieTable: {
                            headers: {
                            name: 'Cookie',
                            domain: 'Domain',
                            desc: 'Description',
                            },
                            body: [
                            {
                                name: 'sessionid',
                                domain: 'formacamerahub.it',
                                desc: 'Gesione della sessione utente',
                            },
                            {
                                name: 'cc_cookie',
                                domain: 'formacamerahub.it',
                                desc: 'Gestione del consenso all’utilizzo dei cookie',
                            },
                            {
                                name: '_GRECAPTCHA',
                                domain: 'formacamera.it',
                                desc: 'Protezione anti spam',
                            },
                            {
                                name: '_GRECAPTCHA',
                                domain: 'recaptcha.net',
                                desc: 'Protezione anti spam',
                            },
                            {
                                name: 'VIMEO...',
                                domain: 'player.vimeo.com',
                                desc: 'Piattaforma di hosting video',
                            },
                            ],
                        },
                        },
                        {
                        title: 'Cookie di analisi',
                        description: 'Questi cookie sono installati per analizzare il traffico sulla piattaforma al fine di migliorare la tua esperienza di navigazione.',
                        linkedCategory: 'analytics',
                        cookieTable: {
                            headers: {
                            name: 'Cookie',
                            domain: 'Domain',
                            desc: 'Description',
                            },
                            body: [
                                {
                                    name: '_ga',
                                    domain: 'formacamera.it',
                                    desc: 'description ...',
                                },
                                {
                                    name: '_gid',
                                    domain: 'formacamera.it',
                                    desc: 'description ...',
                                },
                            ],
                        },
                        },
                        {
                            title: 'Maggiori informazioni',
                            description:
                                'Per maggiori informazioni visita la pagina sulla <a class="cc__link" href="#yourdomain.com">Cookie Policy su Forma Camera</a>.',
                        },
                    ],
                },
            },
        },
    },
};

export default defineNuxtPlugin(async () => {
    const config = useRuntimeConfig();
    if (!config.public.cookiesPrivacyTerms)
        return {};

    await CookieConsent.run(cookieConfig);

    return {
        provide: {
            CookieConsent: CookieConsent,
        },
    };
});
