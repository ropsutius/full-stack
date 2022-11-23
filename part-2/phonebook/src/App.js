import { useState, useEffect } from 'react';
import personService from './services/personService';
import People from './components/People';
import Form from './components/Form';
import Filter from './components/Filter';
import Error from './components/Error';

const App = () => {
  const [persons, setPeople] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [filter, setFilter] = useState('');
  const [message, setMessage] = useState({ message: null, isError: false });

  useEffect(() => {
    personService.getAll().then((allPeople) => {
      setPeople(allPeople);
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

  const sendMessage = (message, isError) => {
    setMessage({ message: message, isError: isError });
    setTimeout(() => setMessage({ message: null, isError: false }), 5000);
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();

    const newPerson = {
      name: newName,
      number: newNumber,
      id: newName,
    };

    if (persons.find((person) => person.name === newPerson.name)) {
      if (
        window.confirm(
          `${newName} is already added to phonebook, replace old number with a new one?`,
          false
        )
      ) {
        personService
          .update(newPerson.id, newPerson)
          .then((modifiedPerson) => {
            setPeople(
              persons.map((person) =>
                person.id !== modifiedPerson.id ? person : modifiedPerson
              )
            );
            sendMessage('Number successfully changed!', false);
          })
          .catch(
            sendMessage(
              `Information of ${newPerson.name} has already been removed from the server!`,
              true
            )
          );
      }
    } else {
      personService.create(newPerson).then((newPerson) => {
        setPeople(persons.concat(newPerson));
        sendMessage(`Added ${newPerson.name}`);
      });
    }

    setNewName('');
    setNewNumber('');
  };

  const handleDelete = (id) => {
    const deletedPerson = persons.find((person) => person.id === id);
    if (window.confirm(`Delete ${deletedPerson.name}?`)) {
      personService.remove(id).then();
      setPeople(persons.filter((person) => person.id !== id));
    }
  };

  const peopleToShow = persons.filter((person) => {
    return person.name.toLowerCase().includes(filter.toLowerCase());
  });

  return (
    <div>
      <h2>Phonebook</h2>
      <Error message={message} />
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
      <People people={peopleToShow} handleDelete={handleDelete} />
    </div>
  );
};

export default App;
