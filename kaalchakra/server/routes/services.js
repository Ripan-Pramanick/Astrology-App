// server/routes/services.js
import express from 'express';
import { supabase } from '../utils/supabase.js';

const router = express.Router();

// GET all services
router.get('/', async (req, res) => {
    try {
        const { data: services, error } = await supabase
            .from('services')
            .select('*')
            .eq('is_active', true)
            .order('display_order', { ascending: true });
        
        if (error) throw error;
        
        res.json({ success: true, services });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// POST create order
router.post('/order', async (req, res) => {
    try {
        const { serviceId, userId, userName, userPhone, serviceName, price } = req.body;
        
        const { data, error } = await supabase
            .from('service_orders')
            .insert([{
                service_id: serviceId,
                service_name: serviceName,
                price: price,
                user_id: userId,
                user_name: userName,
                user_phone: userPhone,
                status: 'pending',
                created_at: new Date().toISOString()
            }])
            .select();
        
        if (error) throw error;
        
        res.json({ success: true, message: 'Order placed successfully', order: data[0] });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

export default router;