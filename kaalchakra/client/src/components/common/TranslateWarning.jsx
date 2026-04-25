// client/src/components/common/TranslateWarning.jsx
import React, { useState, useEffect } from 'react';
import { AlertCircle, X } from 'lucide-react';

const TranslateWarning = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // চেক করুন Google Translate ব্যবহার হচ্ছে কিনা
    const checkTranslate = setInterval(() => {
      if (document.querySelector('.goog-te-banner-frame')) {
        setShow(true);
      }
    }, 1000);

    return () => clearInterval(checkTranslate);
  }, []);

  if (!show) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm bg-blue-50 border border-blue-200 rounded-lg shadow-lg p-4">
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-sm text-blue-800">
            ⚠️ Google Translate স্বয়ংক্রিয় অনুবাদ। কিছু শব্দের অর্থ সঠিক নাও হতে পারে।
          </p>
          <p className="text-xs text-blue-600 mt-1">
            জ্যোতিষ সংক্রান্ত শব্দের জন্য সঠিক পরামর্শ নিন।
          </p>
        </div>
        <button onClick={() => setShow(false)} className="text-blue-400 hover:text-blue-600">
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

export default TranslateWarning;