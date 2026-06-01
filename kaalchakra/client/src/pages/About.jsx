// client/src/pages/About.jsx
import React, { useState, useEffect } from 'react';
import { Star, Quote, Sparkles, Compass, Heart, Users, Award, Clock, MapPin, ChevronRight, Loader2, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

// ... (api, gradientStyles, StatCard, TestimonialCard, TestimonialCardSkeleton, TeamMember আগের মতোই থাকবে) ...

const About = () => {
  const { t } = useTranslation('pages'); // <-- Hook initialized
  const [activeTab, setActiveTab] = useState('mission');
  const [aboutData, setAboutData] = useState(null);
  const [testimonials, setTestimonials] = useState([]);
  const [stats, setStats] = useState({
    happyClients: '50K+',
    expertAstrologers: '15+',
    yearsOfService: '25+',
    satisfactionRate: '100%'
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // ... (useEffect, fetch functions আগের মতোই) ...

  if (loading && !aboutData) {
    return (
      <>
        <style>{gradientStyles}</style>
        <div className="min-h-screen grad-main-bg py-12 px-4 sm:px-6 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-orange-500 animate-spin mx-auto mb-4" />
            <p className="text-gray-500">{t('about.loading')}</p>
          </div>
        </div>
      </>
    );
  }

  if (error && !aboutData) {
    return (
      <>
        <style>{gradientStyles}</style>
        <div className="min-h-screen grad-main-bg py-12 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
            <p className="text-red-500 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-2 rounded-full"
            >
              {t('about.tryAgain')}
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{gradientStyles}</style>
      <div className="min-h-screen grad-main-bg py-12 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center gap-2 mb-6">
              <div className="w-12 h-12 rounded-full grad-icon-primary flex items-center justify-center shadow-md">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div className="w-12 h-12 rounded-full grad-icon-secondary flex items-center justify-center shadow-md">
                <Compass className="w-6 h-6 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-4 tracking-tight">
              {aboutData?.title || t('about.title')}
            </h1>
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className="w-16 h-px grad-line-right"></div>
              <span className="text-orange-400 text-xl">✨</span>
              <div className="w-16 h-px grad-line-left"></div>
            </div>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto leading-relaxed">
              {aboutData?.description || t('about.description')}
            </p>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
            <StatCard icon={Users} value={stats.happyClients} label={t('about.stats.happyClients')} color="grad-card-orange" />
            <StatCard icon={Star} value={stats.expertAstrologers} label={t('about.stats.expertAstrologers')} color="grad-card-purple" />
            <StatCard icon={Clock} value={stats.yearsOfService} label={t('about.stats.yearsOfService')} color="grad-card-blue" />
            <StatCard icon={Award} value={stats.satisfactionRate} label={t('about.stats.satisfactionRate')} color="grad-card-green" />
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-2 gap-10 mb-16">
            {/* Left Column */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 md:p-8">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-orange-500" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">{aboutData?.scienceTitle || t('about.scienceTitle')}</h2>
                </div>
                <p className="text-gray-700 leading-relaxed mb-4">{aboutData?.scienceDescription1 || t('about.scienceDesc1')}</p>
                <p className="text-gray-700 leading-relaxed mb-4">{aboutData?.scienceDescription2 || t('about.scienceDesc2')}</p>
                <p className="text-gray-700 leading-relaxed">{aboutData?.brandStatement || t('about.brandStatement')}</p>
              </div>

              {/* Tabs Section */}
              <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
                <div className="flex border-b border-gray-100">
                  <button onClick={() => setActiveTab('mission')} className={`flex-1 py-4 text-center font-semibold transition-all ${activeTab === 'mission' ? 'text-orange-500 border-b-2 border-orange-500 bg-orange-50/30' : 'text-gray-500'}`}>{t('about.tabs.mission')}</button>
                  <button onClick={() => setActiveTab('vision')} className={`flex-1 py-4 text-center font-semibold transition-all ${activeTab === 'vision' ? 'text-orange-500 border-b-2 border-orange-500 bg-orange-50/30' : 'text-gray-500'}`}>{t('about.tabs.vision')}</button>
                  <button onClick={() => setActiveTab('values')} className={`flex-1 py-4 text-center font-semibold transition-all ${activeTab === 'values' ? 'text-orange-500 border-b-2 border-orange-500 bg-orange-50/30' : 'text-gray-500'}`}>{t('about.tabs.values')}</button>
                </div>
                
                <div className="p-6">
                  {activeTab === 'mission' && (
                    <div className="space-y-3">
                      <p className="text-gray-700 leading-relaxed">{aboutData?.mission || t('about.missionText')}</p>
                      <div className="flex items-start gap-3 mt-4 pt-3 border-t border-gray-100">
                        <Heart className="w-5 h-5 text-orange-400 mt-0.5" />
                        <p className="text-gray-600 text-sm">{aboutData?.missionSubtext || t('about.missionSub')}</p>
                      </div>
                    </div>
                  )}
                  {activeTab === 'vision' && (
                    <div className="space-y-3">
                      <p className="text-gray-700 leading-relaxed">{aboutData?.vision || t('about.visionText')}</p>
                      <div className="flex items-start gap-3 mt-4 pt-3 border-t border-gray-100">
                        <Compass className="w-5 h-5 text-orange-400 mt-0.5" />
                        <p className="text-gray-600 text-sm">{aboutData?.visionSubtext || t('about.visionSub')}</p>
                      </div>
                    </div>
                  )}
                  {/* ... Values section keeping original logic ... */}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center">
                    <Users className="w-4 h-4 text-orange-500" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">{t('about.expertsTitle')}</h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  {aboutData?.teamMembers ? JSON.parse(aboutData.teamMembers).map((member, idx) => <TeamMember key={idx} {...member} />) : <TeamMember name="Mr. Bidhu Biswas" role="Chief Astrologer" expertise="Vedic & KP" avatar="BB" color="grad-card-orange" />}
                </div>
              </div>

              <div className="grad-box-light rounded-2xl p-6 border border-orange-100">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-orange-500" />
                  {t('about.whyChooseTitle')}
                </h3>
                {/* ... why choose us items ... */}
              </div>
            </div>
          </div>

          {/* Testimonials Section */}
          <div className="mt-8">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">{t('about.testimonialsTitle')}</h2>
              <div className="flex items-center justify-center gap-2">
                <div className="w-12 h-px grad-line-right"></div>
                <Star className="w-4 h-4 text-orange-400 fill-orange-400" />
                <div className="w-12 h-px grad-line-left"></div>
              </div>
              <p className="text-gray-500 mt-3">{t('about.testimonialsSub')}</p>
            </div>
            
            {testimonials.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {testimonials.map((testimonial, index) => <TestimonialCard key={testimonial.id} testimonial={testimonial} index={index} />)}
              </div>
            ) : (
              <div className="text-center py-12"><p className="text-gray-500">{t('about.testimonialsEmpty')}</p></div>
            )}
          </div>

          {/* CTA */}
          <div className="mt-16 text-center">
            <div className="grad-cta rounded-2xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-white mb-2">{t('about.ctaTitle')}</h3>
              <p className="text-orange-100 mb-6">{t('about.ctaSub')}</p>
              <button onClick={() => window.location.href = '/contact'} className="bg-white text-orange-500 font-semibold px-8 py-3 rounded-xl shadow-md hover:scale-105 transition-all">
                {t('about.ctaButton')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default About;