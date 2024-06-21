import type { ApiResponseList } from '~~/types/bedita-api';

export const useApiGetAll = async (endpoint: string, page = 1, pageSize = 100) => {
    let { data, meta } = await $fetch<ApiResponseList>(`${endpoint}&page_size=${pageSize}&page=${page}`);

    const pageCount = meta?.pagination?.page_count || 0;
    if (page < pageCount) {
        const nextPageResponse = await useApiGetAll(endpoint, page + 1, pageSize);
        const nextPageData = nextPageResponse?.data?.formattedData || nextPageResponse?.data || [];
        const currPageData = data?.formattedData || data || [];
        data = [...currPageData, ...nextPageData];
    }

    return { data };
}
