// client/src/pages/Contact.jsx
import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Send, Clock, CheckCircle, AlertCircle, MessageCircle, Globe, Instagram, Facebook, Twitter, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import api from '../services/api'; // Ensure you import api properly if not using mock

const gradientStyles = `

  .grad-main-bg { background: linear-gradient(to bottom right, #f9fafb, #f3f4f6); }

  .grad-icon-primary { background: linear-gradient(to bottom right, #f97316, #f59e0b); }

  .grad-icon-secondary { background: linear-gradient(to bottom right, #fb923c, #ea580c); }

  .grad-line-right { background: linear-gradient(to right, transparent, #fdba74); }

  .grad-line-left { background: linear-gradient(to left, transparent, #fdba74); }

  .grad-box-light { background: linear-gradient(to right, #fff7ed, #fffbeb); }

  .grad-card-orange { background: linear-gradient(to bottom right, #f97316, #f59e0b); }

  .grad-card-blue { background: linear-gradient(to bottom right, #3b82f6, #06b6d4); }

  .grad-card-green { background: linear-gradient(to bottom right, #10b981, #22c55e); }

  .grad-btn { background: linear-gradient(to right, #f97316, #f59e0b); }

  .grad-btn:hover:not(:disabled) { background: linear-gradient(to right, #ea580c, #d97706); }

  .grad-map-header { background: linear-gradient(to right, #f9fafb, #f3f4f6); }

  .grad-map-overlay { background: linear-gradient(to bottom right, #e5e7eb, #d1d5db); }

`;

