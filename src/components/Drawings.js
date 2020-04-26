import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { v4 as uuid } from 'uuid';
import { API } from 'aws-amplify'
import { Link } from 'react-router-dom'
import { itemsByType } from '../graphql/queries'

export default function Drawings() {
  const [drawings, setDrawings] = useState([])
  const [inputValue, updateInputValue] = useState('')
  const [loading, updateLoading] = useState(true)
  const [modalVisible, setModalVisible] = useState(false)
  const [drawingVisibility, setDrawingVisibility] = useState('public')
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
    if (!inputValue) return
    const id = uuid();
    history.push(`/create/${id}/${inputValue}`);
  }
  return (
    <div>
      { modalVisible && (
        <Dialog
          handleClick={handleClick}
          drawingVisibility={drawingVisibility}
          setDrawingVisibility={setDrawingVisibility}
          setModalVisible={setModalVisible}
          inputValue={inputValue}
          updateInputValue={updateInputValue}
        />
      ) }
      <button onClick={() => setModalVisible(true)} style={buttonStyle}>
        Create new Drawing
      </button>
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

function Dialog({ updateInputValue, handleClick, drawingVisibility, setDrawingVisibility, setModalVisible }) {
  const isPublic = drawingVisibility === 'public'
  return (
    <div style={dialogStyle}>
      <div style={containerStyle}>
        <input
          style={inputStyle}
          placeholder="Drawing Name"
          onChange={e => updateInputValue(e.target.value)}
        />
        <div style={toggleButtonContainer}>
          <button
            style={toggleButtonStyle('public', drawingVisibility)}
            onClick={() => setDrawingVisibility('public')}
          >Public</button>
          <button
           style={toggleButtonStyle('private', drawingVisibility)}
           onClick={() => setDrawingVisibility('private')}
          >Private</button>
        </div>
        {
          isPublic ? <p>This drawing will be listed in the main app.</p>
          : <p>This drawing will not be listed in the main app.</p>
        }
        <button onClick={handleClick} style={buttonStyle}>
          Create
        </button>
        <p style={cancelButton} onClick={() => setModalVisible(false)}>Cancel</p>
      </div>
    </div>
  )
}

function toggleButtonStyle(type, drawingVisibility) {
  const isSelected = type === drawingVisibility
  return {
    backgroundColor: isSelected ? '#ff59e3' : '#ddd',
    marginRight: 5,
    padding: '7px 12px',
    outline: 'none'
  }
}

const cancelButton = {
  cursor: 'pointer',
  margin: '8px 0px 0px'
}

const toggleButtonContainer = {
  marginTop: 10
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
  width: 340,
  height: 300,
  left: '50%',
  top: '50%',
  marginLeft: -170,
  marginTop: -150,
  backgroundColor: "#ddd",
}

const containerStyle = {
  display: 'flex',
  flexDirection: 'column',
  width: '300px'
}

const inputStyle = {
  padding: '4px 8px'
}

const buttonStyle = {
  padding: '10px 20px',
};
