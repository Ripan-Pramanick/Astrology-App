// client/src/Test.jsx
import React from 'react';

const Test = () => {
  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      backgroundColor: '#f3f4f6'
    }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '3rem', color: '#f97316', marginBottom: '1rem' }}>
          🕉️ Kaal Chakra
        </h1>
        <p style={{ color: '#4b5563' }}>If you see this, React is working!</p>
      </div>
    </div>
  );
};

export default Test;