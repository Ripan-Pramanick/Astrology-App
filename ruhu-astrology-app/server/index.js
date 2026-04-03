// server/index.js
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import axios from 'axios'; // Axios Import করা হলো
import Razorpay from 'razorpay'; // Razorpay Import করা হলো
import admin from 'firebase-admin';

// Local Imports
import { config as appConfig, config as firebaseConfig } from './config/env.js';
import { supabase } from './utils/supabase.js';
import logger from './utils/logger.js';
import { errorHandler } from './middleware/errorHandler.js';
import { GoogleGenerativeAI } from "@google/generative-ai";

// Route Imports
import authRoutes from './routes/auth.js';
import kundliRoutes from './routes/kundli.js';
import paymentRoutes from './routes/payment.js';
import aiRoutes from './routes/ai.js';
import adminRoutes from './routes/admin.js';
import matchmakingRoutes from './routes/matchmaking.js';
// import astrologyRoutes from './routes/astrology.routes.js'; 

// Firebase Admin initialization
admin.initializeApp({
    projectId: firebaseConfig.firebase.projectId,
    credential: admin.credential.cert({
        projectId: firebaseConfig.firebase.projectId,
        privateKey: firebaseConfig.firebase.privateKey,
        clientEmail: firebaseConfig.firebase.clientEmail,
    }),
});

const app = express();

// --- Middlewares (সবচেয়ে আগে বসবে) ---
app.use(helmet());
app.use(compression());
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json({ limit: '10mb' })); 
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined', { stream: { write: (msg) => logger.info(msg.trim()) } }));


// --- 1. Custom Routes (যেগুলো আপনি index.js-এ রাখতে চেয়েছেন) ---

// Astrology Geo Details API (Base64 Auth Fix)
// app.post('/api/astrology/geo_details', async (req, res) => {
//   try {
//     // 🌟 .trim() যোগ করা হয়েছে যাতে কোনো স্পেস থাকলে মুছে যায়
//     const userId = process.env.ASTROLOGY_USER_ID?.trim(); 
//     const apiKey = process.env.ASTROLOGY_API_KEY?.trim(); 

//     // ডিবাগিংয়ের জন্য (লগে চেক করার জন্য যে ঠিকমতো ডেটা পাচ্ছে কি না)
//     console.log(`📡 Checking Credentials -> UserID: '${userId}', API Key starts with: '${apiKey?.substring(0, 5)}...'`);

//     // Base64 Encoding
//     const auth = Buffer.from(`${userId}:${apiKey}`).toString('base64');

//     const response = await axios.post(
//       'https://json.astrologyapi.com/v1/geo_details', 
//       req.body, 
//       {
//         headers: {
//           'Authorization': `Basic ${auth}`,
//           'Content-Type': 'application/json'
//         },
//         timeout: 15000 
//       }
//     );

//     res.json({ success: true, data: response.data });
//   } catch (error) {
//     console.error("❌ Astrology API Error:", error.response ? error.response.data : error.message);
//     res.status(error.response?.status || 500).json({
//       success: false,
//       message: error.response?.data?.msg || "API Error",
//       error: error.message
//     });
//   }
// });

// Astrology Geo Details API (Temporary Bypass for UI Testing)
app.post('/api/astrology/geo_details', async (req, res) => {
  console.log("🛠️ Using Mock Data for Geo Details to bypass API issue.");
  
  // ফেক/মক ডেটা দিয়ে রেসপন্স পাঠানো হচ্ছে
  res.json({
    success: true,
    data: {
      geonames: [
        {
          place_name: "Santipur, West Bengal, India",
          latitude: "23.2500",
          longitude: "88.4333",
          timezone: "5.5"
        },
        {
          place_name: "Kolkata, West Bengal, India",
          latitude: "22.5726",
          longitude: "88.3639",
          timezone: "5.5"
        }
      ]
    }
  });
});


// --- Astrology Mock APIs for UI Testing ---

