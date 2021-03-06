import { List, Map } from 'immutable';
import paletteReducer from './paletteReducer';
import framesReducer from './framesReducer';
import activeFrameReducer from './activeFrameReducer';
import drawingToolReducer from './drawingToolReducer';
import * as types from '../actions/actionTypes';

function setInitialState(state) {
  const cellSize = 10;
  const clientId = '';
  const drawingId = '';

  const initialState = {
    cellSize,
    loading: false,
    notifications: List(),
    duration: 1,
    clientId,
    drawingId,
    isLocked: false,
    isPublic: false
  };

  return state.merge(initialState);
}

function setDrawing(state, action) {
  return state.set('cellSize', action.cellSize);
}

function setCellSize(state, cellSize) {
  return state.merge({ cellSize });
}

function showSpinner(state) {
  return state.merge({ loading: true });
}

function hideSpinner(state) {
  return state.merge({ loading: false });
}

function sendNotification(state, message) {
  return state.merge({
    notifications: message === '' ? List() : List([{ message, id: 0 }])
  });
}

function setDuration(state, duration) {
  return state.merge({ duration });
}

function updateGridBoundaries(state, action) {
  const { x, y, width, height } = action.gridElement.getBoundingClientRect();
  return state.set('gridBoundaries', {
    x,
    y,
    width,
    height
  });
}

function generateDefaultState() {
  return setInitialState(Map(), { type: types.SET_INITIAL_STATE, state: {} });
}

const pipeReducers = reducers => (initialState, action, clientId, drawingId, isLocked, isPublic) =>
  reducers.reduce((state, reducer) => reducer(state, action, clientId, drawingId, isLocked), initialState, isPublic);

function partialReducer(state, action) {
  switch (action.type) {
    case types.SET_INITIAL_STATE:
      return setInitialState(state);
    case types.SET_DRAWING:
      return setDrawing(state, action);
    case types.SET_CELL_SIZE:
      return setCellSize(state, action.cellSize);
    case types.SHOW_SPINNER:
      return showSpinner(state);
    case types.HIDE_SPINNER:
      return hideSpinner(state);
    case types.SEND_NOTIFICATION:
      return sendNotification(state, action.message);
    case types.SET_DURATION:
      return setDuration(state, action.duration);
    case types.NEW_PROJECT:
      return setInitialState(state);
    case types.UPDATE_GRID_BOUNDARIES:
      return updateGridBoundaries(state, action);
    case types.SET_CLIENT_ID:
      return state.set('clientId', action.clientId)
    case types.SET_DRAWING_ID:
      return state.set('drawingId', action.drawingId)
    case types.LOCK_DRAWING:
      return state.set('isLocked', true)
    case types.UNLOCK_DRAWING:
      return state.set('isLocked', false)
    case types.SET_DRAWING_VISIBILITY:
      return state.set('isPublic', action.visibility)
    default:
  }
  return state;
}

export default function(state = generateDefaultState(), action) {
  return partialReducer(state, action).merge({
    drawingTool: drawingToolReducer(state.get('drawingTool'), action),
    palette: paletteReducer(state.get('palette'), action, state.get('isLocked')),
    frames: pipeReducers([framesReducer, activeFrameReducer])(
      state.get('frames'),
      action,
      state.get('clientId'),
      state.get('drawingId'),
      state.get('isLocked'),
      state.get('isPublic')
    )
  });
}
