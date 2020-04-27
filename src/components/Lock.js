import React from 'react';

const Lock = ({ toggleOverlay }) => (
  <button type="button" className="reset" onClick={() => toggleOverlay('lock', true)}>
    Lock
  </button>
);

export default Lock