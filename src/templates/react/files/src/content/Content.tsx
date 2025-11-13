import { useState } from 'react';

export function Content() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: '10px',
        right: '10px',
        padding: '10px',
        background: 'white',
        border: '1px solid #ccc',
        borderRadius: '4px',
        zIndex: 10000,
      }}
    >
      <p>Extension loaded!</p>
      <button onClick={() => setVisible(false)}>Close</button>
    </div>
  );
}
