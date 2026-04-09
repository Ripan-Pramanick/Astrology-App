// client/src/pages/About.jsx
import React, { useState } from 'react';
import { Star, Quote, Sparkles, Compass, Heart, Users, Award, Clock, MapPin, ChevronRight } from 'lucide-react';

// Testimonials Data
const testimonials = [
  {
    id: 1,
    name: "Priya Sharma",
    role: "Marketing Professional",
    zodiac: "Virgo",
    content: "The personalized birth chart reading was incredibly accurate. It helped me understand my career path better and gave me confidence to pursue my dreams.",
    rating: 5,
    avatar: "PS",
    location: "Mumbai, India"
  },
  {
    id: 2,
    name: "Rajesh Mehta",
    role: "Business Owner",
    zodiac: "Taurus",
    content: "Matchmaking service was exceptional. The detailed analysis and compatibility report helped our families make an informed decision. Highly recommended!",
    rating: 5,
    avatar: "RM",
    location: "Delhi, India"
  },
  {
    id: 3,
    name: "Ananya Krishnan",
    role: "Software Engineer",
    zodiac: "Pisces",
    content: "The muhurata consultation for our house warming was spot on. Everything went smoothly and auspiciously. Thank you for your guidance.",
    rating: 4,
    avatar: "AK",
    location: "Bangalore, India"
  },
  {
    id: 4,
    name: "Vikram Singh",
    role: "Entrepreneur",
    zodiac: "Leo",
    content: "The career consultation gave me clarity on business timing. Following the advice led to successful funding rounds.",
    rating: 5,
    avatar: "VS",
    location: "Jaipur, India"
  },
  {
    id: 5,
    name: "Neha Gupta",
    role: "Teacher",
    zodiac: "Cancer",
    content: "Name correction service brought positive changes in my life. The process was professional and well-explained.",
    rating: 5,
    avatar: "NG",
    location: "Lucknow, India"
  },
  {
    id: 6,
    name: "Arjun Nair",
    role: "Doctor",
    zodiac: "Sagittarius",
    content: "Excellent insights into health and wellbeing. The planetary remedies suggested have shown remarkable results.",
    rating: 4,
    avatar: "AN",
    location: "Chennai, India"
  }
];