const ContactInfoCard = ({ icon: Icon, title, details, color }) => (
  <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl hover:bg-white transition-all duration-300 hover:shadow-md border border-transparent hover:border-gray-100">
    <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center flex-shrink-0`}>
      <Icon className="w-5 h-5 text-white" />
    </div>
    <div>
      <h4 className="font-semibold text-gray-800 mb-1">{title}</h4>
      {details && details.map ? (
        details.map((detail, idx) => (
          <p key={idx} className="text-gray-600 text-sm">{detail}</p>
        ))
      ) : (
        <p className="text-gray-600 text-sm">{details}</p>
      )}
    </div>
  </div>
);

const SocialLink = ({ icon: Icon, href, label, color }) => (
  <a href={href} className={`flex items-center gap-2 px-4 py-2 rounded-lg ${color} transition-all duration-300 hover:scale-105`} target="_blank" rel="noopener noreferrer">
    <Icon className="w-4 h-4" />
    <span className="text-sm font-medium">{label}</span>
  </a>
);

const Contact = () => {
  const { t } = useTranslation('pages');
  
  const defaultContactInfo = {
    address: ["Sonarpur Station Road", "Kolkata, West Bengal, India"],
    emails: ["[EMAIL_ADDRESS]"],
    phones: ["+91 - 9123858544"],
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
      address: "Sonarpur Station Road, Kolkata, West Bengal, India",
      lat: 22.4891,
      lng: 88.3858,
      googleMapsUrl: "https://maps.app.goo.gl/tB7uR4U8t8t8t8t8t"
    },
    responseTime: "We typically respond within 24 hours during business days. For urgent consultations, please call us directly."
  };

  const [contactInfo, setContactInfo] = useState(defaultContactInfo);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
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
      if (response.data && response.data.success && response.data.data) {
        const apiData = response.data.data;
        setContactInfo({
          address: apiData.address || defaultContactInfo.address,
          emails: apiData.emails || defaultContactInfo.emails,
          phones: apiData.phones || defaultContactInfo.phones,
          businessHours: apiData.businessHours || defaultContactInfo.businessHours,
          socialLinks: Array.isArray(apiData.socialLinks) ? apiData.socialLinks : defaultContactInfo.socialLinks,
          mapLocation: apiData.mapLocation || defaultContactInfo.mapLocation,
          responseTime: apiData.responseTime || defaultContactInfo.responseTime
        });
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
    if (errors[name]) setErrors({ ...errors, [name]: '' });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = t('contact.errors.nameReq', 'Name is required');
    if (!formData.email.trim()) newErrors.email = t('contact.errors.emailReq', 'Email is required');
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = t('contact.errors.emailInv', 'Email is invalid');
    if (!formData.phone.trim()) newErrors.phone = t('contact.errors.phoneReq', 'Phone number is required');
    else if (!/^[\d\s+\-()]{10,15}$/.test(formData.phone)) newErrors.phone = t('contact.errors.phoneInv', 'Phone number is invalid');
    if (!formData.message.trim()) newErrors.message = t('contact.errors.msgReq', 'Message is required');
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
        setError(response.data.message || t('contact.errors.sendFail', 'Failed to send message'));
      }
    } catch (err) {
      setError(err.response?.data?.message || t('contact.errors.sendFailTry', 'Failed to send message. Please try again.'));
    } finally {
      setSubmitting(false); 
    }
  };

  if (loading) {
    return (
      <>
        <style>{gradientStyles}</style>
        <div className="min-h-screen grad-main-bg py-12 px-4 sm:px-6 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-orange-500 animate-spin mx-auto mb-4" />
            <p className="text-gray-500">{t('contact.loading')}</p>
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
          
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center gap-2 mb-6">
              <div className="w-12 h-12 rounded-full grad-icon-primary flex items-center justify-center shadow-md">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <div className="w-12 h-12 rounded-full grad-icon-secondary flex items-center justify-center shadow-md">
                <Mail className="w-6 h-6 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-4 tracking-tight">
              {t('contact.title')}
            </h1>
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-16 h-px grad-line-right"></div>
              <span className="text-orange-400 text-xl">✨</span>
              <div className="w-16 h-px grad-line-left"></div>
            </div>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              {t('contact.subtitle')}
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 md:p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <span className="text-orange-500">✨</span> {t('contact.getInTouch')} <span className="text-orange-500">✨</span>
                </h2>
                <p className="text-gray-600 leading-relaxed mb-4">{t('contact.desc1')}</p>
                <p className="text-gray-600 leading-relaxed mb-4">{t('contact.desc2')}</p>
                <div className="grad-box-light rounded-xl p-4 mt-4">
                  <div className="flex items-center gap-2 text-orange-600 mb-2">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm font-semibold">{t('contact.responseTime')}</span>
                  </div>
                  <p className="text-gray-600 text-sm">{contactInfo.responseTime}</p>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-5 flex items-center gap-2">
                  <div className="w-1 h-6 bg-orange-500 rounded-full"></div>
                  {t('contact.contactInfo')}
                </h3>
                <div className="space-y-3">
                  <ContactInfoCard icon={MapPin} title={t('contact.address')} details={contactInfo.address} color="grad-card-orange" />
                  <ContactInfoCard icon={Mail} title={t('contact.email')} details={contactInfo.emails} color="grad-card-blue" />
                  <ContactInfoCard icon={Phone} title={t('contact.phone')} details={contactInfo.phones} color="grad-card-green" />
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-orange-500" />
                  {t('contact.businessHours')}
                </h3>
                <div className="space-y-2">
                  {contactInfo.businessHours && contactInfo.businessHours.map((item, idx) => (
                    <div key={idx} className="flex justify-between py-2 border-b border-gray-100 last:border-0">
                      <span className="text-gray-600">{item.day}</span>
                      <span className="text-gray-800 font-medium">{item.hours}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Globe className="w-5 h-5 text-orange-500" />
                  {t('contact.connectWithUs')}
                </h3>
                <div className="flex flex-wrap gap-3">
                  {contactInfo.socialLinks && contactInfo.socialLinks.length > 0 ? (
                    contactInfo.socialLinks.map((social, idx) => (
                      <SocialLink key={idx} icon={social.icon} href={social.url} label={social.platform} color={social.color} />
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">{t('contact.noSocialLinks')}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 md:p-8">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">{t('contact.sendMessageTitle')}</h2>
                  <p className="text-gray-500 text-sm">{t('contact.sendMessageSub')}</p>
                </div>
                
                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">{t('contact.formFullName')} <span className="text-red-500">*</span></label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} className={`w-full px-4 py-3 rounded-xl border ${errors.name ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-gray-50'} focus:bg-white focus:border-orange-400 focus:ring-2 focus:ring-orange-200 transition-all outline-none`} placeholder="John Doe" />
                    {errors.name && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">{t('contact.formEmail')} <span className="text-red-500">*</span></label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} className={`w-full px-4 py-3 rounded-xl border ${errors.email ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-gray-50'} focus:bg-white focus:border-orange-400 focus:ring-2 focus:ring-orange-200 transition-all outline-none`} placeholder="john@example.com" />
                    {errors.email && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.email}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">{t('contact.formPhone')} <span className="text-red-500">*</span></label>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className={`w-full px-4 py-3 rounded-xl border ${errors.phone ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-gray-50'} focus:bg-white focus:border-orange-400 focus:ring-2 focus:ring-orange-200 transition-all outline-none`} placeholder="+1 (555) 000-0000" />
                    {errors.phone && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.phone}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">{t('contact.formSubject')}</label>
                    <select name="subject" value={formData.subject} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-orange-400 focus:ring-2 focus:ring-orange-200 transition-all outline-none">
                      <option value="">{t('contact.selectSubject')}</option>
                      <option value="general">{t('contact.subjGeneral')}</option>
                      <option value="consultation">{t('contact.subjConsultation')}</option>
                      <option value="support">{t('contact.subjSupport')}</option>
                      <option value="feedback">{t('contact.subjFeedback')}</option>
                      <option value="partnership">{t('contact.subjPartnership')}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">{t('contact.formMessage')} <span className="text-red-500">*</span></label>
                    <textarea name="message" rows="5" value={formData.message} onChange={handleChange} className={`w-full px-4 py-3 rounded-xl border ${errors.message ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-gray-50'} focus:bg-white focus:border-orange-400 focus:ring-2 focus:ring-orange-200 transition-all outline-none resize-none`} placeholder={t('contact.formMessagePlace')} />
                    {errors.message && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.message}</p>}
                  </div>

                  <button type="submit" disabled={submitting} className="w-full grad-btn text-white font-semibold py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-70 flex items-center justify-center gap-2">
                    {submitting ? (
                      <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> {t('contact.sending')}</>
                    ) : (
                      <><Send className="w-5 h-5" /> {t('contact.sendMessageBtn')}</>
                    )}
                  </button>

                  {success && (
                    <div className="mt-4 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                      <CheckCircle className="w-5 h-5 text-emerald-500" />
                      <div>
                        <p className="text-emerald-800 font-medium">{t('contact.successTitle')}</p>
                        <p className="text-emerald-600 text-sm">{t('contact.successSub')}</p>
                      </div>
                    </div>
                  )}
                </form>
              </div>

              <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
                <div className="grad-map-header px-6 py-4 border-b border-gray-200">
                  <h3 className="font-bold text-gray-800 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-orange-500" />
                    {t('contact.mapTitle')}
                  </h3>
                </div>
                <div className="relative h-64 bg-gray-200">
                  <div className="absolute inset-0 grad-map-overlay flex items-center justify-center">
                    <div className="text-center">
                      <MapPin className="w-12 h-12 text-orange-500 mx-auto mb-2" />
                      <p className="text-gray-500 text-sm">{t('contact.interactiveMap')}</p>
                      <p className="text-gray-400 text-xs mt-1">{contactInfo.mapLocation?.address || t('contact.addressNotAvail')}</p>
                    </div>
                  </div>
                  <div className="absolute bottom-2 right-2 bg-white/80 text-gray-500 text-[10px] px-2 py-0.5 rounded">
                    {t('contact.mapData')}
                  </div>
                </div>
                <div className="p-4 border-t border-gray-100">
                  <a href={contactInfo.mapLocation?.googleMapsUrl || '#'} target="_blank" rel="noopener noreferrer" className="text-orange-500 text-sm font-medium flex items-center justify-center gap-1 hover:gap-2 transition-all">
                    {t('contact.getDirections')}
                    <span>→</span>
                  </a>
                </div>
              </div>

              <div className="grad-box-light rounded-xl p-5 text-center border border-orange-100">
                <p className="text-gray-700 text-sm">
                  <span className="font-semibold text-orange-600">{t('contact.faqTitle')}</span><br />
                  {t('contact.faqDesc1')}<a href="/faq" className="text-orange-500 font-medium underline">{t('contact.faqLink')}</a>{t('contact.faqDesc2')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Contact;