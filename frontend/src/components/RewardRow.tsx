import React from 'react';
import ProgressBar from './ProgressBar.tsx';

const RewardRow: React.FC<{ stars: number; goal: number }> = ({ stars, goal }) => {
  const value = Math.min(100, Math.round((stars / Math.max(1, goal)) * 100));
  return (
    <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <div style={{ fontWeight: 800 }}>⭐ {stars}/{goal}</div>
      <div style={{ flex: 1 }}>
        <ProgressBar value={value} />
      </div>
    </div>
  );
};

export default RewardRow;
