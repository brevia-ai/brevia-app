import { menuItems } from '~/server/utils/menu-items';

export default defineEventHandler(async (event) => {
  try {
    return menuItems();
  } catch (error) {
    return handleApiError(event, error);
  }
});
