import React from 'react';

const BigAction: React.FC<{ label: string; onClick: () => void; tone?: 'primary' | 'success' | 'warn' }> = ({ label, onClick, tone = 'primary' }) => {
  const bg = tone === 'success' ? 'var(--success)' : tone === 'warn' ? 'var(--warn)' : 'var(--primary)';
  return (
    <button className="btn-large" style={{ background: bg }} onClick={onClick}>
      {label} 🌟
    </button>
  );
};

export default BigAction;
