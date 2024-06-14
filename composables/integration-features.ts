
export const useIntegrationFeatures = (): any => {
    const config = useRuntimeConfig();
    const integration = config.integration || 'brevia';

    return config?.[integration]?.features || {};
};
