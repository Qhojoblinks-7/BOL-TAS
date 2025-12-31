import mockDatabase from './data/mockDatabase.json';

// Custom baseQuery for RTK Query that uses the mock database JSON file
export const mockBaseQuery = () => {
  return async ({ url, method = 'GET', body }) => {
    try {
      const collection = url.split('/')[0]; // e.g., 'users' from 'users/123'
      const id = url.split('/')[1]; // e.g., '123' from 'users/123'

      if (!mockDatabase[collection]) {
        return { error: { status: 404, data: 'Collection not found' } };
      }

      let result;

      switch (method) {
        case 'GET':
          console.log(`Fetching ${collection}${id ? `/${id}` : ''} from mockDatabase`);
          if (id) {
            result = mockDatabase[collection]?.find(item => item.id === id);
            if (!result) {
              console.log(`Item ${id} not found in ${collection}`);
              return { error: { status: 404, data: 'Not found' } };
            }
          } else {
            result = mockDatabase[collection] || [];
            console.log(`Found ${result.length} items in ${collection}`);
          }
          break;

        case 'POST': {
          // For demo purposes, we'll simulate adding to the collection
          // In a real app, this would update the JSON file
          const newItem = { ...body, id: `${collection.slice(0, -1)}_${Date.now()}` };
          result = newItem;
          console.log(`Simulated POST to ${collection}:`, newItem);
          break;
        }

        case 'PUT':
        case 'PATCH':
          // For demo purposes, simulate update
          result = { ...body, id };
          console.log(`Simulated ${method} to ${collection}/${id}:`, result);
          break;

        case 'DELETE':
          // For demo purposes, simulate deletion
          result = { success: true };
          console.log(`Simulated DELETE from ${collection}/${id}`);
          break;

        default:
          return { error: { status: 405, data: 'Method not allowed' } };
      }

      return { data: result };
    } catch (error) {
      return { error: { status: 500, data: error.message } };
    }
  };
};