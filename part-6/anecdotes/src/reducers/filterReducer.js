import { createSlice } from '@reduxjs/toolkit';

const initialState = '';

const filterSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    changeFilter(state, action) {
      return action.payload;
    },
    removeFilter(state, action) {
      return '';
    },
  },
});

export const { changeFilter, removeFilter } = filterSlice.actions;
export default filterSlice.reducer;
