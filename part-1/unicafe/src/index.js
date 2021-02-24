import React, { useState } from 'react';
import ReactDOM from 'react-dom';

const Title = ({ text }) => {
  return <h1>{text}</h1>;
};

const FeedbackButton = ({ text, func, value }) => {
  const handleClick = () => {
    func(value + 1);
  };

  return <button onClick={handleClick}>{text}</button>;
};

const Display = ({ text, value }) => {
  return (
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
  );
};

const All = ({ good, neutral, bad }) => {
  return (
    <tr>
      <td>All</td>
      <td>{good + neutral + bad}</td>
    </tr>
  );
};

const Average = ({ good, neutral, bad }) => {
  const avg = (good - bad) / (good + neutral + bad);
  return (
    <tr>
      <td>Average</td>
      <td>{avg}</td>
    </tr>
  );
};

const Positive = ({ good, neutral, bad }) => {
  return (
    <tr>
      <td>Positive</td>
      <td>{(good / (good + neutral + bad)) * 100} %</td>
    </tr>
  );
};

const Statistics = ({ good, neutral, bad }) => {
  if (good + neutral + bad === 0) {
    return (
      <div>
        <p>No feedback given</p>
      </div>
    );
  }

  return (
    <div>
      <table>
        <tbody>
          <Display text={'good'} value={good} />
          <Display text={'neutral'} value={neutral} />
          <Display text={'bad'} value={bad} />
          <All good={good} neutral={neutral} bad={bad} />
          <Average good={good} neutral={neutral} bad={bad} />
          <Positive good={good} neutral={neutral} bad={bad} />
        </tbody>
      </table>
    </div>
  );
};

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  return (
    <div>
      <Title text={'Give Feedback'} />
      <FeedbackButton text={'Good'} func={setGood} value={good} />
      <FeedbackButton text={'Neutral'} func={setNeutral} value={neutral} />
      <FeedbackButton text={'Bad'} func={setBad} value={bad} />
      <Title text={'Statistics'} />
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
