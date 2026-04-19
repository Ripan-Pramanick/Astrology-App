// server/routes/contact.js
import express from 'express';
import { supabase } from '../utils/supabase.js';

const router = express.Router();

// GET contact page information
router.get('/info', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('contact_info')
      .select('*')
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    
    const defaultData = {
      address: ["No: 58 A, East Madison Street", "Baltimore, MD, USA 4508"],
      emails: ["contact@ruhuastro.com", "support@ruhuastro.com"],
      phones: ["+1 (555) 123-4567", "+1 (555) 987-6543"],
      businessHours: [
        { day: "Monday - Friday", hours: "9:00 AM - 8:00 PM" },
        { day: "Saturday", hours: "10:00 AM - 6:00 PM" },
        { day: "Sunday", hours: "Closed (Emergency only)" }
      ],
      socialLinks: [
        { platform: "Facebook", url: "https://facebook.com/kaalchakra", color: "bg-blue-600 text-white hover:bg-blue-700" },
        { platform: "Instagram", url: "https://instagram.com/kaalchakra", color: "bg-pink-600 text-white hover:bg-pink-700" },
        { platform: "Twitter", url: "https://twitter.com/kaalchakra", color: "bg-sky-500 text-white hover:bg-sky-600" }
      ],
      mapLocation: {
        address: "No: 58 A, East Madison Street, Baltimore, MD",
        lat: 39.2904,
        lng: -76.6122,
        googleMapsUrl: "https://maps.google.com/?q=58+East+Madison+Street+Baltimore+MD"
      },
      responseTime: "We typically respond within 24 hours during business days. For urgent consultations, please call us directly."
    };
    
    res.json({ success: true, data: data || defaultData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST contact message
router.post('/message', async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    
    if (!name || !email || !phone || !message) {
      return res.status(400).json({ success: false, message: 'All required fields must be filled' });
    }
    
    const { data, error } = await supabase
      .from('contact_messages')
      .insert([{
        name,
        email,
        phone,
        subject: subject || 'General Inquiry',
        message,
        status: 'unread',
        created_at: new Date().toISOString()
      }])
      .select();
    
    if (error) throw error;
    
    // Optional: Send email notification
    // await sendEmailNotification({ name, email, subject, message });
    
    res.json({ success: true, message: 'Message sent successfully' });
  } catch (error) {
    console.error('Error saving contact message:', error);
    res.status(500).json({ success: false, message: 'Failed to send message' });
  }
});

// GET all contact messages (Admin only)
router.get('/messages', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    res.json({ success: true, messages: data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// UPDATE message status (Admin only)
router.put('/messages/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const { data, error } = await supabase
      .from('contact_messages')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select();
    
    if (error) throw error;
    
    res.json({ success: true, message: data[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;