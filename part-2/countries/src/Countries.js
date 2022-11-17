import { useEffect, useState } from 'react';
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

const Weather = ({ weather }) => {
  if (weather !== null) {
    const temperature = Math.round((weather.main.temp - 273.15) * 100) / 100;
    return (
      <>
        <p>temperature {temperature} Celcius</p>
        <p>wind {weather.wind.speed} m/s</p>
        <p>weather icon {weather.weather[0].icon}</p>
        <img
          src={
            'http://openweathermap.org/img/wn/' +
            weather.weather[0].icon +
            '@2x.png'
          }
          alt="weather icon"
        />
      </>
    );
  } else return null;
};

const Countries = ({ countries, setFilter }) => {
  const [weather, setWeather] = useState(null);
  const [capital, setCapital] = useState('');

  const key = process.env.REACT_APP_API_KEY;
  const baseUrl = 'http://api.openweathermap.org/data/2.5/weather?q=';

  useEffect(() => {
    if (capital !== '') {
      const url = baseUrl + capital + '&APPID=' + key;
      axios
        .get(url)
        .then((response) => {
          setWeather(response.data);
        })
        .catch((error) => console.log('Error: ' + error));
    }
  }, [capital, key]);

  if (countries.length > 10) {
    if (capital !== '') setCapital('');
    return <p>Too many matches, specify another filter</p>;
  } else if (countries.length > 1) {
    if (capital !== '') setCapital('');
    return (
      <>
        {countries.map((c) => {
          return <Country country={c} key={c.cca2} setFilter={setFilter} />;
        })}
      </>
    );
  } else if (countries.length === 1) {
    const country = countries[0];
    if (capital === '') {
      setCapital(country.capital[0]);
    }

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
        <Weather weather={weather} />
      </>
    );
  }
};

export default Countries;
