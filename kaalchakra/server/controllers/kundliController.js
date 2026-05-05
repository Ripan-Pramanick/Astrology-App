// server/controllers/kundliController.js
import { supabase } from '../utils/supabase.js';

export const generateKundli = async (req, res) => {
  try {
    const { name, phone, gender, birthDate, birthTime, birthPlace } = req.body;

    if (!name || !birthDate || !birthTime || !birthPlace) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    // Save to Supabase
    const { data: savedReport, error: insertError } = await supabase
      .from('saved_reports')
      .insert([{ 
        name, 
        user_phone: phone || null,
        dob: birthDate,
        basic_info: { gender, birthTime, birthPlace },
        planets_data: null,
        ai_insights: null,
        created_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (insertError) {
      console.warn('Supabase insert error (continuing):', insertError.message);
    }

    return res.status(200).json({
      success: true,
      id: savedReport?.id || null,
      data: { name, gender, birthDate, birthTime, birthPlace }
    });

  } catch (error) {
    console.error('Kundli Generation Error:', error);
    return res.status(500).json({ success: false, message: 'Server Error' });
  }
};

export const getKundliResult = async (req, res) => {
  try {
    const { id } = req.params;
    
    const { data, error } = await supabase
      .from('saved_reports')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Get Kundli Result Error:', error);
    return res.status(500).json({ success: false, message: 'Report not found' });
  }
};
