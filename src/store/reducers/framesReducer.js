import { List, Map, fromJS } from 'immutable';
import shortid from 'shortid';
import * as types from '../actions/actionTypes';
import { API } from 'aws-amplify'
import { updateDrawing } from '../../graphql/mutations'

const createGrid = numCells => {
  let newGrid = List();
  // Set every cell with the initial color
  for (let i = 0; i < numCells; i++) {
    newGrid = newGrid.push('');
  }
  return newGrid;
};

const resizeGrid = (grid, gridProperty, increment, dimensions) => {
  const totalCells = dimensions.rows * dimensions.columns;
  let newGrid = grid;

  if (gridProperty === 'columns') {
    // Resize by columns
    if (increment > 0) {
      // Add a row at the end
      for (let i = totalCells; i > 0; i -= dimensions.columns) {
        newGrid = newGrid.insert(i, '');
      }
    } else {
      for (let i = totalCells; i > 0; i -= dimensions.columns) {
        newGrid = newGrid.splice(i - 1, 1);
      }
    }
  } else if (gridProperty === 'rows') {
    // Resize by rows
    if (increment > 0) {
      // Add a row at the end
      for (let i = 0; i < dimensions.columns; i++) {
        newGrid = newGrid.push('');
      }
    } else {
      // Remove the last row
      for (let i = 0; i < dimensions.columns; i++) {
        newGrid = newGrid.splice(-1, 1);
      }
    }
  }

  return newGrid;
};

const create = (cellsCount, intervalPercentage) =>
  Map({
    grid: createGrid(cellsCount),
    interval: intervalPercentage,
    key: shortid.generate()
  });

const resetIntervals = frameList => {
  const equalPercentage = 100 / frameList.size;

  return frameList.map((frame, index) => {
    const percentage =
      index === frameList.size - 1
        ? 100
        : Math.round((index + 1) * equalPercentage * 10) / 10;
    return Map({
      grid: frame.get('grid'),
      interval: percentage,
      key: frame.get('key')
    });
  });
};

const getFrame = (frames, frameId) => {
  const frameList = frames.get('list');
  const frame = frameList.get(frameId);
  return Map({
    grid: frame.get('grid'),
    interval: frame.get('interval'),
    key: shortid.generate()
  });
};

const initFrames = (action = {}) => {
  const options = action.options || {};
  const columns = parseInt(options.columns, 10) || 20;
  const rows = parseInt(options.rows, 10) || 20;
  const list = resetIntervals(List([create(columns * rows)]));
  return Map({
    list,
    columns,
    rows,
    activeIndex: 0
  });
};

const changeActiveFrame = (frames, action) => {
  const activeIndex = action.frameIndex;
  return frames.merge({ activeIndex });
};

const reorderFrame = (frames, action) => {
  const frameList = frames.get('list');
  const { selectedIndex, destinationIndex } = action;
  const targetIsBefore = selectedIndex < destinationIndex;
  const insertPosition = destinationIndex + (targetIsBefore ? 1 : 0);
  const deletePosition = selectedIndex + (targetIsBefore ? 0 : 1);
  const list = resetIntervals(
    frameList
      .splice(insertPosition, 0, getFrame(frames, selectedIndex))
      .splice(deletePosition, 1)
  );

  return frames.merge({
    list,
    activeIndex: destinationIndex
  });
};

const createNewFrame = frames => {
  const frameList = frames.get('list');
  const list = resetIntervals(
    frameList.push(create(frameList.getIn([0, 'grid']).size, 100))
  );
  return frames.merge({
    list,
    activeIndex: frameList.size
  });
};

const deleteFrame = (frames, action) => {
  const { frameId } = action;
  const frameList = frames.get('list');
  if (frameList.size <= 1) {
    return frames;
  }
  const activeIndex = frames.get('activeIndex');
  const reduceFrameIndex = activeIndex >= frameId && activeIndex > 0;
  return frames.merge(
    {
      list: resetIntervals(frameList.splice(frameId, 1))
    },
    reduceFrameIndex ? { activeIndex: frameList.size - 2 } : {}
  );
};

const duplicateFrame = (frames, action) => {
  const { frameId } = action;
  const frameList = frames.get('list');
  const list = resetIntervals(
    frameList.splice(frameId, 0, getFrame(frames, frameId))
  );
  return frames.merge({
    list,
    activeIndex: frameId + 1
  });
};

const changeDimensions = (frames, { gridProperty, increment }) => {
  const dimensions = {
    columns: frames.get('columns'),
    rows: frames.get('rows')
  };
  const list = frames.get('list').map(frame =>
    Map({
      grid: resizeGrid(frame.get('grid'), gridProperty, increment, dimensions),
      interval: frame.get('interval'),
      key: frame.get('key')
    })
  );
  return frames.merge({
    list,
    [gridProperty]: frames.get(gridProperty) + increment
  });
};

const setFrames = (frames, action) => {
  const { columns, rows } = action;
  const frameList = action.frames;
  return fromJS({
    list: frameList,
    columns,
    rows,
    activeIndex: 0
  });
};

const setFramesFromAPI = (frames) => {
  return fromJS(frames);
};

export default function(frames = initFrames(), action, clientId, drawingId) {
  switch (action.type) {
    case types.SET_INITIAL_STATE:
    case types.NEW_PROJECT:
      return initFrames(action);
    case types.SET_DRAWING:
      return setFrames(frames, action);
    case types.SET_DRAWING_FROM_API:
      const framesWithActiveIndex = { ...frames.toJS(), ...action.frames }
      return setFramesFromAPI(framesWithActiveIndex);
    case types.CHANGE_ACTIVE_FRAME:
      return changeActiveFrame(frames, action);
    case types.REORDER_FRAME:
      return reorderFrame(frames, action);
    case types.CREATE_NEW_FRAME:
      const newFrame = createNewFrame(frames, action).toJS()
      updateApiWithClientId(newFrame, drawingId, clientId)
      return createNewFrame(frames);
    case types.DELETE_FRAME:
      const newFrames = deleteFrame(frames, action).toJS()
      updateApiWithClientId(newFrames, drawingId, clientId)
      return deleteFrame(frames, action);
    case types.DUPLICATE_FRAME:
      const newFrameData = duplicateFrame(frames, action).toJS()
      updateApiWithClientId(newFrameData, drawingId, clientId)
      return duplicateFrame(frames, action);
    case types.CHANGE_DIMENSIONS:
      const newDimensions = changeDimensions(frames, action).toJS()
      updateApi(newDimensions, drawingId)
      return changeDimensions(frames, action);
    default:
      return frames;
  }
}

async function updateApiWithClientId(newFrames, id, clientId) {
  const { activeIndex, ...frames } = newFrames
  const drawing = { id, clientId, data: JSON.stringify(frames) }
  try {
    console.log('drawing:', drawing)
    await API.graphql({
      query: updateDrawing,
      variables: { input: drawing }
    })
    console.log('successfully updated drawing: ', drawing)
  } catch (err) {
    console.log('error updating: ', err)
  }
}

async function updateApi(newFrames, id) {
  const { activeIndex, ...frames } = newFrames
  const drawing = { id, data: JSON.stringify(frames) }
  try {
    console.log('drawing:', drawing)
    await API.graphql({
      query: updateDrawing,
      variables: { input: drawing }
    })
    console.log('successfully updated drawing: ', drawing)
  } catch (err) {
    console.log('error updating: ', err)
  }
}