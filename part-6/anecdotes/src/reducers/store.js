import { configureStore } from '@reduxjs/toolkit';
import anecdoteSlice from './anecdoteReducer.js';
import notificationSlice from './nofiticationReducer.js';
import filterSlice from './filterReducer.js';

const store = configureStore({
  reducer: {
    anecdotes: anecdoteSlice,
    notifications: notificationSlice,
    filters: filterSlice,
  },
});

export default store;
