// client/src/components/kundli/SadeSatiCard.jsx
import React from 'react';
import { AlertCircle, Shield, Heart, CheckCircle2, Info, Star } from 'lucide-react'; 

const gradientStyles = `
  .grad-line-gray { background: linear-gradient(to right, transparent, #9ca3af, transparent); }
  .grad-active-header { background: linear-gradient(to right, #1f2937, #111827); }
  .grad-inactive-header { background: linear-gradient(to right, #047857, #064e3b); }
`;

const SadeSatiCard = ({ sadeSatiData, sadeSatiStatus }) => {
  // যদি API থেকে স্ট্যাটাস না আসে, তবে কার্ডটি হাইড থাকবে (No Mock Data)
  if (!sadeSatiStatus) return null;

  return (
    <>
      <style>{gradientStyles}</style>
      <div className="w-full">
        {/* Header Section */}
        <div className="text-center mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-2">
            <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
            <span>Shani Sade Sati</span>
          </h2>
          <div className="w-16 sm:w-20 h-px grad-line-gray mx-auto"></div>
          <p className="text-gray-500 text-xs sm:text-sm mt-2 px-2">7.5 years of karmic growth and transformation</p>
          <p className="text-[10px] sm:text-xs text-gray-400 mt-1">Your Moon Sign: <span className="font-semibold text-gray-600">{sadeSatiStatus.moonSign}</span></p>
        </div>
        
        <div className={`rounded-xl overflow-hidden border-2 shadow-sm ${
          sadeSatiStatus.isActive ? 'border-orange-500' : 'border-emerald-500 bg-emerald-50'
        }`}>
          
          {/* Status Header */}
          <div className={`p-3 sm:p-4 ${sadeSatiStatus.isActive ? 'grad-active-header' : 'grad-inactive-header'} text-white`}>
            <div className="flex items-center gap-2">
              {sadeSatiStatus.isActive ? (
                <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />
              ) : (
                <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0 text-emerald-300" />
              )}
              <h3 className="font-bold text-base sm:text-lg">
                {sadeSatiStatus.isActive ? '🔴 Sade Sati is Active' : '🟢 No Active Sade Sati'}
              </h3>
            </div>
            {sadeSatiStatus.isActive ? (
              <p className="text-gray-300 text-xs sm:text-sm mt-1.5 ml-7 sm:ml-8 font-medium">
                {sadeSatiStatus.phase} • Shani is transiting {sadeSatiStatus.saturnSign || 'Pisces'}
              </p>
            ) : (
              <p className="text-emerald-100 text-xs sm:text-sm mt-1.5 ml-7 sm:ml-8 font-medium">
                You are currently in a karmically clear phase!
              </p>
            )}
          </div>
          
          {sadeSatiData && sadeSatiStatus.isActive ? (
            <div className="p-4 sm:p-5 bg-white">
              <div className="mb-4 sm:mb-5">
                <p className="text-gray-700 text-sm sm:text-base leading-relaxed">{sadeSatiData.effect_description}</p>
              </div>
              
              {/* Positives & Challenges Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-5">
                <div className="bg-green-50/80 border border-green-100 rounded-xl p-3 sm:p-4">
                  <p className="text-xs sm:text-sm text-green-700 font-bold mb-2 uppercase tracking-wide">✨ Positive Aspects</p>
                  <p className="text-sm text-gray-700 font-medium">{sadeSatiData.positive_aspects}</p>
                </div>
                <div className="bg-red-50/80 border border-red-100 rounded-xl p-3 sm:p-4">
                  <p className="text-xs sm:text-sm text-red-700 font-bold mb-2 uppercase tracking-wide">⚠️ Challenges</p>
                  <p className="text-sm text-gray-700 font-medium">{sadeSatiData.challenges}</p>
                </div>
              </div>
              
              <div className="bg-purple-50/80 border border-purple-100 rounded-xl p-3 sm:p-4 mb-4 sm:mb-5">
                <p className="text-xs sm:text-sm text-purple-700 font-bold mb-2 flex items-center gap-1.5 uppercase tracking-wide">
                  <Shield className="w-4 h-4" /> Spiritual Lesson
                </p>
                <p className="text-sm text-gray-700 font-medium leading-relaxed">{sadeSatiData.lesson}</p>
              </div>
              
              <div className="bg-orange-50/50 border border-orange-100 rounded-xl p-3 sm:p-4">
                <p className="text-xs sm:text-sm text-orange-700 font-bold mb-2 flex items-center gap-1.5 uppercase tracking-wide">
                  <Heart className="w-4 h-4" /> Recommended Remedies
                </p>
                <ul className="space-y-1.5 mt-2">
                  {sadeSatiData.remedies && sadeSatiData.remedies.slice(0, 4).map((remedy, idx) => (
                    <li key={idx} className="text-sm text-gray-700 font-medium flex items-start gap-2">
                      <span className="text-orange-500 font-bold mt-0.5">•</span> {remedy}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="p-6 sm:p-8 bg-white">
              <div className="flex flex-col items-center text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 mb-4 border-4 border-emerald-50">
                  <Shield className="w-8 h-8 text-emerald-600" />
                </div>
                <h4 className="text-lg font-bold text-gray-800 mb-2">Relief from Sade Sati!</h4>
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed max-w-lg">
                  Good news! Because your Moon Sign is <strong>{sadeSatiStatus.moonSign}</strong>, Saturn's current transit does not trigger the heavy 7.5-year Sade Sati period for you.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 text-left">
                <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-4">
                  <p className="text-xs sm:text-sm text-emerald-700 font-bold mb-2 flex items-center gap-1.5 uppercase tracking-wide">
                    <Star className="w-4 h-4" /> Current Phase Focus
                  </p>
                  <p className="text-sm text-gray-700 font-medium leading-relaxed">This is an excellent time to focus on steady growth, building positive karma, and executing your plans without the strict restrictions of Saturn.</p>
                </div>
                <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4">
                  <p className="text-xs sm:text-sm text-blue-700 font-bold mb-2 flex items-center gap-1.5 uppercase tracking-wide">
                    <Info className="w-4 h-4" /> Astrological Rule
                  </p>
                  <p className="text-sm text-gray-700 font-medium leading-relaxed">Sade Sati only happens when Saturn transits the 12th, 1st, or 2nd house from your natal Moon. Currently, Saturn is transiting far from these houses.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SadeSatiCard;