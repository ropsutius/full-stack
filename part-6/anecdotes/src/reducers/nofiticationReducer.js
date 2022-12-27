import { createSlice } from '@reduxjs/toolkit';

const initialState = { content: null, timeoutId: null };

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    changeNotification(state, action) {
      if (state.timeoutId) clearTimeout(state.timeoutId);
      state = { content: action.payload, timeoutId: null };
      return state;
    },
    removeNotification(state, action) {
      state.content = null;
      return state;
    },
    setTimeoutId(state, action) {
      state.timeoutId = action.payload;
      return state;
    },
  },
});

export const { changeNotification, removeNotification, setTimeoutId } =
  notificationSlice.actions;

export const setNotification = (content, time) => {
  return async (dispatch) => {
    dispatch(changeNotification(content));
    const timeoutId = setTimeout(() => {
      dispatch(removeNotification());
    }, time);
    dispatch(setTimeoutId(timeoutId));
  };
};
export default notificationSlice.reducer;
