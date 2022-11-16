import { useState, useEffect } from 'react';
import axios from 'axios';

const Country = ({ country, setFilter }) => {
  return (
    <div>
      <>{country.name.common} </>
      <button onClick={() => setFilter(country.name.common)}>show</button>
    </div>
  );
};

const Language = ({ language }) => {
  return <li>{language}</li>;
};

const Countries = ({ countries, setFilter }) => {
  if (countries.length > 10) {
    return <p>Too many matches, specify another filter</p>;
  } else if (countries.length > 1) {
    return (
      <>
        {countries.map((c) => {
          return <Country country={c} key={c.cca2} setFilter={setFilter} />;
        })}
      </>
    );
  } else if (countries.length === 1) {
    const country = countries[0];

    const languages = [];
    for (let key in country.languages) {
      languages.push(key);
    }

    return (
      <>
        <h1>{country.name.common}</h1>
        <p>capital {country.capital[0]}</p>
        <p>area {country.area}</p>

        <h3>languages:</h3>
        <p>
          {languages.map((language) => {
            return (
              <Language
                language={country.languages[language]}
                key={country.languages[language]}
              />
            );
          })}
        </p>
        <img src={country.flags.png} alt={'flag of' + country.name.common} />
      </>
    );
  }
};

const Filter = ({ filter, handler }) => {
  return (
    <div>
      find countries: <input value={filter} onChange={handler} />
    </div>
  );
};

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
