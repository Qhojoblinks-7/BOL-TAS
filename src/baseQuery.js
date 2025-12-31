import { getAll, getById, add, update, remove } from './utils/database';

// Custom baseQuery for RTK Query that uses our mock database functions
export const mockBaseQuery = () => {
  return async ({ url, method = 'GET', body }) => {
    try {
      const collection = url.split('/')[0]; // e.g., 'users' from 'users/123'
      const id = url.split('/')[1]; // e.g., '123' from 'users/123'

      let result;

      switch (method) {
        case 'GET':
          if (id) {
            result = getById(collection, id);
            if (!result) {
              return { error: { status: 404, data: 'Not found' } };
            }
          } else {
            result = getAll(collection);
          }
          break;

        case 'POST':
          result = add(collection, body);
          break;

        case 'PUT':
        case 'PATCH':
          result = update(collection, id, body);
          if (!result) {
            return { error: { status: 404, data: 'Not found' } };
          }
          break;

        case 'DELETE': {
          const success = remove(collection, id);
          if (!success) {
            return { error: { status: 404, data: 'Not found' } };
          }
          result = { success: true };
          break;
        }

        default:
          return { error: { status: 405, data: 'Method not allowed' } };
      }

      return { data: result };
    } catch (error) {
      return { error: { status: 500, data: error.message } };
    }
  };
};