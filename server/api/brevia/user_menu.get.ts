import { menuItems } from '~/server/utils/menu-items';

export default defineEventHandler(async (event) => {
  try {
    return await menuItems(event);
  } catch (error) {
    return handleApiError(event, error);
  }
});
