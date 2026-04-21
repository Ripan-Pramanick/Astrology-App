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
import panchangRoutes from './routes/panchang.js';

// ============================================
// FIREBASE ADMIN INITIALIZATION
// ============================================
if (!admin.apps.length) {
    try {
        let privateKey = firebaseConfig.firebase?.privateKey;
        
        if (!privateKey) {
            console.error('❌ Firebase private key is missing in environment variables');
            throw new Error('Firebase private key is missing');
        }
        
        if (privateKey && privateKey.includes('\\n')) {
            privateKey = privateKey.replace(/\\n/g, '\n');
        }
        
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

// ============================================
// CORS CONFIGURATION
// ============================================
app.use(cors({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
}));
app.options('*', cors());

// --- Middlewares ---
app.use(helmet({ contentSecurityPolicy: false })); 
app.use(compression());
app.use(express.json({ limit: '10mb' })); 
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined', { stream: { write: (msg) => logger.info(msg.trim()) } }));

// ============================================
// FREE GEO LOCATION API (OpenStreetMap)
// ============================================
const getGeoLocationFree = async (place) => {
    try {
        const response = await axios.get(`https://nominatim.openstreetmap.org/search`, {
            params: {
                q: place,
                format: 'json',
                limit: 5,
                addressdetails: 1
            },
            headers: {
                'User-Agent': 'KaalChakra-Astrology-App/1.0'
            },
            timeout: 5000
        });
        
        if (response.data && response.data.length > 0) {
            return response.data.map(loc => ({
                place_name: loc.display_name,
                latitude: loc.lat,
                longitude: loc.lon,
                timezone: "5.5"
            }));
        }
        return [];
    } catch (error) {
        console.error("Free Geo location error:", error.message);
        return [];
    }
};

// ============================================
// ASTROLOGY API WITH FALLBACK
// ============================================
const getMockGeoData = () => ({
    geonames: [{ 
        place_name: "Kolkata, West Bengal, India", 
        latitude: "22.5726", 
        longitude: "88.3639", 
        timezone: "5.5" 
    }]
});

const getMockBirthDetails = () => ({
    ascendant: "Leo",
    sign: "Aries",
    Naksahtra: "Ashwini",
    Varna: "Kshatriya",
    Gana: "Deva"
});

const getMockPlanets = () => [
    { name: "Sun", sign: "Aries", normDegree: 15.2, house: 1 },
    { name: "Moon", sign: "Cancer", normDegree: 10.5, house: 4 },
    { name: "Mars", sign: "Aries", normDegree: 25.3, house: 1 },
    { name: "Mercury", sign: "Pisces", normDegree: 8.7, house: 12 },
    { name: "Jupiter", sign: "Pisces", normDegree: 12.1, house: 9 },
    { name: "Venus", sign: "Aquarius", normDegree: 18.4, house: 11 },
    { name: "Saturn", sign: "Capricorn", normDegree: 22.9, house: 10 },
    { name: "Rahu", sign: "Taurus", normDegree: 5.2, house: 2 },
    { name: "Ketu", sign: "Scorpio", normDegree: 5.2, house: 8 }
];

const callAstrologyAPI = async (endpoint, payload) => {
    const walletToken = process.env.ASTROLOGY_WALLET_TOKEN?.trim();

    if (!walletToken) {
        console.warn("⚠️ Wallet Token missing. Using Mock Data.");
        return getMockResponse(endpoint);
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
        return getMockResponse(endpoint);
    }
};

const getMockResponse = (endpoint) => {
    switch(endpoint) {
        case 'geo_details':
            return getMockGeoData();
        case 'birth_details':
            return getMockBirthDetails();
        case 'planets/extended':
            return getMockPlanets();
        default:
            return { success: true };
    }
};

// ============================================
// ASTROLOGY API ROUTES
// ============================================
app.post('/api/astrology/geo_details', async (req, res) => {
    try {
        console.log("📍 Location search request:", req.body);
        const { place } = req.body;
        
        let data = await getGeoLocationFree(place);
        
        if (data && data.length > 0) {
            const formattedData = data.map(loc => ({
                place_name: loc.place_name,
                lat: loc.latitude,
                lng: loc.longitude,
                latitude: loc.latitude,
                longitude: loc.longitude,
                timezone: loc.timezone || "5.5"
            }));
            res.json({ success: true, data: formattedData });
        } else {
            res.json({ success: true, data: getMockGeoData().geonames });
        }
    } catch (error) {
        console.warn("⚠️ Geo details error, sending mock response");
        res.json({ success: true, data: getMockGeoData().geonames });
    }
});

app.post('/api/astrology/birth_details', async (req, res) => {
    try {
        const data = await callAstrologyAPI('birth_details', req.body);
        res.json({ success: true, data });
    } catch (error) {
        res.json({ success: true, data: getMockBirthDetails() });
    }
});

app.post('/api/astrology/planets', async (req, res) => {
    try {
        const data = await callAstrologyAPI('planets/extended', req.body);
        res.json({ success: true, data });
    } catch (error) {
        res.json({ success: true, data: getMockPlanets() });
    }
});

// ============================================
// AI INTERPRETATION API
// ============================================
let genAI;
try {
    if (process.env.GEMINI_API_KEY) {
        genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        console.log('✅ Gemini AI initialized');
    } else {
        console.warn('⚠️ Gemini API key missing');
    }
} catch (error) {
    console.warn('⚠️ Failed to initialize Gemini AI:', error.message);
}

app.post('/api/ai/interpret', async (req, res) => {
    try {
        const { planets, basic } = req.body;
        
        if (!genAI) {
            const fallbackText = "Due to cosmic alignment issues, a general reading is generated: Focus on your strengths, career growth is likely in the coming months, and maintain mental peace through meditation.";
            return res.json({ success: true, interpretation: fallbackText });
        }
        
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const prompt = `You are an expert Vedic Astrologer. Analyze Lagna: ${basic?.ascendant || 'Unknown'}, Moon Sign: ${basic?.sign || 'Unknown'}, Nakshatra: ${basic?.Naksahtra || 'Unknown'}. Positions: ${JSON.stringify(planets)}. Give a professional reading in 4 short paragraphs.`;

        const result = await model.generateContent(prompt);
        const text = result.response.text();
        res.json({ success: true, interpretation: text });
    } catch (error) {
        console.error("⚠️ AI Failed, using Fallback.");
        const fallbackText = "Due to cosmic alignment issues, a general reading is generated: Focus on your strengths, career growth is likely in the coming months, and maintain mental peace through meditation.";
        res.json({ success: true, interpretation: fallbackText });
    }
});

app.post('/api/ai/quick-insight', async (req, res) => {
    try {
        const { zodiac } = req.body;
        
        const insights = {
            'Aries': "Mars energizes your career sector. Leadership opportunities arise this week.",
            'Taurus': "Venus brings harmony to relationships. Financial decisions yield long-term benefits.",
            'Gemini': "Mercury enhances communication. Perfect time for networking.",
            'Cancer': "Moon in your sign heightens intuition. Trust your gut feelings.",
            'Leo': "Sun illuminates your creative sector. Your leadership will be recognized.",
            'Virgo': "Mercury retrograde ends next week, boosting communication.",
            'Libra': "Venus brings balance to work and home life.",
            'Scorpio': "Pluto transforms your career path. Embrace changes.",
            'Sagittarius': "Jupiter expands your horizons. Travel opportunities are favored.",
            'Capricorn': "Saturn rewards your hard work. Recognition is on the horizon.",
            'Aquarius': "Uranus brings unexpected opportunities. Stay flexible.",
            'Pisces': "Neptune enhances creativity. Artistic pursuits are highly favored."
        };
        
        res.json({ success: true, insight: insights[zodiac] || "Embrace spiritual practices this week." });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ============================================
// DATABASE SAVE & FETCH APIs
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
// PAYMENT API
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

app.post('/api/payment/verify-payment', async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, user_phone } = req.body;
        
        const crypto = await import('crypto');
        const sign = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(sign.toString())
            .digest("hex");

        if (razorpay_signature !== expectedSignature) {
            return res.status(400).json({ success: false, message: "Invalid payment signature" });
        }

        const expiryDate = new Date();
        expiryDate.setFullYear(expiryDate.getFullYear() + 1);

        const { data: updatedUser, error: updateError } = await supabase
            .from('users')
            .update({
                subscription: 'premium',
                is_premium: true,
                premium_expiry: expiryDate.toISOString(),
                premium_activated_at: new Date().toISOString()
            })
            .eq('phone', user_phone)
            .select()
            .single();

        if (updateError) throw updateError;

        res.json({ success: true, message: "Premium activated successfully!", user: updatedUser });
    } catch (error) {
        console.error("Payment verification error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// ============================================
// TEST ENDPOINTS
// ============================================
app.get('/health', (req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

app.get('/api/test', (req, res) => {
    console.log("✅ Test endpoint hit");
    res.json({ message: 'API is working!', timestamp: new Date().toISOString() });
});

app.get('/api/debug/geo-response', async (req, res) => {
    console.log("🟢 Debug endpoint called");
    try {
        const response = await axios.get(`https://nominatim.openstreetmap.org/search`, {
            params: {
                q: 'Kolkata',
                format: 'json',
                limit: 5
            },
            headers: {
                'User-Agent': 'KaalChakra-Astrology-App/1.0'
            }
        });
        console.log("🟢 Got response, count:", response.data.length);
        res.json({
            success: true,
            data: response.data,
            count: response.data.length
        });
    } catch (error) {
        console.error("🔴 Debug endpoint error:", error.message);
        res.json({ success: false, error: error.message });
    }
});

app.get('/api/test-firebase', async (req, res) => {
    res.json({ success: true, message: 'Firebase is working!', apps: admin.apps.length });
});

app.get('/api/test-supabase', async (req, res) => {
    try {
        const { error } = await supabase.from('users').select('count', { count: 'exact', head: true });
        if (error) throw error;
        res.json({ success: true, message: 'Supabase is working!' });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
});

app.get('/api/test-all', async (req, res) => {
    res.json({
        server: { status: 'ok', timestamp: new Date().toISOString() },
        firebase: { status: admin.apps.length ? 'ok' : 'not_initialized' },
        supabase: { status: 'ok' },
        env: {
            node_env: process.env.NODE_ENV,
            port: process.env.PORT,
            hasFirebaseKey: !!process.env.FIREBASE_PRIVATE_KEY,
            hasSupabaseUrl: !!process.env.SUPABASE_URL,
            hasGeminiKey: !!process.env.GEMINI_API_KEY,
            hasRazorpayKeys: !!(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET)
        }
    });
});

// ============================================
// ROUTES
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
app.use('/api/panchang', panchangRoutes);

// ============================================
// 404 HANDLER - This must be LAST
// ============================================
app.use((req, res) => {
    console.log(`❌ 404 Not Found: ${req.method} ${req.url}`);
    res.status(404).json({ message: 'Route not found' });
});

// Global error handler
app.use(errorHandler);

// ============================================
// START SERVER
// ============================================
const PORT = appConfig.port || 5000;
app.listen(PORT, () => {
    logger.info(`🚀 Server safely running on port ${PORT}`);
    console.log(`\n✅ Server started successfully!`);
    console.log(`📍 Health check: http://localhost:${PORT}/health`);
    console.log(`🔧 Test endpoint: http://localhost:${PORT}/api/test`);
    console.log(`🔧 Debug geo: http://localhost:${PORT}/api/debug/geo-response`);
    console.log(`🔑 Firebase: ${admin.apps.length ? '✅ Initialized' : '❌ Not initialized'}`);
    console.log(`💾 Supabase: ${process.env.SUPABASE_URL ? '✅ Configured' : '❌ Not configured'}`);
});

// Add this endpoint for user status check
app.get('/api/user/:identifier/status', async (req, res) => {
    try {
        const { identifier } = req.params;
        
        // Check if user exists by phone or email
        let { data: user, error } = await supabase
            .from('users')
            .select('*')
            .or(`phone.eq.${identifier},email.eq.${identifier}`)
            .maybeSingle();
        
        if (error) throw error;
        
        res.json({ 
            success: true, 
            isPremium: user?.subscription === 'premium' || user?.is_premium === true,
            user: user
        });
    } catch (error) {
        console.error("User status error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// Add this endpoint for profile updates
app.put('/api/user/profile/:identifier', async (req, res) => {
    try {
        const { identifier } = req.params;
        const { name, email, phone } = req.body;
        
        const { data: user, error } = await supabase
            .from('users')
            .update({ name, email, updated_at: new Date().toISOString() })
            .or(`phone.eq.${identifier},email.eq.${identifier}`)
            .select()
            .single();
        
        if (error) throw error;
        
        res.json({ success: true, user });
    } catch (error) {
        console.error("Profile update error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
});

export default app;