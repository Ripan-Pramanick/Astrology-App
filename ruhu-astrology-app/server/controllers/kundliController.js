// server/controllers/kundliController.js
import { supabase } from '../utils/supabase.js'; // Supabase client instance
import { generateKundaliPDF } from '../services/pdfService.js'; // PDF generation service
import { fetchAstroData } from '../services/astrologyService.js'; // External astrology API service

/**
 * Submit Kundali Request
 * POST /api/kundli
 * Expects body: { name, gender, birthDate, birthTime, place, useCoordinates, longitude, latitude, comment, userId }
 */
export const submitKundaliRequest = async (req, res) => {
  try {
    const {
      name,
      gender,
      birthDate,
      birthTime,
      place,
      useCoordinates,
      longitude,
      latitude,
      comment,
      userId,
    } = req.body;

    // Basic validation
    if (!name || !birthDate || !birthTime) {
      return res.status(400).json({ success: false, message: 'Missing required fields.' });
    }

    // Convert birth date/time to a proper timestamp (for calculations)
    // Note: This is a simplified example. You'd parse according to your date/time format.
    const birthDateTime = new Date(`${birthDate} ${birthTime}`);

    // 🚀 TODO: [SUPABASE DB] Insert into 'kundali_requests' table
    const { data, error } = await supabase
      .from('kundali_requests')
      .insert([
        {
          user_id: userId,
          name,
          gender,
          birth_date: birthDate,
          birth_time: birthTime,
          birth_place: place,
          use_coordinates: useCoordinates,
          longitude: longitude ? `${longitude.degrees}°${longitude.minutes}'${longitude.seconds}"` : null,
          latitude: latitude ? `${latitude.degrees}°${latitude.minutes}'${latitude.seconds}"` : null,
          comment,
          status: 'pending', // or 'processing'
          created_at: new Date(),
        },
      ])
      .select();

    if (error) {
      console.error('Supabase insert error:', error);
      return res.status(500).json({ success: false, message: 'Database error.' });
    }

    const requestId = data[0].id;

    // 🌐 TODO: [EXTERNAL ASTRO API] Fetch real-time planetary positions & generate kundali
    // const astroData = await fetchAstroData(birthDateTime, place, longitude, latitude);

    // 🚀 TODO: [PDF SERVICE] Generate PDF report (if needed)
    // const pdfBuffer = await generateKundaliPDF({ ...requestData, astroData });
    // Then store PDF URL in Supabase

    // Example: update the request with generated data (placeholder)
    // await supabase.from('kundali_requests').update({ status: 'completed', pdf_url: pdfUrl }).eq('id', requestId);

    return res.status(200).json({
      success: true,
      message: 'Kundali request submitted successfully.',
      requestId,
      // pdfUrl, // optional
    });
  } catch (error) {
    console.error('Kundali submission error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};