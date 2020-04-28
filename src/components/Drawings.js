import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { v4 as uuid } from 'uuid';
import { API } from 'aws-amplify'
import { Link } from 'react-router-dom'
import { itemsByType } from '../graphql/queries'
import PixelGrid from './PixelDisplayGrid'
import { List } from 'immutable'

export default function Drawings() {
  const [drawings, setDrawings] = useState([])
  const [modalVisible, setModalVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const [nextToken, setNextToken] = useState('')
  useEffect(() => {
    fetchDrawings()
  }, [])
  async function fetchDrawings() {
    try {
      const apiData = await API.graphql({ query: itemsByType, variables: { limit: 5, itemType: "Drawing" }})
      setDrawings(apiData.data.itemsByType.items)
      console.log('apiData:', apiData)
      if (apiData.data.itemsByType.nextToken) {
        setNextToken(apiData.data.itemsByType.nextToken)
      }
    } catch (err) {
      console.log('error fetching drawings...: ', err)
    }
  }
  async function listMore() {
    setLoading(true)
    try {
      const apiData = await API.graphql({ query: itemsByType, variables: { nextToken, limit: 5, itemType: "Drawing" }})
      setDrawings([...drawings, ...apiData.data.itemsByType.items])
      console.log('apiData: ', apiData)
      if (apiData.data.itemsByType.nextToken) {
        setNextToken(apiData.data.itemsByType.nextToken)
      } else {
        setNextToken('')
      }
      setLoading(false)
    } catch (err) {
      console.log('error fetching drawings...: ', err)
      setLoading(false)
    }
  }
  
  let history = useHistory();
  function handleClick(inputValue, drawingVisibility) {
    if (!inputValue) return
    const id = uuid();
    history.push(`/create/${id}/${inputValue}/${drawingVisibility}`);
  }
  return (
    <div>
      { modalVisible && (
        <Dialog
          handleClick={handleClick}
          setModalVisible={setModalVisible}
        />
      ) }
      <button onClick={() => setModalVisible(true)} style={buttonStyle}>
        Create new Drawing
      </button>
      <div  style={containerStyle}>
        {
          drawings.map(drawing => {
            const drawingData = JSON.parse(drawing.data)
            const cells = drawingData.list[0].grid
            return (
              <h1 key={drawing.id}>
                <Link to={`/drawing/${drawing.id}/${drawing.name}`} style={drawingNameStyle}>
                  { drawing.name }
                </Link>
                <Link to={`/drawing/${drawing.id}/${drawing.name}`}>
                  <PixelGrid
                    cells={List(cells)}
                    width={drawingData.columns * 10}
                  />
                </Link>
              </h1>
            )
          })
        }
      </div>
      {
        nextToken && (
          <button onClick={listMore} style={buttonStyle}>
            {loading ? "Loading..." : "View More"}
          </button>
        )
      }
     
    </div>
  );
}

function Dialog({ handleClick, setModalVisible }) {
  const [inputValue, updateInputValue] = useState('')
  const [drawingVisibility, setDrawingVisibility] = useState('public')

  const isPublic = drawingVisibility === 'public'
  return (
    <div style={dialogStyle}>
      <div style={dialogContainerStyle}>
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
        <button onClick={() => handleClick(inputValue, drawingVisibility)} style={buttonStyle}>
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

const dialogContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  width: '300px'
}

const containerStyle = {
  marginTop: 40
}

const inputStyle = {
  padding: '4px 8px',
  outline: 'none'
}

const buttonStyle = {
  padding: '10px 20px',
};

const drawingNameStyle = {
  color: "#ff59e3",
  textDecoration: 'none'
}