export const useIntegration = (): string => {
  const config = useRuntimeConfig();

  return config.public.integration || 'brevia';
};
