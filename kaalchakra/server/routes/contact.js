// server/routes/contact.js
import express from 'express';
import { supabase } from '../utils/supabase.js';

const router = express.Router();

// GET contact info
router.get('/info', async (req, res) => {
    try {
        const defaultData = {
            address: ["No: 58 A, East Madison Street", "Baltimore, MD, USA 4508"],
            emails: ["contact@kaalchakra.com", "support@kaalchakra.com"],
            phones: ["+1 (555) 123-4567", "+1 (555) 987-6543"],
            businessHours: [
                { day: "Monday - Friday", hours: "9:00 AM - 8:00 PM" },
                { day: "Saturday", hours: "10:00 AM - 6:00 PM" },
                { day: "Sunday", hours: "Closed (Emergency only)" }
            ],
            responseTime: "We typically respond within 24 hours during business days."
        };
        
        res.json({ success: true, data: defaultData });
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
        
        const { error } = await supabase
            .from('contact_messages')
            .insert([{
                name,
                email,
                phone,
                subject: subject || 'General Inquiry',
                message,
                status: 'unread',
                created_at: new Date().toISOString()
            }]);
        
        if (error) throw error;
        
        res.json({ success: true, message: 'Message sent successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

export default router;