import { useState } from 'react';

const Header = ({ header }) => <h1>{header}</h1>;

const Button = ({ handler, state, text }) => {
  return <button onClick={() => handler(state + 1)}>{text}</button>;
};

const StatisticsLine = ({ value, text }) => {
  return (
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
  );
};

const Statistics = ({ good, neutral, bad }) => {
  if (good === 0 && neutral === 0 && bad === 0) {
    return <p>no feedback given</p>;
  } else {
    return (
      <>
        <h1>statistics</h1>
        <table>
          <tbody>
            <StatisticsLine value={good} text="good" />
            <StatisticsLine value={neutral} text="neutral" />
            <StatisticsLine value={bad} text="bad" />
            <StatisticsLine value={good + neutral + bad} text="all" />
            <StatisticsLine
              value={(good - bad) / (good + neutral + bad)}
              text="average"
            />
            <StatisticsLine
              value={(good / (good + neutral + bad)) * 100}
              text="positive"
            />
          </tbody>
        </table>
      </>
    );
  }
};

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  const header = 'give feedback';

  return (
    <div>
      <Header header={header} />
      <Button handler={setGood} state={good} text="good" />
      <Button handler={setNeutral} state={neutral} text="neutral" />
      <Button handler={setBad} state={bad} text="bad" />

      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  );
};

export default App;
