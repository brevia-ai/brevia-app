export const useApiGetAll = async (endpoint: string, page = 1, pageSize = 100) => {
    const response = await useFetch(`${endpoint}&page_size=${pageSize}&page=${page}`);
    const data = response?.data || {};
    const pageCount = data?.value?.meta?.pagination?.page_count || 0;
    if (page < pageCount) {
        const nextPageResponse = await useApiGetAll(endpoint, page + 1, pageSize);
        const nextPageData = nextPageResponse?.data?.value?.formattedData?.data || [];
        data.value.formattedData.data = data?.value?.formattedData?.data.concat(nextPageData);
    }

    return {data};
}
