import React from 'react';
import Card from '../ui/Card';

const PanchangCard = () => {
  return (
    <Card>
      <h3 className="text-xl font-bold text-primary mb-4">Aaj Ka Panchang</h3>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Tithi:</span>
          <span className="font-semibold">Shukla Chauthi</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Nakshatra:</span>
          <span className="font-semibold">Meen</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Yoga:</span>
          <span className="font-semibold">Subhaan</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Karana:</span>
          <span className="font-semibold">Taitri</span>
        </div>
        <div className="border-t pt-2 mt-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Vikram Samvat:</span>
            <span className="font-semibold">2081 Peggal</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Shaka Samvat:</span>
            <span className="font-semibold">1946 Krodhi</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default PanchangCard;