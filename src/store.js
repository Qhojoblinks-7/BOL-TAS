import { configureStore } from '@reduxjs/toolkit';
import { usersApi } from './services/usersApi';
import { attendanceApi } from './services/attendanceApi';
import { usherApi } from './services/usherApi';
import { membersApi } from './services/membersApi';
import { weeklyAttendanceApi } from './services/weeklyAttendanceApi';
import { shepherdingApi } from './services/shepherdingApi';

export const store = configureStore({
  reducer: {
    [usersApi.reducerPath]: usersApi.reducer,
    [attendanceApi.reducerPath]: attendanceApi.reducer,
    [usherApi.reducerPath]: usherApi.reducer,
    [membersApi.reducerPath]: membersApi.reducer,
    [weeklyAttendanceApi.reducerPath]: weeklyAttendanceApi.reducer,
    [shepherdingApi.reducerPath]: shepherdingApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      usersApi.middleware,
      attendanceApi.middleware,
      usherApi.middleware,
      membersApi.middleware,
      weeklyAttendanceApi.middleware,
      shepherdingApi.middleware,
    ),
});