import React from 'react';
import { useHistory } from 'react-router-dom';
import { v4 as uuid } from 'uuid';

export default function Drawings() {
  let history = useHistory();
  function handleClick() {
    const id = uuid();
    history.push(`/create/${id}`);
  }
  return (
    <div>
      <div>
        <button onClick={handleClick} style={buttonStyle}>
          Create new Drawing
        </button>
      </div>
      <h1>Hello from Drawings</h1>
    </div>
  );
}

const buttonStyle = {
  padding: '10px 20px'
};
