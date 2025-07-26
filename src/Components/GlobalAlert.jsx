import React, { useEffect, useRef } from 'react';

function GlobalAlert({ type = 'success', message, onClose }) {
  const alertRef = useRef();

  useEffect(() => {
    if (alertRef.current) {
      alertRef.current.scrollIntoView({ behavior: 'smooth' });
    }

    const timeout = setTimeout(() => {
      onClose();
    }, 2500);

    return () => clearTimeout(timeout);
  }, [onClose]);

  return (
    <div ref={alertRef} className={`alert alert-${type} mt-4 text-center`} role="alert">
      {message}
    </div>
  );
}

export default GlobalAlert;
