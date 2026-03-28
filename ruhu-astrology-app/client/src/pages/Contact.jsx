// client/src/pages/Contact.jsx
import React, { useState } from 'react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    comment: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setSuccess(true);
      setSubmitting(false);
      setFormData({ name: '', email: '', phone: '', comment: '' });
    }, 1000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-2">Contact Us</h1>
        <p className="text-gray-600">Home &gt; Contact</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Contact Info */}
        <div>
          <Card className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Get In Touch</h2>
            <p className="text-gray-600 mb-6">
              Get a comprehensive analysis of your characteristics, personality, temperament, strengths, and weaknesses based on the placement of signs and planets in your birth chart.
            </p>
            <p className="text-gray-600 mb-6">
              This insight can be invaluable when making important life decisions, whether you're selecting the right educational field, choosing a career path, or finding a compatible life partner. It also helps you prepare for challenging periods and make the most of favorable times in specific areas of your life.
            </p>
            <p className="text-gray-600 mb-6">So, why wait? Unlock meaningful insights and mould your future!</p>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold mb-3">Address</h3>
            <p className="text-gray-600 mb-4">No: 58 A, East Madison Street, Baltimore, MD, USA 4508</p>
            <h3 className="text-lg font-semibold mb-3">Email</h3>
            <p className="text-gray-600 mb-4">contact@example.com<br />Info@example.com</p>
            <h3 className="text-lg font-semibold mb-3">Phone</h3>
            <p className="text-gray-600">000-123-456789<br />000-123456789</p>
          </Card>
        </div>

        {/* Contact Form */}
        <div>
          <Card>
            <h2 className="text-xl font-semibold mb-4">Send us a message</h2>
            <form onSubmit={handleSubmit}>
              <Input
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <Input
                label="Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <Input
                label="Phone number"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
              <div className="mb-4">
                <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
                  Comment
                </label>
                <textarea
                  id="comment"
                  name="comment"
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  value={formData.comment}
                  onChange={handleChange}
                  required
                />
              </div>
              <Button type="submit" disabled={submitting}>
                {submitting ? 'Sending...' : 'Submit'}
              </Button>
              {success && (
                <p className="mt-4 text-green-600">Thank you! We'll get back to you soon.</p>
              )}
            </form>
          </Card>

          {/* Map placeholder */}
          <Card className="mt-6">
            <h3 className="text-lg font-semibold mb-3">Location</h3>
            <div className="bg-gray-200 h-64 rounded-md flex items-center justify-center text-gray-500">
              [Map Placeholder - Simpson Desert Regional Res...]
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Contact;