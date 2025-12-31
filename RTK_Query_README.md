
# RTK Query: Modern Data Fetching with Redux Toolkit

In 2025, the standard way to handle data fetching in React applications is using RTK Query (part of Redux Toolkit). It is significantly more powerful than the old approach of using "Thunks."

## How it Works: The "Service" Approach

Instead of writing manual fetch calls, you define an API Service. This service automatically generates "Hooks" for you to use in your components.

### Step 1: Create the API Service

You define where your data comes from and what "endpoints" it has.

```javascript
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://api.example.com/' }),
  endpoints: (builder) => ({
    // This defines a "useGetUserQuery" hook automatically
    getUserById: builder.query({
      query: (id) => `user/${id}`,
    }),
  }),
});

// Export the auto-generated hook
export const { useGetUserByIdQuery } = userApi;
```

### Step 2: Using it in your Component

This is where the magic happens. You don't need `useEffect`, `useState`, or manual error handling anymore. The hook handles everything.

```javascript
import { useGetUserByIdQuery } from './services/userApi';

function UserProfile({ userId }) {
  // Everything is provided in one line!
  const { data, error, isLoading } = useGetUserByIdQuery(userId);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Oh no, error: {error.message}</p>;

  return (
    <div>
      <h1>{data.name}</h1>
    </div>
  );
}
```

### Step 3: Add the API Service to Your Store

Don't forget to add the API service to your Redux store:

```javascript
import { configureStore } from '@reduxjs/toolkit';
import { userApi } from './services/userApi';

export const store = configureStore({
  reducer: {
    [userApi.reducerPath]: userApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(userApi.middleware),
});
```

## Why use Redux (RTK Query) instead of Local Fetch?

| Feature | Local fetch + useEffect | Redux (RTK Query) |
|---------|-------------------------|-------------------|
| Caching | No (fetches every time) | Yes (remembers data) |
| Deduplication | No (2 components = 2 fetches) | Yes (1 fetch shared by all) |
| Boilerplate | High (lots of manual state) | Low (hooks are generated) |
| Polling | Hard to implement | Built-in (refreshes every X secs) |
| Performance | Basic | Optimized (avoids unnecessary re-renders) |

RTK Query provides a modern, efficient way to manage server state in React applications, reducing boilerplate and improving performance compared to traditional fetch methods.