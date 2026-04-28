// eslint-disable-next-line no-unused-vars
import React, { useEffect } from 'react';

export default function Root({ children }) {
  useEffect(() => {
    const onKey = (e) => {
      const isMac = /Mac|iPhone|iPad|iPod/.test(navigator.platform);
      const mod = isMac ? e.metaKey : e.ctrlKey;
      if (mod && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        const input = document.querySelector('.navbar__search-input');
        if (input) input.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return <>{children}</>;
}
