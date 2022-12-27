import { createSlice } from '@reduxjs/toolkit';
import anecdoteService from '../services/anecdotes';

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    vote(state, action) {
      return state
        .map((anecdote) =>
          anecdote.id === action.payload
            ? { ...anecdote, votes: anecdote.votes + 1 }
            : anecdote
        )
        .sort((a, b) => b.votes - a.votes);
    },
    appendAnecdote(state, action) {
      state.push(action.payload);
    },
    updateAnecdote(state, action) {
      state[state.findIndex((anecdote) => anecdote.id === action.payload.id)] =
        action.payload;
      return state.sort((a, b) => b.votes - a.votes);
    },
    setAnecdotes(state, action) {
      return action.payload.sort((a, b) => b.votes - a.votes);
    },
  },
});

export const { appendAnecdote, updateAnecdote, setAnecdotes, vote } =
  anecdoteSlice.actions;

export const initializeAnecdotes = () => {
  return async (dispatch) => {
    const anecdotes = await anecdoteService.getAll();
    dispatch(setAnecdotes(anecdotes));
  };
};

export const createAnecdote = (content) => {
  return async (dispatch) => {
    const anecdote = await anecdoteService.createAnecdote(content);
    dispatch(appendAnecdote(anecdote));
  };
};

export const addVote = (id) => {
  return async (dispatch) => {
    const anecdote = await anecdoteService.addVote(id);
    dispatch(updateAnecdote(anecdote));
  };
};

export default anecdoteSlice.reducer;
