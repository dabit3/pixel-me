import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { v4 as uuid } from 'uuid';
import { API } from 'aws-amplify'
import { Link } from 'react-router-dom'
import { itemsByType } from '../graphql/queries'

export default function Drawings() {
  const [drawings, setDrawings] = useState([])
  const [loading, updateLoading] = useState(true)
  useEffect(() => {
    fetchDrawings()
  }, [])
  async function fetchDrawings() {
    try {
      const apiData = await API.graphql({ query: itemsByType, variables: { limit: 10, itemType: "Drawing" }})
      console.log('apiData: ', apiData)
      setDrawings(apiData.data.itemsByType.items)
    } catch (err) {
      console.log('error fetching drawings...: ', err)
    }
  }
  let history = useHistory();
  function handleClick() {
    const id = uuid();
    history.push(`/create/${id}`);
  }
  return (
    <div>
      <Dialog handleClick={handleClick} />
      {
        drawings.map(drawing => (
          <h1 key={drawing.id}>
            <Link to={`/drawing/${drawing.id}/${drawing.name}`} style={drawingNameStyle}>
              { drawing.name }
            </Link>
          </h1>
        ))
      }
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

const drawingNameStyle = {
  color: "#ff59e3",
  textDecoration: 'none'
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
