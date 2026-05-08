// client/src/pages/home/Testimonials.jsx
import React, { useState, useEffect } from 'react';
import { Star, Quote, ChevronLeft, ChevronRight, Users, ThumbsUp, Award } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

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
    console.log('📊 Error:', error);
    
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
        .maybeSingle();  // ← maybeSingle() ব্যবহার করুন, error না আসে

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
    <div className="bg-gradient-to-br from-orange-50 to-amber-50 py-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            What Our <span className="text-orange-500">Clients Say</span>
          </h2>
          <div className="w-24 h-1 bg-orange-500 mx-auto mb-6 rounded-full"></div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Real stories from people who found their cosmic path with us
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-white rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-orange-500" />
            </div>
            <div className="text-3xl font-bold text-orange-500">{happyClients}+</div>
            <div className="text-gray-600">Happy Clients</div>
          </div>
          <div className="bg-white rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ThumbsUp className="w-8 h-8 text-orange-500" />
            </div>
            <div className="text-3xl font-bold text-orange-500">{satisfaction}%</div>
            <div className="text-gray-600">Satisfaction Rate</div>
          </div>
          <div className="bg-white rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="w-8 h-8 text-orange-500" />
            </div>
            <div className="text-3xl font-bold text-orange-500">{yearsOfExperience}+</div>
            <div className="text-gray-600">Years Experience</div>
          </div>
        </div>

        {/* Testimonials Carousel */}
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
            <p className="text-gray-500">No testimonials yet. Be the first to share your experience!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Testimonials;