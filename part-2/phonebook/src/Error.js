const Error = ({ message }) => {
  const errorStyle = {
    color: message.isError ? 'red' : 'green',
    background: 'lightgrey',
    fontSize: '20px',
    borderStyle: 'solid',
    borderRadius: '5px',
    padding: '10px',
    marginBottom: '10px',
  };

  if (message.message === null) return null;
  else {
    return <div style={errorStyle}>{message.message}</div>;
  }
};

export default Error;
