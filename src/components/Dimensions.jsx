import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Picker from './Picker';
import * as actionCreators from '../store/actions/actionCreators';
import { withRouter } from 'react-router'

const Dimensions = props => {
  const { id } = props.match.params;
  const changeDimensions = (gridProperty, behaviour) => {
    props.actions.changeDimensions(gridProperty, behaviour, id);
  };

  const { columns, rows } = props;

  return (
    <div className="dimensions">
      <Picker type="columns" value={columns} action={changeDimensions} />
      <Picker type="rows" value={rows} action={changeDimensions} />
    </div>
  );
};

const mapStateToProps = state => ({
  columns: state.present.getIn(['frames', 'columns']),
  rows: state.present.getIn(['frames', 'rows'])
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actionCreators, dispatch)
});

const DimensionsContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Dimensions);

export default withRouter(DimensionsContainer);
