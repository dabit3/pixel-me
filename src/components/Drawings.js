import React, { useState } from 'react';
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
      <Dialog handleClick={handleClick} />
      <h1>Hello from Drawings</h1>
    </div>
  );
}

function Dialog({ handleClick }) {
  return (
    <div style={dialogStyle}>
      <div style={containerStyle}>
        <input
          style={inputStyle}
          placeholder="Drawing Name"
        />
        <button onClick={handleClick} style={buttonStyle}>
          Create new Drawing
        </button>
      </div>
    </div>
  )
}

const dialogStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 100,
  position: 'fixed',
  width: 400,
  height: 200,
  left: '50%',
  top: '50%',
  marginLeft: -200,
  marginTop: -100,
  backgroundColor: "#ddd",
}

const containerStyle = {
  display: 'flex',
  flexDirection: 'column',
  width: '300px'
}

const inputStyle = {
  
}

const buttonStyle = {
  padding: '10px 20px',
  marginTop: 15
};
