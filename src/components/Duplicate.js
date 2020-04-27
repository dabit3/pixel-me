import React from 'react';
import { connect } from 'react-redux';
import { duplicateDrawing } from '../store/actions/actionCreators';

const Duplicate = ({ duplicateDrawingDispatch }) => (
  <button type="button" className="reset" onClick={duplicateDrawingDispatch}>
    Duplicate
  </button>
);

const mapDispatchToProps = dispatch => ({
  duplicateDrawingDispatch: () => dispatch(duplicateDrawing())
});

const DuplicateContainer = connect(
  null,
  mapDispatchToProps
)(Duplicate);
export default DuplicateContainer;
