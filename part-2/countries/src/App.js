import { useState, useEffect } from 'react';
import axios from 'axios';
import Countries from './Countries';
import Filter from './Filter';

function App() {
  const [countries, setCountries] = useState([]);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    axios.get('https://restcountries.com/v3.1/all').then((response) => {
      setCountries(response.data);
    });
  }, []);

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const countriesToShow = countries.filter((country) => {
    return country.name.common.toLowerCase().includes(filter.toLowerCase());
  });

  return (
    <div>
      <Filter filter={filter} handler={handleFilterChange} />
      <Countries countries={countriesToShow} setFilter={setFilter} />
    </div>
  );
}

export default App;
