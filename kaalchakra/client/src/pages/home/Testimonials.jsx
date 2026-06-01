import React, { useState, useEffect } from 'react';
import { Star, Quote, ChevronLeft, ChevronRight, Users, ThumbsUp, Award, Globe } from 'lucide-react';

// ---------------------------------------------------------
// NOTE: Replace this mock with your actual Supabase import in your project:
// import { supabase } from '../../lib/supabase';
// ---------------------------------------------------------
const supabase = {
  from: (table) => ({
    select: () => ({
      eq: () => ({
        order: async () => ({
          data: [
            { id: 1, name: 'Ananya Sharma', location: 'Mumbai', content: 'The Vedic Kundli reading was extremely accurate. It completely changed my perspective on my career.', image_url: 'https://i.pravatar.cc/150?u=1' },
            { id: 2, name: 'Rahul Verma', location: 'Delhi', content: 'Found my cosmic path through their guidance. The matchmaking feature is spot on!', image_url: 'https://i.pravatar.cc/150?u=2' }
          ],
          error: null
        })
      }),
      maybeSingle: async () => ({
        data: { happyClients: 5400, satisfaction: 99, yearsOfExperience: 16 },
        error: null
      })
    })
  })
};

// ==========================================
// 🌍 Translations Dictionary
// ==========================================
const resources = {
  en: {
    translation: {
      headingPart1: "What Our",
      headingPart2: "Clients Say",
      subheading: "Real stories from people who found their cosmic path with us",
      statClients: "Happy Clients",
      statSatisfaction: "Satisfaction Rate",
      statExperience: "Years Experience",
      noTestimonials: "No testimonials yet. Be the first to share your experience!"
    }
  },
  bn: {
    translation: {
      headingPart1: "আমাদের",
      headingPart2: "গ্রাহকরা কী বলেন",
      subheading: "আমাদের সাথে যারা তাদের মহাজাগতিক পথ খুঁজে পেয়েছেন তাদের বাস্তব গল্প",
      statClients: "সন্তুষ্ট গ্রাহক",
      statSatisfaction: "সন্তুষ্টির হার",
      statExperience: "বছরের অভিজ্ঞতা",
      noTestimonials: "এখনও কোনো মতামত নেই। আপনার অভিজ্ঞতা শেয়ার করা প্রথম ব্যক্তি হন!"
    }
  },
  hi: {
    translation: {
      headingPart1: "हमारे",
      headingPart2: "ग्राहक क्या कहते हैं",
      subheading: "उन लोगों की वास्तविक कहानियाँ जिन्होंने हमारे साथ अपना ब्रह्मांडीय मार्ग खोजा",
      statClients: "संतुष्ट ग्राहक",
      statSatisfaction: "संतुष्टि दर",
      statExperience: "वर्षों का अनुभव",
      noTestimonials: "अभी तक कोई प्रशंसापत्र नहीं। अपना अनुभव साझा करने वाले पहले व्यक्ति बनें!"
    }
  },
  mr: {
    translation: {
      headingPart1: "आमचे",
      headingPart2: "ग्राहक काय म्हणतात",
      subheading: "ज्यांनी आमच्यासोबत त्यांचा वैश्विक मार्ग शोधला त्यांच्या खऱ्या कथा",
      statClients: "समाधानी ग्राहक",
      statSatisfaction: "समाधान दर",
      statExperience: "वर्षांचा अनुभव",
      noTestimonials: "अद्याप कोणतेही प्रमाणपत्र नाही. आपला अनुभव सामायिक करणारे पहिले व्हा!"
    }
  },
  ta: {
    translation: {
      headingPart1: "எங்கள்",
      headingPart2: "வாடிக்கையாளர்கள் என்ன சொல்கிறார்கள்",
      subheading: "எங்களுடன் தங்கள் அண்டப் பாதையைக் கண்டறிந்தவர்களின் உண்மைக் கதைகள்",
      statClients: "மகிழ்ச்சியான வாடிக்கையாளர்கள்",
      statSatisfaction: "திருப்தி விகிதம்",
      statExperience: "வருடங்களின் அனுபவம்",
      noTestimonials: "இன்னும் சான்றுகள் இல்லை. உங்கள் அனுபவத்தைப் பகிர்ந்துகொள்ளும் முதல் நபராக இருங்கள்!"
    }
  },
  te: {
    translation: {
      headingPart1: "మా",
      headingPart2: "క్లయింట్లు ఏమి చెబుతారు",
      subheading: "మాతో తమ విశ్వ మార్గాన్ని కనుగొన్న వ్యక్తుల నిజమైన కథలు",
      statClients: "సంతోషకరమైన క్లయింట్లు",
      statSatisfaction: "సంతృప్తి రేటు",
      statExperience: "సంవత్సరాల అనుభవం",
      noTestimonials: "ఇంకా ఎటువంటి టెస్టిమోనియల్స్ లేవు. మీ అనుభవాన్ని పంచుకున్న మొదటి వ్యక్తి అవ్వండి!"
    }
  }
};

