// client/src/components/kundli/SadeSatiCard.jsx
import React from 'react';
import { AlertCircle, Shield, Heart } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const SadeSatiCard = ({ sadeSatiData, sadeSatiStatus }) => {
  const { t } = useTranslation('kundli');

  if (!sadeSatiStatus) return null;

  return (
    <div className="px-8 pb-8">
      <div className="text-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-2">
          <AlertCircle className="w-6 h-6 text-gray-700" />
          <span>{t('sadeSati.title')}</span>
        </h2>
        <div className="w-20 h-px mx-auto"></div>
        <p className="text-gray-500 text-sm mt-2">{t('sadeSati.subtitle')}</p>
        <p className="text-xs text-gray-400 mt-1">{t('sadeSati.moonSign')}: {sadeSatiStatus.moonSign}</p>
      </div>
      
      <div className={`rounded-xl overflow-hidden border-2 ${
        sadeSatiStatus.isActive ? 'border-orange-500' : 'border-gray-200 bg-gray-50'
      }`}>
        <div className={`p-4 ${sadeSatiStatus.isActive ? 'bg-gradient-to-r from-gray-800 to-gray-900' : 'bg-gray-600'} text-white`}>
          <div className="flex items-center gap-2">
            <AlertCircle className="w-6 h-6" />
            <h3 className="font-bold text-lg">
              {sadeSatiStatus.isActive ? `🔴 ${t('sadeSati.active')}` : `🟢 ${t('sadeSati.inactive')}`}
            </h3>
          </div>
          {sadeSatiStatus.isActive && (
            <p className="text-gray-300 text-sm mt-1">
              {sadeSatiStatus.phase}
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
                <p className="text-xs text-green-600 font-semibold mb-2">✨ {t('sadeSati.positive')}</p>
                <p className="text-sm text-gray-700">{sadeSatiData.positive_aspects}</p>
              </div>
              <div className="bg-red-50 rounded-lg p-3">
                <p className="text-xs text-red-600 font-semibold mb-2">⚠️ {t('sadeSati.challenges')}</p>
                <p className="text-sm text-gray-700">{sadeSatiData.challenges}</p>
              </div>
            </div>
            
            <div className="bg-purple-50 rounded-lg p-3 mb-4">
              <p className="text-xs text-purple-600 font-semibold mb-2 flex items-center gap-1">
                <Shield className="w-3 h-3" /> {t('sadeSati.lesson')}
              </p>
              <p className="text-sm text-gray-700">{sadeSatiData.lesson}</p>
            </div>
            
            <div>
              <p className="text-xs text-orange-600 font-semibold mb-2 flex items-center gap-1">
                <Heart className="w-3 h-3" /> {t('sadeSati.remedies')}
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
            <p className="text-gray-500">{t('sadeSati.notActiveMsg')}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SadeSatiCard;