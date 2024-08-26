import type { ApiResponseList } from '~~/types/bedita-api';

export const useApiGetAll = async (endpoint: string, page = 1, pageSize = 100) => {
  const { data, meta } = await $fetch<ApiResponseList>(
    `${endpoint}&page_size=${pageSize}&page=${page}`,
  );

  const pageCount = meta?.pagination?.page_count || 0;
  let res = data;
  if (page < pageCount) {
    const nextPageResponse = await useApiGetAll(endpoint, page + 1, pageSize);
    const nextPageData = nextPageResponse?.data?.formattedData || nextPageResponse?.data || [];
    const currPageData = data?.formattedData || data || [];
    res = [...currPageData, ...nextPageData];
  }

  return { data: res };
};
