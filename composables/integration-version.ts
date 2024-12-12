export const useIntegrationVersion = async (): Promise<Map<string, string>> => {
  const integration = useIntegration();
  if (integration === 'brevia') {
    return new Map();
  }
  const response: any = await $fetch(`/api/${integration}/versions`);

  return new Map(Object.entries(response));
};