// Stat Card Component
const StatCard = ({ icon: Icon, value, label, color }) => (
  <div className="bg-white rounded-xl p-6 text-center shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 hover:-translate-y-1">
    <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center mx-auto mb-4`}>
      <Icon className="w-6 h-6 text-white" />
    </div>
    <p className="text-2xl md:text-3xl font-bold text-gray-800">{value}</p>
    <p className="text-gray-500 text-sm mt-1">{label}</p>
  </div>
);

// Testimonial Card Component
const TestimonialCard = ({ testimonial, index }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
    {/* Quote Icon */}
    <div className="mb-4">
      <Quote className="w-8 h-8 text-orange-200 group-hover:text-orange-300 transition-colors" />
    </div>
    
    {/* Rating Stars */}
    <div className="flex gap-1 mb-3">
      {[...Array(5)].map((_, i) => (
        <Star 
          key={i} 
          className={`w-4 h-4 ${i < testimonial.rating ? 'text-orange-400 fill-orange-400' : 'text-gray-300'}`} 
        />
      ))}
    </div>
    
    {/* Content */}
    <p className="text-gray-600 text-sm leading-relaxed mb-4">
      "{testimonial.content}"
    </p>
    
    {/* Divider */}
    <div className="border-t border-gray-100 pt-4 mt-2">
      {/* Avatar */}
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white font-semibold text-sm shadow-sm">
          {testimonial.avatar}
        </div>
        <div>
          <p className="font-semibold text-gray-800">{testimonial.name}</p>
          <p className="text-xs text-gray-400">{testimonial.role}</p>
        </div>
      </div>
      
      {/* Details */}
      <div className="flex items-center gap-3 text-xs text-gray-400 mt-2">
        <span className="flex items-center gap-1">
          <MapPin className="w-3 h-3" /> {testimonial.location}
        </span>
        <span className="flex items-center gap-1">
          <Star className="w-3 h-3" /> {testimonial.zodiac}
        </span>
      </div>
    </div>
  </div>
);

// Team Member Component
const TeamMember = ({ name, role, expertise, avatar, color }) => (
  <div className="text-center group">
    <div className={`w-24 h-24 mx-auto rounded-full ${color} flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-300 mb-4`}>
      <span className="text-white text-2xl font-bold">{avatar}</span>
    </div>
    <h4 className="font-bold text-gray-800">{name}</h4>
    <p className="text-orange-500 text-sm font-medium">{role}</p>
    <p className="text-gray-400 text-xs mt-1">{expertise}</p>
  </div>
);

const About = () => {
  const [activeTab, setActiveTab] = useState('mission');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center gap-2 mb-6">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-md">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-md">
              <Compass className="w-6 h-6 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-4 tracking-tight">
            About Vedic Astrology
          </h1>
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="w-16 h-px bg-gradient-to-r from-transparent to-orange-300"></div>
            <span className="text-orange-400 text-xl">✨</span>
            <div className="w-16 h-px bg-gradient-to-l from-transparent to-orange-300"></div>
          </div>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto leading-relaxed">
            Vedic astrology, also known as <span className="font-semibold text-gray-800">Jyotish Shastra</span>, is a traditional system of astrology 
            that originated in ancient India. Based on the Vedas, the oldest sacred texts of Hinduism, 
            it has been guiding humanity for thousands of years.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          <StatCard icon={Users} value="50K+" label="Happy Clients" color="bg-gradient-to-br from-orange-500 to-amber-500" />
          <StatCard icon={Star} value="15+" label="Expert Astrologers" color="bg-gradient-to-br from-purple-500 to-pink-500" />
          <StatCard icon={Clock} value="25+" label="Years of Service" color="bg-gradient-to-br from-blue-500 to-cyan-500" />
          <StatCard icon={Award} value="100%" label="Satisfaction Rate" color="bg-gradient-to-br from-emerald-500 to-green-500" />
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-10 mb-16">
          {/* Left Column - About Text */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 md:p-8">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-orange-500" />
                </div>
                <h2 className="text-xl font-bold text-gray-800">The Science of Light</h2>
              </div>
              <p className="text-gray-700 leading-relaxed mb-4">
                Astrology or Jyotisha connects human life with cosmic order and karmic patterns. 
                It is not just about making predictions or analyzing personality traits, but about understanding 
                the cosmic play of karma, the soul's journey, and the individual's role in the greater scheme of the universe.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                Vedic astrology offers guidance, self-awareness, and a deeper understanding of life's purpose and challenges. 
                Rooted in ancient wisdom, it provides insights into the karmic forces at play and helps us live more fulfilling 
                and purposeful lives, making informed choices leading to material and spiritual success.
              </p>
              <p className="text-gray-700 leading-relaxed">
                At <span className="font-semibold text-orange-500">Kaal-Chakra</span>, we combine traditional Jyotish knowledge 
                with modern technology to provide accurate and personalized astrological services. Our team of experienced 
                astrologers is dedicated to helping you navigate life's complexities.
              </p>
            </div>

            {/* Tabs Section */}
            <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
              <div className="flex border-b border-gray-100">
                <button
                  onClick={() => setActiveTab('mission')}
                  className={`flex-1 py-4 text-center font-semibold transition-all duration-200 ${
                    activeTab === 'mission'
                      ? 'text-orange-500 border-b-2 border-orange-500 bg-orange-50/30'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Our Mission
                </button>
                <button
                  onClick={() => setActiveTab('vision')}
                  className={`flex-1 py-4 text-center font-semibold transition-all duration-200 ${
                    activeTab === 'vision'
                      ? 'text-orange-500 border-b-2 border-orange-500 bg-orange-50/30'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Our Vision
                </button>
                <button
                  onClick={() => setActiveTab('values')}
                  className={`flex-1 py-4 text-center font-semibold transition-all duration-200 ${
                    activeTab === 'values'
                      ? 'text-orange-500 border-b-2 border-orange-500 bg-orange-50/30'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Core Values
                </button>
              </div>
              
              <div className="p-6">
                {activeTab === 'mission' && (
                  <div className="space-y-3">
                    <p className="text-gray-700 leading-relaxed">
                      To empower individuals with the wisdom of the stars, helping them make informed decisions 
                      and live in harmony with cosmic rhythms.
                    </p>
                    <div className="flex items-start gap-3 mt-4 pt-3 border-t border-gray-100">
                      <Heart className="w-5 h-5 text-orange-400 mt-0.5" />
                      <p className="text-gray-600 text-sm">
                        We believe everyone deserves access to authentic astrological guidance that respects 
                        both ancient wisdom and modern needs.
                      </p>
                    </div>
                  </div>
                )}
                {activeTab === 'vision' && (
                  <div className="space-y-3">
                    <p className="text-gray-700 leading-relaxed">
                      To be a trusted bridge between ancient Vedic wisdom and modern seekers, offering clarity 
                      and direction in all aspects of life.
                    </p>
                    <div className="flex items-start gap-3 mt-4 pt-3 border-t border-gray-100">
                      <Compass className="w-5 h-5 text-orange-400 mt-0.5" />
                      <p className="text-gray-600 text-sm">
                        Creating a global community where astrological knowledge is accessible, accurate, 
                        and applied for positive transformation.
                      </p>
                    </div>
                  </div>
                )}
                {activeTab === 'values' && (
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                        <span className="text-green-500 text-xs">✓</span>
                      </div>
                      <p className="text-gray-700">Authenticity in Vedic traditions</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                        <span className="text-green-500 text-xs">✓</span>
                      </div>
                      <p className="text-gray-700">Compassion and confidentiality</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                        <span className="text-green-500 text-xs">✓</span>
                      </div>
                      <p className="text-gray-700">Continuous learning and accuracy</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                        <span className="text-green-500 text-xs">✓</span>
                      </div>
                      <p className="text-gray-700">Empowerment through knowledge</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Team & Expertise */}
          <div className="space-y-6">
            {/* Meet Our Experts */}
            <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center">
                  <Users className="w-4 h-4 text-orange-500" />
                </div>
                <h2 className="text-xl font-bold text-gray-800">Meet Our Experts</h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                <TeamMember name="Dr. Suresh Rao" role="Chief Astrologer" expertise="Vedic & KP" avatar="SR" color="bg-gradient-to-br from-orange-500 to-amber-500" />
                <TeamMember name="Pt. Rajesh Sharma" role="Senior Astrologer" expertise="Marriage & Career" avatar="RS" color="bg-gradient-to-br from-purple-500 to-pink-500" />
                <TeamMember name="Ms. Geeta M" role="Vedic Counselor" expertise="Remedies & Mantras" avatar="GM" color="bg-gradient-to-br from-blue-500 to-cyan-500" />
              </div>
            </div>

            {/* Why Choose Us */}
            <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-6 border border-orange-100">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-orange-500" />
                Why Choose Kaal-Chakra?
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <ChevronRight className="w-4 h-4 text-orange-500" />
                  <span>Authentic Vedic traditions & calculations</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <ChevronRight className="w-4 h-4 text-orange-500" />
                  <span>Experienced & certified astrologers</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <ChevronRight className="w-4 h-4 text-orange-500" />
                  <span>Personalized guidance & remedies</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <ChevronRight className="w-4 h-4 text-orange-500" />
                  <span>Confidential & compassionate service</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <ChevronRight className="w-4 h-4 text-orange-500" />
                  <span>Follow-up support & detailed reports</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="mt-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
              What Our Clients Say
            </h2>
            <div className="flex items-center justify-center gap-2">
              <div className="w-12 h-px bg-gradient-to-r from-transparent to-orange-300"></div>
              <Star className="w-4 h-4 text-orange-400 fill-orange-400" />
              <div className="w-12 h-px bg-gradient-to-l from-transparent to-orange-300"></div>
            </div>
            <p className="text-gray-500 mt-3">Trusted by thousands for authentic astrological guidance</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} index={index} />
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl p-8 shadow-lg">
            <h3 className="text-2xl font-bold text-white mb-2">Ready to Begin Your Journey?</h3>
            <p className="text-orange-100 mb-6">Let the stars guide you toward clarity and purpose</p>
            <button className="bg-white text-orange-500 font-semibold px-8 py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105">
              Consult an Astrologer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;