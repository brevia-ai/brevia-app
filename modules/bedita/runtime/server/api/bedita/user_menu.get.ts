export default defineEventHandler(async (event) => {
  try {
    const client = await beditaApiClient(event);
    const response = await client.get('/auth/user', {
      params: {
        include: 'has_access',
      },
    });

    const menuItems = response?.formattedData?.data?.relationships?.has_access?.data || [];
    const userId = parseInt(response?.formattedData?.data?.id);

    menuItems.forEach((item, index) => {
      let editLevel = item.meta.relation.params?.edit_level || null;
      if (editLevel === null && userId === item.meta?.created_by) {
        editLevel = 'read_write';
      }
      menuItems[index]['edit_level'] = editLevel;
    });

    return menuItems;
  } catch (error) {
    return handleBeditaApiError(event, error);
  }
});
