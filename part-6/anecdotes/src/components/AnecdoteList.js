import { useSelector, useDispatch } from 'react-redux';
import { addVote } from '../reducers/anecdoteReducer.js';
import { setNotification } from '../reducers/nofiticationReducer.js';

const AnecdoteList = () => {
  const anecdotes = useSelector((state) => state.anecdotes);
  const filter = useSelector((state) => state.filters);
  const dispatch = useDispatch();

  const handleVote = (anecdote) => {
    dispatch(addVote(anecdote));

    dispatch(setNotification(`you voted: ${anecdote.content}`, 5000));
  };

  const anecdotesToShow =
    filter.length === 0
      ? anecdotes
      : anecdotes.filter((anecdote) =>
          anecdote.content.toLowerCase().includes(filter.toLowerCase())
        );

  return (
    <>
      {anecdotesToShow.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      ))}
    </>
  );
};

export default AnecdoteList;
