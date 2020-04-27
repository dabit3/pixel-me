import React from 'react';

const Duplicate = ({ toggleOverlay }) => (
  <button type="button" className="reset" onClick={() => toggleOverlay('duplicate', true)}>
    Duplicate
  </button>
);

export default Duplicate