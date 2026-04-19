// server/index.js
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import axios from 'axios'; 
import Razorpay from 'razorpay'; 
import admin from 'firebase-admin';
import { GoogleGenerativeAI } from "@google/generative-ai";

// Local Imports
import { config as appConfig, config as firebaseConfig } from './config/env.js';
import { supabase } from './utils/supabase.js';
import logger from './utils/logger.js';
import { errorHandler } from './middleware/errorHandler.js';

// Route Imports
import authRoutes from './routes/auth.js';
import kundliRoutes from './routes/kundli.js';
import paymentRoutes from './routes/payment.js';
import adminRoutes from './routes/admin.js';
import matchmakingRoutes from './routes/matchmaking.js';
import serviceRoutes from './routes/services.js';
import heroRoutes from './routes/hero.js';
import homeRoutes from './routes/home.js';
import articleRoutes from './routes/articles.js';
import testimonialRoutes from './routes/testimonials.js';
import aboutRoutes from './routes/about.js';
import contactRoutes from './routes/contact.js';

// ============================================
// FIREBASE ADMIN INITIALIZATION (FIXED)
// ============================================
if (!admin.apps.length) {
    try {
        // Handle private key properly - replace escaped newlines
        let privateKey = firebaseConfig.firebase?.privateKey;
        
        if (!privateKey) {
            console.error('❌ Firebase private key is missing in environment variables');
            throw new Error('Firebase private key is missing');
        }
        
        // If the key contains literal '\n' strings, replace them with actual newlines
        if (privateKey && privateKey.includes('\\n')) {
            privateKey = privateKey.replace(/\\n/g, '\n');
        }
        
        // Validate private key format
        if (!privateKey.includes('-----BEGIN PRIVATE KEY-----')) {
            console.error('❌ Invalid private key format - missing BEGIN marker');
            throw new Error('Private key format is invalid');
        }
        
        if (!privateKey.includes('-----END PRIVATE KEY-----')) {
            console.error('❌ Invalid private key format - missing END marker');
            throw new Error('Private key format is invalid');
        }
        
        admin.initializeApp({
            projectId: firebaseConfig.firebase.projectId,
            credential: admin.credential.cert({
                projectId: firebaseConfig.firebase.projectId,
                privateKey: privateKey,
                clientEmail: firebaseConfig.firebase.clientEmail,
            }),
        });
        console.log('✅ Firebase Admin initialized successfully');
    } catch (error) {
        console.error('❌ Firebase Admin initialization failed:', error.message);
        console.warn('⚠️ Running with mock authentication (Firebase not configured)');
    }
}

const app = express();

// --- Middlewares ---
app.use(helmet({ contentSecurityPolicy: false })); 
app.use(compression());
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json({ limit: '10mb' })); 
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined', { stream: { write: (msg) => logger.info(msg.trim()) } }));

// ============================================
// 1. SMART ASTROLOGY API (Wallet-Based Token System)
// ============================================
const callAstrologyAPI = async (endpoint, payload) => {
    const walletToken = process.env.ASTROLOGY_WALLET_TOKEN?.trim(); 

    const mockData = {
        'geo_details': { geonames: [{ place_name: "Santipur, West Bengal", latitude: "23.2500", longitude: "88.4333", timezone: "5.5" }] },
        'birth_details': { ascendant: "Leo", sign: "Aries", Naksahtra: "Ashwini", Varna: "Kshatriya", Gana: "Deva" },
        'planets/extended': [
            { name: "Sun", sign: "Aries", normDegree: 15.2, house: 1 },
            { name: "Moon", sign: "Cancer", normDegree: 10.5, house: 4 },
            { name: "Mars", sign: "Aries", normDegree: 25.3, house: 1 },
            { name: "Mercury", sign: "Pisces", normDegree: 8.7, house: 12 },
            { name: "Jupiter", sign: "Pisces", normDegree: 12.1, house: 9 },
            { name: "Venus", sign: "Aquarius", normDegree: 18.4, house: 11 },
            { name: "Saturn", sign: "Capricorn", normDegree: 22.9, house: 10 },
            { name: "Rahu", sign: "Taurus", normDegree: 5.2, house: 2 },
            { name: "Ketu", sign: "Scorpio", normDegree: 5.2, house: 8 }
        ]
    };

    if (!walletToken) {
        console.warn("⚠️ Wallet Token missing. Using Mock Data.");
        return mockData[endpoint] || { success: true };
    }

    try {
        const response = await axios.post(
            `https://json.astrologyapi.com/v1/${endpoint}`, 
            payload, 
            {
                headers: { 
                    'x-astrologyapi-key': walletToken, 
                    'Content-Type': 'application/json' 
                },
                timeout: 10000 
            }
        );
        console.log(`✅ Real Data fetched from API (${endpoint})`);
        return response.data;
    } catch (err) {
        console.warn(`⚠️ API Error for ${endpoint}. Using Mock Data.`);
        return mockData[endpoint] || { success: true };
    }
};

