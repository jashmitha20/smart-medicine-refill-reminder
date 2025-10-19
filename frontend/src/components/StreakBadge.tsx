import React from 'react';

const StreakBadge: React.FC<{ streak: number }> = ({ streak }) => (
  <span className="badge badge--streak" aria-label={`Streak ${streak} days`}>
    🔥 {streak} day{streak === 1 ? '' : 's'}
  </span>
);

export default StreakBadge;
