import React, { useState } from 'react'
import { connect } from 'react-redux';
import { duplicateDrawing, lockDrawing, unlockDrawing, setVisibility, setDrawingId } from '../store/actions/actionCreators';
import { useHistory } from 'react-router-dom'
import { v4 as uuid } from 'uuid'
import { API } from 'aws-amplify'
import { createDrawing, updateDrawing } from '../graphql/mutations'

function Overlay({ drawingId, type, setDrawingIdDispatch, toggleOverlay, lockDrawingDispatch, unlockDrawingDispatch, setVisibilityDispatch, clientId, frames }) {
  let history = useHistory();
  const [drawingVisibility, setDrawingVisibility] = useState('public')
  const [drawingName, updateDrawingName] = useState('') 
  async function duplicate() {
    if (!drawingName) return
    const id = uuid()
    const frameData = JSON.stringify(frames)
    const isPublic = drawingVisibility === 'public'
    const drawing = {
      id,
      name: drawingName,
      itemType: isPublic ? 'Drawing' : 'PrivateDrawing',
      public: isPublic,
      data: frameData,
      clientId
    };
    try {
      await API.graphql({ query: createDrawing, variables: { input: drawing }})
      toggleOverlay('', false);
      unlockDrawingDispatch();
      setVisibilityDispatch(isPublic);
      setDrawingIdDispatch(id);
      history.push(`/create/${id}/${drawingName}`);
      console.log('new drawing created...')
    } catch (err) {
      console.log('error...: ', err)
    }
  }
  async function makePublic() {
    const drawing = {
      id: drawingId, public: true, itemType: "Drawing"
    };
    try {
      await API.graphql({ query: updateDrawing, variables: { input: drawing }})
      toggleOverlay('', false);
      setVisibilityDispatch(true);
      console.log('drawing now public...')
    } catch (err) {
      console.log('error making public...: ', err)
    }
  }
  return (
    <div style={dialogStyle(type)}>
      <div style={containerStyle}>
        {
          type === 'lock' && (
            <div>
              <p>This drawing will no longer be editable.</p>
                <button onClick={() => {
                  lockDrawingDispatch();
                  toggleOverlay('', false);
                }} style={buttonStyle}>
                Confirm Lock
              </button>
              <p style={cancelButton} onClick={() => toggleOverlay('', false)}>Cancel</p>
            </div>
          )
        }
        {
          type === 'duplicate' && (
            (
              <div>
                <input
                  style={inputStyle}
                  placeholder="Drawing Name"
                  onChange={e => updateDrawingName(e.target.value)}
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
                  drawingVisibility === 'public' ? <p>This drawing will be listed in the main app.</p>
                  : <p>This drawing will not be listed in the main app.</p>
                }
                <button onClick={duplicate} style={buttonStyle}>
                  Duplicate
                </button>
                <p style={cancelButton} onClick={() => toggleOverlay('', false)}>Cancel</p>
                </div>
            )
          )
        }
        {
          type === 'makePublic' && (
            <div>
              <p>This drawing will now be viewable in the main app.</p>
                <button onClick={makePublic} style={buttonStyle}>
                Confirm to make public
              </button>
              <p style={cancelButton} onClick={() => toggleOverlay('', false)}>Cancel</p>
            </div>
          )
        }
      </div>
    </div>
  )
}

const mapDispatchToProps = dispatch => ({
  duplicateDrawingDispatch: () => dispatch(duplicateDrawing()),
  lockDrawingDispatch: () => dispatch(lockDrawing()),
  unlockDrawingDispatch: () => dispatch(unlockDrawing()),
  setVisibilityDispatch: (visibility) => dispatch(setVisibility(visibility)),
  setDrawingIdDispatch: id => dispatch(setDrawingId(id))
});

const mapStateToProps = state => {
  const currentState = state.present.toJS()
  return {
    frames: currentState.frames,
    clientId: currentState.clientId,
    drawingId: currentState.drawingId
  }
};

const OverlayContainer = connect(
  mapStateToProps,
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
  height: type !== 'duplicate' ? 190 : 300,
  left: '50%',
  top: '50%',
  marginLeft: -170,
  marginTop: type !== 'duplicate' ? -95 : -150,
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
  padding: '6px 20px',
};