// ১. Birth Details API (Temporary Bypass)
app.post('/api/astrology/birth_details', async (req, res) => {
  res.json({
    success: true,
    data: {
      ascendant: "Aries", sign: "Taurus", Naksahtra: "Rohini",
      Varna: "Kshatriya", Gana: "Manushya", Nadi: "Antya"
    }
  });
});

// ২. Planets API (Temporary Bypass)
app.post('/api/astrology/planets', async (req, res) => {
  res.json({
    success: true,
    data: [
      { name: "Sun", sign: "Aries", normDegree: 12.45, house: "1st" },
      { name: "Moon", sign: "Taurus", normDegree: 5.20, house: "2nd" },
      { name: "Mars", sign: "Gemini", normDegree: 28.10, house: "3rd" },
      { name: "Mercury", sign: "Pisces", normDegree: 14.60, house: "12th" }
    ]
  });
});

// Razorpay Setup & Payment Order API
const razorpay = new Razorpay({
  key_id: 'rzp_test_SZ58CuarkpUXG2', 
  key_secret: 'de1IoNYBc08sy2x9bgQhWSc1',
});

app.post('/api/payment/create-order', async (req, res) => {
  try {
    const options = {
      amount: 1100 * 100, 
      currency: "INR",
      receipt: "receipt_ruhu_" + Math.random().toString(36).substring(7),
    };
    
    const order = await razorpay.orders.create(options);
    res.json({ success: true, order });
  } catch (error) {
    console.error("Razorpay Error:", error);
    res.status(500).json({ success: false, message: "Payment failed to initiate" });
  }
});

// Dashboard Mock API
app.get('/api/dashboard', (req, res) => {
  res.status(200).json({
    success: true,
    requests: [
      { id: 'req_001', created_at: '2026-03-25T10:30:00Z', status: 'completed' },
      { id: 'req_002', created_at: '2026-03-28T14:15:00Z', status: 'processing' },
      { id: 'req_003', created_at: '2026-03-30T09:00:00Z', status: 'pending' }
    ]
  });
});

// Profile Update API
app.put('/api/user/profile', async (req, res) => {
  const { name, email, phone } = req.body;
  try {
    const { data, error } = await supabase
      .from('users')
      .update({ name, email })
      .eq('phone', phone)
      .select();

    if (error) throw error;
    res.status(200).json({ success: true, message: "Profile updated!", user: data[0] });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ success: false, message: "Error updating profile" });
  }
});


// --- 2. Imported Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/kundli', kundliRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/matchmaking', matchmakingRoutes);

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

// Global error handler
app.use(errorHandler);


// --- 3. Start Server (এটি সবসময় ফাইলের একদম শেষে থাকবে) ---
const PORT = appConfig.port || 5000;
app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT} in ${appConfig.nodeEnv || 'development'} mode`);
});


// ai add
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Gemini কনফিগারেশন
// Gemini কনফিগারেশন
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/api/ai/interpret', async (req, res) => {
  try {
    const { planets, basic } = req.body;
    
    // Gemini 1.5 Flash মডেল ব্যবহার করছি যা অনেক দ্রুত
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      You are an expert Vedic Astrologer. Based on these birth details:
      Lagna: ${basic.ascendant}, Moon Sign: ${basic.sign}, Nakshatra: ${basic.Naksahtra}.
      Planetary Positions: ${JSON.stringify(planets)}

      Provide a professional and encouraging Vedic astrology reading in exactly 4 paragraphs:
      1. Personality Traits: Based on Lagna and Moon sign.
      2. Career & Wealth: Based on planetary strengths.
      3. Relationship & Health: General outlook.
      4. A Simple Vedic Remedy: A practical suggestion.

      Keep the language spiritual yet modern. Focus on strengths.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({ success: true, interpretation: text });
  } catch (error) {
    console.error("AI Interpretation Error:", error);
    res.status(500).json({ success: false, message: "AI process failed" });
  }
});