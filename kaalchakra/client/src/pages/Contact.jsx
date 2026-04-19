// client/src/pages/Contact.jsx
import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Send, Clock, CheckCircle, AlertCircle, MessageCircle, Globe, Instagram, Facebook, Twitter, Loader2 } from 'lucide-react';
import api from '../services/api.js';

// Contact Info Card Component
const ContactInfoCard = ({ icon: Icon, title, details, color }) => (
  <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl hover:bg-white transition-all duration-300 hover:shadow-md border border-transparent hover:border-gray-100">
    <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center flex-shrink-0`}>
      <Icon className="w-5 h-5 text-white" />
    </div>
    <div>
      <h4 className="font-semibold text-gray-800 mb-1">{title}</h4>
      {details.map((detail, idx) => (
        <p key={idx} className="text-gray-600 text-sm">{detail}</p>
      ))}
    </div>
  </div>
);

// Social Link Component
const SocialLink = ({ icon: Icon, href, label, color }) => (
  <a 
    href={href} 
    className={`flex items-center gap-2 px-4 py-2 rounded-lg ${color} transition-all duration-300 hover:scale-105`}
    target="_blank"
    rel="noopener noreferrer"
  >
    <Icon className="w-4 h-4" />
    <span className="text-sm font-medium">{label}</span>
  </a>
);

const Contact = () => {
  const [contactInfo, setContactInfo] = useState({
    address: ["No: 58 A, East Madison Street", "Baltimore, MD, USA 4508"],
    emails: ["contact@kaalchakra.com", "support@kaalchakra.com"],
    phones: ["+1 (555) 123-4567", "+1 (555) 987-6543"],
    businessHours: [
      { day: "Monday - Friday", hours: "9:00 AM - 8:00 PM" },
      { day: "Saturday", hours: "10:00 AM - 6:00 PM" },
      { day: "Sunday", hours: "Closed (Emergency only)" }
    ],
    socialLinks: [
      { platform: "Facebook", url: "https://facebook.com/kaalchakra", icon: Facebook, color: "bg-blue-600 text-white hover:bg-blue-700" },
      { platform: "Instagram", url: "https://instagram.com/kaalchakra", icon: Instagram, color: "bg-pink-600 text-white hover:bg-pink-700" },
      { platform: "Twitter", url: "https://twitter.com/kaalchakra", icon: Twitter, color: "bg-sky-500 text-white hover:bg-sky-600" }
    ],
    mapLocation: {
      address: "No: 58 A, East Madison Street, Baltimore, MD",
      lat: 39.2904,
      lng: -76.6122,
      googleMapsUrl: "https://maps.google.com/?q=58+East+Madison+Street+Baltimore+MD"
    },
    responseTime: "We typically respond within 24 hours during business days. For urgent consultations, please call us directly."
  });

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContactInfo();
  }, []);

  const fetchContactInfo = async () => {
    try {
      const response = await api.get('/contact/info');
      if (response.data.success) {
        setContactInfo(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching contact info:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    else if (!/^[\d\s+\-()]{10,15}$/.test(formData.phone)) newErrors.phone = 'Phone number is invalid';
    if (!formData.message.trim()) newErrors.message = 'Message is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setSubmitting(true);
    setError('');
    
    try {
      const response = await api.post('/contact/message', formData);
      
      if (response.data.success) {
        setSuccess(true);
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
        setTimeout(() => setSuccess(false), 5000);
      } else {
        setError(response.data.message || 'Failed to send message');
      }
    } catch (err) {
      console.error('Error sending message:', err);
      setError(err.response?.data?.message || 'Failed to send message. Please try again.');
    } finally {
      setSubmitting(false); 
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-orange-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Loading contact information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center gap-2 mb-6">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-md">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-md">
              <Mail className="w-6 h-6 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-4 tracking-tight">
            Contact Us
          </h1>
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-16 h-px bg-gradient-to-r from-transparent to-orange-300"></div>
            <span className="text-orange-400 text-xl">✨</span>
            <div className="w-16 h-px bg-gradient-to-l from-transparent to-orange-300"></div>
          </div>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            We're here to help and answer any questions you might have
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          
          {/* Left Column - Contact Info */}
          <div className="space-y-6">
            {/* Welcome Card */}
            <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 md:p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="text-orange-500">✨</span> Get In Touch
                <span className="text-orange-500">✨</span>
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Get a comprehensive analysis of your characteristics, personality, temperament, strengths, 
                and weaknesses based on the placement of signs and planets in your birth chart.
              </p>
              <p className="text-gray-600 leading-relaxed mb-4">
                This insight can be invaluable when making important life decisions, whether you're selecting 
                the right educational field, choosing a career path, or finding a compatible life partner. 
                It also helps you prepare for challenging periods and make the most of favorable times.
              </p>
              <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-4 mt-4">
                <div className="flex items-center gap-2 text-orange-600 mb-2">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm font-semibold">Response Time</span>
                </div>
                <p className="text-gray-600 text-sm">{contactInfo.responseTime}</p>
              </div>
            </div>

            {/* Contact Details */}
            <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-5 flex items-center gap-2">
                <div className="w-1 h-6 bg-orange-500 rounded-full"></div>
                Contact Information
              </h3>
              <div className="space-y-3">
                <ContactInfoCard 
                  icon={MapPin} 
                  title="Address" 
                  details={contactInfo.address}
                  color="bg-gradient-to-br from-orange-500 to-amber-500"
                />
                <ContactInfoCard 
                  icon={Mail} 
                  title="Email" 
                  details={contactInfo.emails}
                  color="bg-gradient-to-br from-blue-500 to-cyan-500"
                />
                <ContactInfoCard 
                  icon={Phone} 
                  title="Phone" 
                  details={contactInfo.phones}
                  color="bg-gradient-to-br from-emerald-500 to-green-500"
                />
              </div>
            </div>

            {/* Business Hours */}
            <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-orange-500" />
                Business Hours
              </h3>
              <div className="space-y-2">
                {contactInfo.businessHours.map((item, idx) => (
                  <div key={idx} className="flex justify-between py-2 border-b border-gray-100 last:border-0">
                    <span className="text-gray-600">{item.day}</span>
                    <span className="text-gray-800 font-medium">{item.hours}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Social Links */}
            <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Globe className="w-5 h-5 text-orange-500" />
                Connect With Us
              </h3>
              <div className="flex flex-wrap gap-3">
                {contactInfo.socialLinks.map((social, idx) => (
                  <SocialLink 
                    key={idx}
                    icon={social.icon} 
                    href={social.url} 
                    label={social.platform} 
                    color={social.color} 
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Contact Form */}
          <div className="space-y-6">
            {/* Form Card */}
            <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 md:p-8">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Send us a message</h2>
                <p className="text-gray-500 text-sm">We'll get back to you as soon as possible</p>
              </div>
              
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name Field */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-xl border ${errors.name ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-gray-50'} focus:bg-white focus:border-orange-400 focus:ring-2 focus:ring-orange-200 transition-all outline-none`}
                    placeholder="John Doe"
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.name}</p>}
                </div>

                {/* Email Field */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-xl border ${errors.email ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-gray-50'} focus:bg-white focus:border-orange-400 focus:ring-2 focus:ring-orange-200 transition-all outline-none`}
                    placeholder="john@example.com"
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.email}</p>}
                </div>

                {/* Phone Field */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-xl border ${errors.phone ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-gray-50'} focus:bg-white focus:border-orange-400 focus:ring-2 focus:ring-orange-200 transition-all outline-none`}
                    placeholder="+1 (555) 000-0000"
                  />
                  {errors.phone && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.phone}</p>}
                </div>

                {/* Subject Field */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Subject
                  </label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-orange-400 focus:ring-2 focus:ring-orange-200 transition-all outline-none"
                  >
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="consultation">Consultation Booking</option>
                    <option value="support">Technical Support</option>
                    <option value="feedback">Feedback</option>
                    <option value="partnership">Partnership Opportunity</option>
                  </select>
                </div>

                {/* Message Field */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="message"
                    rows="5"
                    value={formData.message}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-xl border ${errors.message ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-gray-50'} focus:bg-white focus:border-orange-400 focus:ring-2 focus:ring-orange-200 transition-all outline-none resize-none`}
                    placeholder="Tell us how we can help you..."
                  />
                  {errors.message && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.message}</p>}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Send Message
                    </>
                  )}
                </button>

                {/* Success Message */}
                {success && (
                  <div className="mt-4 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                    <CheckCircle className="w-5 h-5 text-emerald-500" />
                    <div>
                      <p className="text-emerald-800 font-medium">Message Sent Successfully!</p>
                      <p className="text-emerald-600 text-sm">We'll get back to you within 24 hours.</p>
                    </div>
                  </div>
                )}
              </form>
            </div>

            {/* Map Card */}
            <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-orange-500" />
                  Our Location
                </h3>
              </div>
              <div className="relative h-64 bg-gray-200">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="w-12 h-12 text-orange-500 mx-auto mb-2" />
                    <p className="text-gray-500 text-sm">Interactive Map</p>
                    <p className="text-gray-400 text-xs mt-1">{contactInfo.mapLocation.address}</p>
                  </div>
                </div>
                <div className="absolute bottom-2 right-2 bg-white/80 text-gray-500 text-[10px] px-2 py-0.5 rounded">
                  Map data © OpenStreetMap
                </div>
              </div>
              <div className="p-4 border-t border-gray-100">
                <a 
                  href={contactInfo.mapLocation.googleMapsUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-orange-500 text-sm font-medium flex items-center justify-center gap-1 hover:gap-2 transition-all"
                >
                  Get Directions
                  <span>→</span>
                </a>
              </div>
            </div>

            {/* FAQ Prompt */}
            <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-5 text-center border border-orange-100">
              <p className="text-gray-700 text-sm">
                <span className="font-semibold text-orange-600">📢 Frequently Asked Questions?</span><br />
                Check out our <a href="/faq" className="text-orange-500 font-medium underline">FAQ page</a> for quick answers to common questions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;