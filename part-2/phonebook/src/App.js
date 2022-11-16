import { useState, useEffect } from 'react';
import axios from 'axios';

const Name = ({ person }) => (
  <li>
    {person.name} {person.number}
  </li>
);

const People = ({ people }) => {
  return (
    <>
      {people.map((person) => {
        return <Name person={person} key={person.id} />;
      })}
    </>
  );
};

const Filter = ({ filter, handler }) => {
  return (
    <div>
      filter shown with: <input value={filter} onChange={handler} />
    </div>
  );
};

const Form = ({ hSubmit, hName, hNumber, newName, newNumber }) => {
  return (
    <form onSubmit={hSubmit}>
      <div>
        name: <input value={newName} onChange={hName} />
      </div>
      <div>
        number: <input value={newNumber} onChange={hNumber} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
};

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [filter, setFilter] = useState('');

  useEffect(() => {
    axios.get('http://localhost:3001/persons').then((response) => {
      setPersons(response.data);
    });
  }, []);

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();

    const newPerson = {
      name: newName,
      number: newNumber,
      id: newName,
    };

    if (persons.find((person) => person.name === newName))
      alert(`${newName} is already added to phonebook`);
    else setPersons(persons.concat(newPerson));

    setNewName('');
    setNewNumber('');
  };

  const peopleToShow = persons.filter((person) => {
    return person.name.toLowerCase().includes(filter.toLowerCase());
  });

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter filter={filter} handler={handleFilterChange} />
      <h2>Add a new</h2>
      <Form
        hSubmit={handleFormSubmit}
        hName={handleNameChange}
        hNumber={handleNumberChange}
        newName={newName}
        newNumber={newNumber}
      />
      <h2>Numbers</h2>
      <People people={peopleToShow} />
    </div>
  );
};

export default App;
