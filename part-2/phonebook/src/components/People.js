const Name = ({ person, handleDelete }) => (
  <li>
    {person.name} {person.number}{' '}
    <button onClick={() => handleDelete(person.id)}>delete</button>
  </li>
);

const People = ({ people, handleDelete }) => {
  return (
    <>
      {people.map((person) => {
        return (
          <Name person={person} key={person.id} handleDelete={handleDelete} />
        );
      })}
    </>
  );
};

export default People;
