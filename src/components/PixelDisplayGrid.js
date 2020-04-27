import React from 'react';
import PixelCell from './PixelDisplayCell';

const PixelGrid = ({ cells, width }) => {
  return (
    <div style={pixelGridStyle(width)}>
      {cells.map(cell => (
        <PixelCell
          key={cell.id}
          cell={cell}
          id={cell.id}
        />
      ))}
    </div>
  )
}

const pixelGridStyle = width => ({
  width,
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap'
})

export default PixelGrid;
