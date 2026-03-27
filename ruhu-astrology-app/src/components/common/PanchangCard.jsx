import React from 'react';
import Card from '../common/Card';

const PanchangCard = () => {
  return (
    <Card>
      <h3 className="text-xl font-bold text-primary mb-4">Aaj Ka Panchang</h3>
      <div className="text-sm text-gray-500 mb-3">New Delhi, India</div>
      <div className="space-y-3 text-sm">
        <div className="flex justify-between pb-2 border-b border-gray-100">
          <span className="text-textLight">Tithi:</span>
          <span className="font-semibold text-textDark">Shukla Chauthi</span>
        </div>
        <div className="flex justify-between pb-2 border-b border-gray-100">
          <span className="text-textLight">Nakshatra:</span>
          <span className="font-semibold text-textDark">Meen</span>
        </div>
        <div className="flex justify-between pb-2 border-b border-gray-100">
          <span className="text-textLight">Yoga:</span>
          <span className="font-semibold text-textDark">Subhaan</span>
        </div>
        <div className="flex justify-between pb-2 border-b border-gray-100">
          <span className="text-textLight">Karana:</span>
          <span className="font-semibold text-textDark">Taitri</span>
        </div>
        <div className="pt-2 mt-2 bg-gray-50 p-3 rounded-lg">
          <div className="flex justify-between mb-2">
            <span className="text-textLight">Vikram Samvat:</span>
            <span className="font-semibold text-textDark">2081 Peggal</span>
          </div>
          <div className="flex justify-between">
            <span className="text-textLight">Shaka Samvat:</span>
            <span className="font-semibold text-textDark">1946 Krodhi</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default PanchangCard;