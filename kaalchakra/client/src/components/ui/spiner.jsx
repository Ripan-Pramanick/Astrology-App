// একটি উদাহরণ কোড (Component)
import React, { useState } from 'react';

const CosmicSpinner = () => {

  return (
    <div className="flex flex-col items-center justify-center space-y-8 p-10 bg-slate-900 rounded-3xl">
      
      
      <img 
        src="/images/spinner-chakra.svg" // আপনার পাবলিক ফোল্ডারে ছবির পাথ
        alt="Zodiac Chakra Spinner" 
        className="h-60 w-60 animate-spin" // Tailwind-এর animate-spin ক্লাস
        style={{ animationDuration: `${6 / speed}s` }} // গতি নিয়ন্ত্রণ করার লজিক
      />
    </div>
  );
};

export default CosmicSpinner;