import React, { useEffect } from 'react';

export default function Toast({ message, type = 'info', onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);
  
  return (
    <div className={`toast toast-${type}`} role="status" aria-live="polite">
      <span>{message}</span>
      <button onClick={onClose} aria-label="Đóng thông báo">×</button>
    </div>
  );
}