// Astrology API Routes
app.post('/api/astrology/geo_details', async (req, res) => {
    try {
        console.log("📍 Location search request:", req.body);
        const data = await callAstrologyAPI('geo_details', req.body);
        res.json({ success: true, data: data });
    } catch (error) {
        console.warn("⚠️ Geo details error, sending empty response");
        res.json({ success: true, data: { geonames: [] } });
    }
});

app.post('/api/astrology/birth_details', async (req, res) => {
    try {
        const data = await callAstrologyAPI('birth_details', req.body);
        res.json({ success: true, data });
    } catch (error) {
        res.json({ success: true, data: { ascendant: "Leo", sign: "Aries", Naksahtra: "Ashwini", Varna: "Kshatriya", Gana: "Deva" } });
    }
});

app.post('/api/astrology/planets', async (req, res) => {
    try {
        const data = await callAstrologyAPI('planets/extended', req.body);
        res.json({ success: true, data });
    } catch (error) {
        res.json({ success: true, data: [] });
    }
});

// ============================================
// 2. AI INTERPRETATION API (Gemini-pro)
// ============================================
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/api/ai/interpret', async (req, res) => {
    try {
        const { planets, basic } = req.body;
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const prompt = `You are an expert Vedic Astrologer. Analyze Lagna: ${basic?.ascendant}, Moon Sign: ${basic?.sign}, Nakshatra: ${basic?.Naksahtra}. Positions: ${JSON.stringify(planets)}. Give a professional reading in 4 short paragraphs.`;

        const result = await model.generateContent(prompt);
        const text = result.response.text();
        res.json({ success: true, interpretation: text });
    } catch (error) {
        console.error("⚠️ AI Failed, using Fallback.");
        const fallbackText = "Due to cosmic alignment issues, a general reading is generated: Focus on your strengths, career growth is likely in the coming months, and maintain mental peace through meditation.";
        res.json({ success: true, interpretation: fallbackText });
    }
});

// ============================================
// 3. DATABASE SAVE & FETCH APIs
// ============================================
app.post('/api/reports/save', async (req, res) => {
    try {
        const { user_phone, name, dob, basic_info, planets_data, ai_insights } = req.body;
        const { data, error } = await supabase
            .from('saved_reports')
            .insert([{ user_phone, name, dob, basic_info, planets_data, ai_insights }])
            .select();
        if (error) throw error;
        res.status(200).json({ success: true, message: "Saved!", report: data[0] });
    } catch (error) {
        console.error("Save error:", error);
        res.status(500).json({ success: false, message: "Save Failed" });
    }
});

app.get('/api/reports/single/:id', async (req, res) => {
    try {
        const { data, error } = await supabase.from('saved_reports').select('*').eq('id', req.params.id).single();
        if (error) throw error;
        res.status(200).json({ success: true, report: data });
    } catch (error) {
        res.status(500).json({ success: false, message: "Report not found" });
    }
});

app.get('/api/reports/:phone', async (req, res) => {
    try {
        const { data, error } = await supabase.from('saved_reports').select('*').eq('user_phone', req.params.phone).order('created_at', { ascending: false });
        if (error) throw error;
        res.status(200).json({ success: true, reports: data });
    } catch (error) {
        res.status(500).json({ success: false, message: "Fetch failed" });
    }
});

// ============================================
// 4. PAYMENT API
// ============================================
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID, 
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

app.post('/api/payment/create-order', async (req, res) => {
    try {
        const order = await razorpay.orders.create({ 
            amount: 1100 * 100, 
            currency: "INR", 
            receipt: `rcpt_${Date.now()}` 
        });
        res.json({ success: true, order });
    } catch (error) {
        console.error("❌ Razorpay Error:", error.error || error);
        res.status(500).json({ success: false, message: "Order creation failed" }); 
    }
});

// ============================================
// 5. TEST ENDPOINTS (For debugging)
// ============================================

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

