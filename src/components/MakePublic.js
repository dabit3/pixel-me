import React from 'react';

const Duplicate = ({ toggleOverlay }) => (
  <button type="button" className="reset" onClick={() => toggleOverlay('makePublic', true)}>
    Make Public
  </button>
);

export default Duplicate