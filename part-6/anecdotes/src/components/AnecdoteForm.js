import { useDispatch } from 'react-redux';
import { createAnecdote } from '../reducers/anecdoteReducer.js';
import { setNotification } from '../reducers/nofiticationReducer.js';

const AnecdoteForm = () => {
  const dispatch = useDispatch();

  const handleCreateAnecdote = async (event) => {
    event.preventDefault();

    dispatch(createAnecdote(event.target.anecdote.value));

    dispatch(
      setNotification(`you added: ${event.target.anecdote.value}`, 5000)
    );
    event.target.anecdote.value = '';
  };

  return (
    <>
      <h2>create new</h2>
      <form onSubmit={handleCreateAnecdote}>
        <div>
          <input name="anecdote" />
        </div>
        <button type="submit">create</button>
      </form>
    </>
  );
};

export default AnecdoteForm;