// Test Firebase connection
app.get('/api/test-firebase', async (req, res) => {
    try {
        if (!admin.apps.length) {
            return res.json({ 
                success: false, 
                message: 'Firebase not initialized',
                apps: 0
            });
        }
        
        const auth = admin.auth();
        res.json({ 
            success: true, 
            message: 'Firebase is working!',
            apps: admin.apps.length,
            projectId: admin.apps[0]?.options?.projectId
        });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
});

// Test Supabase connection
app.get('/api/test-supabase', async (req, res) => {
    try {
        const { data, error } = await supabase.from('users').select('count', { count: 'exact', head: true });
        
        if (error) throw error;
        
        res.json({ 
            success: true, 
            message: 'Supabase is working!',
            usersCount: data
        });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
});

// Test all connections
app.get('/api/test-all', async (req, res) => {
    const results = {
        server: { status: 'ok', timestamp: new Date().toISOString() },
        firebase: { status: 'checking' },
        supabase: { status: 'checking' },
        env: {
            node_env: process.env.NODE_ENV,
            port: process.env.PORT,
            hasFirebaseKey: !!process.env.FIREBASE_PRIVATE_KEY,
            hasSupabaseUrl: !!process.env.SUPABASE_URL,
            hasGeminiKey: !!process.env.GEMINI_API_KEY,
            hasRazorpayKeys: !!(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET)
        }
    };
    
    // Check Firebase
    try {
        if (admin.apps.length) {
            results.firebase = { status: 'ok', apps: admin.apps.length };
        } else {
            results.firebase = { status: 'not_initialized' };
        }
    } catch (error) {
        results.firebase = { status: 'error', message: error.message };
    }
    
    // Check Supabase
    try {
        const { error } = await supabase.from('users').select('count', { count: 'exact', head: true });
        if (error) throw error;
        results.supabase = { status: 'ok' };
    } catch (error) {
        results.supabase = { status: 'error', message: error.message };
    }
    
    res.json(results);
});

// ============================================
// 6. ROUTES & ERROR HANDLING
// ============================================
app.use('/api/auth', authRoutes);
app.use('/api/kundli', kundliRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/matchmaking', matchmakingRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api', homeRoutes);
app.use('/api/hero', heroRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/about', aboutRoutes);
app.use('/api/contact', contactRoutes);


// 404 handler
app.use((req, res) => res.status(404).json({ message: 'Route not found' }));

// Global error handler
app.use(errorHandler);

// ============================================
// 7. START SERVER
// ============================================
const PORT = appConfig.port || 5000;
app.listen(PORT, () => {
    logger.info(`🚀 Server safely running on port ${PORT}`);
    console.log(`\n✅ Server started successfully!`);
    console.log(`📍 Health check: http://localhost:${PORT}/health`);
    console.log(`🔧 Test all: http://localhost:${PORT}/api/test-all`);
    console.log(`🔑 Firebase: ${admin.apps.length ? '✅ Initialized' : '❌ Not initialized'}`);
    console.log(`💾 Supabase: ${process.env.SUPABASE_URL ? '✅ Configured' : '❌ Not configured'}`);
});


// Add this to your server/index.js or routes/ai.js
app.post('/api/ai/quick-insight', async (req, res) => {
    try {
        const { zodiac, userId } = req.body;
        
        const insights = {
            'Aries': "Mars energizes your career sector. Leadership opportunities arise this week. Take initiative on pending projects.",
            'Taurus': "Venus brings harmony to relationships. Financial decisions made now will yield long-term benefits.",
            'Gemini': "Mercury enhances communication. Perfect time for networking and new collaborations.",
            'Cancer': "Moon in your sign heightens intuition. Trust your gut feelings about important decisions.",
            'Leo': "Sun illuminates your creative sector. Your natural leadership will be recognized by superiors.",
            'Virgo': "Mercury retrograde ends next week, boosting communication. Jupiter signals travel and higher learning.",
            'Libra': "Venus brings balance to work and home life. A partnership opportunity may arise.",
            'Scorpio': "Pluto transforms your career path. Embrace changes coming your way this month.",
            'Sagittarius': "Jupiter expands your horizons. Travel or educational opportunities are favored.",
            'Capricorn': "Saturn rewards your hard work. Recognition and advancement are on the horizon.",
            'Aquarius': "Uranus brings unexpected opportunities. Stay flexible and open to new ideas.",
            'Pisces': "Neptune enhances creativity. Artistic and spiritual pursuits are highly favored."
        };
        
        res.json({ 
            success: true, 
            insight: insights[zodiac] || "Mercury retrograde ends next week, boosting communication. Jupiter in the 9th house signals travel and higher learning. Embrace spiritual practices."
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});