const useTranslation = () => {
  const [language, setLanguage] = useState('bn');
  
  const t = (key) => {
    return resources[language]?.translation[key] || resources['en'].translation[key] || key;
  };

  const i18n = {
    language,
    changeLanguage: (lang) => setLanguage(lang)
  };

  return { t, i18n };
};

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const { t, i18n } = useTranslation();

  useEffect(() => {
    fetchTestimonials();
    fetchStats();
  }, []);
  
  const fetchTestimonials = async () => {
    try {
      console.log('🟢 Fetching testimonials...');
      
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .eq('is_approved', true)
        .order('created_at', { ascending: false });

      console.log('📊 Testimonials data:', data);
      
      if (error) throw error;
      setTestimonials(data || []);
    } catch (err) {
      console.error('Error fetching testimonials:', err);
      setTestimonials([]);
    }
  };

  const fetchStats = async () => {
    try {
      // টেস্টিমোনিয়াল_stats টেবিল চেক করুন
      const { data, error } = await supabase
        .from('testimonial_stats')
        .select('*')
        .maybeSingle(); 

      if (data) {
        setStats(data);
      } else {
        // টেবিল না থাকলে ডিফল্ট মান
        setStats({
          happyClients: 5000,
          satisfaction: 98,
          yearsOfExperience: 15
        });
      }
    } catch (err) {
      console.error('Error fetching stats:', err);
      setStats({
        happyClients: 5000,
        satisfaction: 98,
        yearsOfExperience: 15
      });
    } finally {
      setLoading(false);
    }
  };

  const nextSlide = () => {
    if (testimonials.length > 0) {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }
  };

  const prevSlide = () => {
    if (testimonials.length > 0) {
      setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-50 py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-48 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-96 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  // ✅ নিরাপদে stats ব্যবহার করুন (null check সহ)
  const happyClients = stats?.happyClients || 0;
  const satisfaction = stats?.satisfaction || 98;
  const yearsOfExperience = stats?.yearsOfExperience || 15;

  return (
    <div className="bg-gradient-to-br from-orange-50 to-amber-50 py-16 px-4 relative">
      
      {/* Language Switcher for Preview */}
      <div className="absolute top-4 right-4 flex items-center gap-2 bg-white px-3 py-1.5 rounded-full shadow-sm border border-gray-200 z-10">
        <Globe className="w-4 h-4 text-gray-500" />
        <select 
          value={i18n.language} 
          onChange={(e) => i18n.changeLanguage(e.target.value)}
          className="bg-transparent text-sm font-medium text-gray-700 outline-none cursor-pointer"
        >
          <option value="en">English</option>
          <option value="bn">বাংলা</option>
          <option value="hi">हिन्दी</option>
          <option value="mr">मराठी</option>
          <option value="ta">தமிழ்</option>
          <option value="te">తెలుగు</option>
        </select>
      </div>

      <div className="max-w-6xl mx-auto mt-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            {t('headingPart1')} <span className="text-orange-500">{t('headingPart2')}</span>
          </h2>
          <div className="w-24 h-1 bg-orange-500 mx-auto mb-6 rounded-full"></div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            {t('subheading')}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-white rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-orange-500" />
            </div>
            <div className="text-3xl font-bold text-orange-500">{happyClients}+</div>
            <div className="text-gray-600">{t('statClients')}</div>
          </div>
          <div className="bg-white rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ThumbsUp className="w-8 h-8 text-orange-500" />
            </div>
            <div className="text-3xl font-bold text-orange-500">{satisfaction}%</div>
            <div className="text-gray-600">{t('statSatisfaction')}</div>
          </div>
          <div className="bg-white rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="w-8 h-8 text-orange-500" />
            </div>
            <div className="text-3xl font-bold text-orange-500">{yearsOfExperience}+</div>
            <div className="text-gray-600">{t('statExperience')}</div>
          </div>
        </div>

        {}
        {testimonials.length > 0 ? (
          <div className="relative bg-white rounded-2xl shadow-xl p-8 md:p-12">
            <Quote className="absolute top-6 right-6 w-12 h-12 text-orange-100" />

            <div className="text-center">
              <div className="flex justify-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 text-lg md:text-xl leading-relaxed mb-6">
                "{testimonials[currentIndex]?.content || testimonials[currentIndex]?.text}"
              </p>
              <div className="flex items-center justify-center gap-3 mb-2">
                {testimonials[currentIndex]?.image_url && (
                  <img
                    src={testimonials[currentIndex].image_url}
                    alt={testimonials[currentIndex].name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                )}
                <div>
                  <h4 className="font-bold text-gray-800">{testimonials[currentIndex]?.name}</h4>
                  <p className="text-sm text-gray-500">{testimonials[currentIndex]?.location}</p>
                </div>
              </div>
            </div>

            {/* Navigation Buttons */}
            {testimonials.length > 1 && (
              <div className="flex justify-center gap-4 mt-8">
                <button
                  onClick={prevSlide}
                  className="p-2 rounded-full bg-orange-100 hover:bg-orange-200 transition"
                >
                  <ChevronLeft className="w-5 h-5 text-orange-600" />
                </button>
                <button
                  onClick={nextSlide}
                  className="p-2 rounded-full bg-orange-100 hover:bg-orange-200 transition"
                >
                  <ChevronRight className="w-5 h-5 text-orange-600" />
                </button>
              </div>
            )}

            {/* Dots Indicator */}
            <div className="flex justify-center gap-2 mt-6">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-2 h-2 rounded-full transition ${idx === currentIndex ? 'bg-orange-500 w-4' : 'bg-orange-200'
                    }`}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-2xl">
            <p className="text-gray-500">{t('noTestimonials')}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Testimonials;