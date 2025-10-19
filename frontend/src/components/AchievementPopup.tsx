import React from 'react';

const AchievementPopup: React.FC<{ show: boolean; message: string; onClose: () => void }> = ({ show, message, onClose }) => {
  if (!show) return null;
  return (
    <div className="toast pop" role="status" aria-live="assertive">
      <span>🎉</span>
      <strong>{message}</strong>
      <button className="btn-large" style={{ background: 'var(--success)' }} onClick={onClose} aria-label="Close">
        OK
      </button>
    </div>
  );
};

export default AchievementPopup;
