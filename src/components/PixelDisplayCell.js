import React from 'react';

const GRID_INITIAL_COLOR = 'rgba(49, 49, 49, 1)';

export default class PixelCell extends React.Component {
  render() {
    const styles = {
      width: `10px`,
      height: '10px',
      backgroundColor: this.props.cell || GRID_INITIAL_COLOR
    };

    return (
      <div
        style={styles}
      />
    );
  }
}
