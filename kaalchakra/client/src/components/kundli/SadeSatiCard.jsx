// client/src/components/kundli/SadeSatiCard.jsx
import React from 'react';
import { AlertCircle, Shield, Heart } from 'lucide-react'; 

const SadeSatiCard = ({ sadeSatiData, sadeSatiStatus }) => {
  if (!sadeSatiStatus) return null;

  return (
    <div className="px-8 pb-8">
      <div className="text-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-2">
          <AlertCircle className="w-6 h-6 text-gray-700" />
          <span>Shani Sade Sati</span>
        </h2>
        <div className="w-20 h-px  mx-auto"></div>
        <p className="text-gray-500 text-sm mt-2">7.5 years of karmic growth and transformation</p>
        <p className="text-xs text-gray-400 mt-1">Your Moon Sign: {sadeSatiStatus.moonSign}</p>
      </div>
      
      <div className={`rounded-xl overflow-hidden border-2 ${
        sadeSatiStatus.isActive ? 'border-orange-500' : 'border-gray-200 bg-gray-50'
      }`}>
        <div className={`p-4 ${sadeSatiStatus.isActive ? 'bg-gradient-to-r from-gray-800 to-gray-900' : 'bg-gray-600'} text-white`}>
          <div className="flex items-center gap-2">
            <AlertCircle className="w-6 h-6" />
            <h3 className="font-bold text-lg">
              {sadeSatiStatus.isActive ? '🔴 Sade Sati is Active' : '🟢 No Active Sade Sati'}
            </h3>
          </div>
          {sadeSatiStatus.isActive && (
            <p className="text-gray-300 text-sm mt-1">
              {sadeSatiStatus.phase} • Shani in Meena (Pisces)
            </p>
          )}
        </div>
        
        {sadeSatiData && sadeSatiStatus.isActive ? (
          <div className="p-5">
            <div className="mb-4">
              <p className="text-gray-700 leading-relaxed">{sadeSatiData.effect_description}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="bg-green-50 rounded-lg p-3">
                <p className="text-xs text-green-600 font-semibold mb-2">✨ Positive Aspects</p>
                <p className="text-sm text-gray-700">{sadeSatiData.positive_aspects}</p>
              </div>
              <div className="bg-red-50 rounded-lg p-3">
                <p className="text-xs text-red-600 font-semibold mb-2">⚠️ Challenges</p>
                <p className="text-sm text-gray-700">{sadeSatiData.challenges}</p>
              </div>
            </div>
            
            <div className="bg-purple-50 rounded-lg p-3 mb-4">
              <p className="text-xs text-purple-600 font-semibold mb-2 flex items-center gap-1">
                <Shield className="w-3 h-3" /> Spiritual Lesson
              </p>
              <p className="text-sm text-gray-700">{sadeSatiData.lesson}</p>
            </div>
            
            <div>
              <p className="text-xs text-orange-600 font-semibold mb-2 flex items-center gap-1">
                <Heart className="w-3 h-3" /> Remedies
              </p>
              <ul className="space-y-1">
                {sadeSatiData.remedies && sadeSatiData.remedies.slice(0, 4).map((remedy, idx) => (
                  <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                    <span className="text-orange-400">•</span> {remedy}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <div className="p-5 text-center">
            <p className="text-gray-500">Sade Sati is not currently active for your Moon Sign ({sadeSatiStatus.moonSign}).</p>
            <p className="text-gray-400 text-sm mt-2">This period brings important life lessons when active.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SadeSatiCard;