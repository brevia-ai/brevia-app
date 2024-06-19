
export const useIntegrationFeatures = (): any => {
    const config = useRuntimeConfig();
    const integration = useIntegration();

    return config.public?.[integration]?.features || {};
};
