// client/src/components/ui/Spinner.jsx
import React from 'react';

const Spinner = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-orange-200 border-t-orange-600 rounded-full animate-spin"></div>
    </div>
  );
};

export default Spinner;