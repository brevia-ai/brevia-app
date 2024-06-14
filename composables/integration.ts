
export const useIntegration = (): string => {
    const config = useRuntimeConfig();

    return config.integration || 'brevia';
};
