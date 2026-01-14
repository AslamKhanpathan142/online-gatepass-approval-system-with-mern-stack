import React from 'react';

const Loader = () => {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center',
      minHeight: '100vh'
    }}>
      <div className="spinner"></div>
    </div>
  );
};

export default Loader;