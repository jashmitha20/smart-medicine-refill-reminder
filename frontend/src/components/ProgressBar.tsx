import React from 'react';

const ProgressBar: React.FC<{ value: number }> = ({ value }) => (
  <div
    className="progress"
    aria-label={`Progress ${value}%`}
    role="progressbar"
    aria-valuenow={value}
    aria-valuemin={0}
    aria-valuemax={100}
  >
    <span style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
  </div>
);

export default ProgressBar;
