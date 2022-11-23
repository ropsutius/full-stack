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

export default Form;
