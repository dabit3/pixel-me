import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux';
import { duplicateDrawing, lockDrawing } from '../store/actions/actionCreators';

function Overlay({ type, toggleOverlay, lockDrawingDispatch }) {
  const [drawingVisibility, setDrawingVisibility] = useState('public')
  return (
    <div style={dialogStyle(type)}>
      <div style={containerStyle}>
        {
          type === 'lock' ? (
            <div>
              <p>This drawing will no longer be editable.</p>
                <button onClick={() => {
                  lockDrawingDispatch()
                  toggleOverlay('', false)
                }} style={buttonStyle}>
                Confirm Lock
              </button>
              <p style={cancelButton} onClick={() => toggleOverlay('', false)}>Cancel</p>
            </div>
          ) : (
            <div>
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
    
              <button onClick={handleClick} style={buttonStyle}>
                Create
              </button>
              <p style={cancelButton} onClick={() => setModalVisible(false)}>Cancel</p>
              </div>
          )
        }
      </div>
    </div>
  )
}

const mapDispatchToProps = dispatch => ({
  duplicateDrawingDispatch: () => dispatch(duplicateDrawing()),
  lockDrawingDispatch: () => dispatch(lockDrawing())
});

const OverlayContainer = connect(
  null,
  mapDispatchToProps
)(Overlay);
export default OverlayContainer;

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

const dialogStyle = (type = 'duplicate') => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 100,
  position: 'fixed',
  width: 340,
  height: type === 'lock' ? 190 : 300,
  left: '50%',
  top: '50%',
  marginLeft: -170,
  marginTop: type === 'lock' ? -95 : -150,
  backgroundColor: "#ddd",
})

const containerStyle = {
  display: 'flex',
  flexDirection: 'column',
  width: '300px'
}

const inputStyle = {
  padding: '4px 8px',
  outline: 'none'
}

const buttonStyle = {
  padding: '10px 20px',
};
