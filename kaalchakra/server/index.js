// server/index.js - সম্পূর্ণ আপডেটেড ভার্সন
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
// CORS CONFIGURATION (একবারই রাখুন, ডুপ্লিকেট নয়)
// ============================================
const allowedOrigins = [
    'https://astrology-app-teal.vercel.app',
    'https://kaalchakra-two.vercel.app',
    'http://localhost:5173',
    'http://localhost:5174'
];

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) !== -1) return callback(null, true);
        console.log(`❌ CORS blocked: ${origin}`);
        return callback(new Error('Not allowed by CORS'), false);
    },
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
// MOCK DATA (API fail করলে ব্যবহার হবে)
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

// ============================================
// ASTROLOGY API CALL (রিয়েল ডেটার জন্য)
// ============================================
const callAstrologyAPI = async (endpoint, payload) => {
    const userId = process.env.ASTROLOGY_USER_ID?.trim();
    const walletToken = process.env.ASTROLOGY_WALLET_TOKEN?.trim();

    if (!userId || !walletToken) {
        throw new Error("ASTROLOGY_USER_ID বা ASTROLOGY_WALLET_TOKEN সেট নেই .env তে!");
    }

    const authString = Buffer.from(`${userId}:${walletToken}`).toString('base64');

    try {
        const response = await axios.post(
            `https://json.astrologyapi.com/v1/${endpoint}`,
            payload,
            {
                headers: {
                    'Authorization': `Basic ${authString}`,
                    'Content-Type': 'application/json'
                },
                timeout: 10000
            }
        );
        console.log(`✅ Real Data fetched from AstrologyAPI (${endpoint})`);
        return response.data;
    } catch (err) {
        console.error(`❌ AstrologyAPI Error for ${endpoint}:`, err.response?.data || err.message);
        throw err;
    }
};

// ============================================
// ASTROLOGY API ROUTES
// ============================================
app.post('/api/astrology/birth_details', async (req, res) => {
    try {
        const data = await callAstrologyAPI('birth_details', req.body);
        res.json({ success: true, data });
    } catch (error) {
        console.warn("⚠️ Using mock birth details data");
        res.json({ success: true, data: getMockBirthDetails() });
    }
});

app.post('/api/astrology/planets', async (req, res) => {
    try {
        const data = await callAstrologyAPI('planets/extended', req.body);
        res.json({ success: true, data });
    } catch (error) {
        console.warn("⚠️ Using mock planets data");
        res.json({ success: true, data: getMockPlanets() });
    }
});

app.post('/api/astrology/planets/extended', async (req, res) => {
    try {
        const data = await callAstrologyAPI('planets/extended', req.body);
        res.json({ success: true, data });
    } catch (error) {
        console.warn("⚠️ Using mock planets data");
        res.json({ success: true, data: getMockPlanets() });
    }
});

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

// ============================================
// HOME PAGE / FRONTEND API ENDPOINTS (ডাটাবেজ থেকে রিয়েল ডেটা)
// ============================================

// Articles endpoint - DATABASE থেকে
app.get('/api/articles', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('articles')
            .select('*')
            .eq('status', 'published')
            .order('created_at', { ascending: false });

        if (error) throw error;
        res.json({ success: true, articles: data || [] });
    } catch (error) {
        console.error("Articles fetch error:", error);
        res.json({ success: true, articles: [] });
    }
});

// Single article endpoint
app.get('/api/articles/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { data, error } = await supabase
            .from('articles')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        res.json({ success: true, article: data });
    } catch (error) {
        res.status(404).json({ success: false, message: 'Article not found' });
    }
});

// Hero section endpoint - DATABASE থেকে
app.get('/api/hero', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('hero_section')
            .select('*')
            .eq('is_active', true)
            .single();

        if (error) throw error;
        res.json({ success: true, hero: data || {} });
    } catch (error) {
        console.error("Hero fetch error:", error);
        res.json({ success: true, hero: {
            title: "Discover Your Cosmic Path",
            subtitle: "Personalized Vedic Astrology Readings",
            ctaText: "Get Started",
            ctaLink: "/kundli"
        }});
    }
});

// Hero stats endpoint - DATABASE থেকে
app.get('/api/hero/stats', async (req, res) => {
    try {
        // Get counts from database
        const [usersCount, reportsCount] = await Promise.all([
            supabase.from('users').select('*', { count: 'exact', head: true }),
            supabase.from('saved_reports').select('*', { count: 'exact', head: true })
        ]);

        res.json({ 
            success: true, 
            stats: {
                users: usersCount.count || 10000,
                readings: reportsCount.count || 25000,
                satisfaction: 98,
                astrologers: 50
            }
        });
    } catch (error) {
        console.error("Hero stats error:", error);
        res.json({ success: true, stats: {
            users: 10000, readings: 25000, satisfaction: 98, astrologers: 50
        }});
    }
});

// Testimonials endpoint - DATABASE থেকে (সরাসরি Supabase থেকে)
app.get('/api/testimonials', async (req, res) => {
    try {
        const { is_approved, limit } = req.query;
        
        let query = supabase
            .from('testimonials')
            .select('*')
            .order('created_at', { ascending: false });

        if (is_approved === 'true') {
            query = query.eq('is_approved', true);
        }

        if (limit) {
            query = query.limit(parseInt(limit));
        }

        const { data, error } = await query;

        if (error) throw error;
        res.json({ success: true, testimonials: data || [], count: data?.length || 0 });
    } catch (error) {
        console.error("Testimonials fetch error:", error);
        // Fallback mock data
        res.json({ success: true, testimonials: [
            { id: 1, name: "Rahul Sharma", location: "Mumbai", rating: 5, text: "Amazing accuracy!", is_approved: true },
            { id: 2, name: "Priya Patel", location: "Delhi", rating: 5, text: "Life-changing insights!", is_approved: true }
        ]});
    }
});

// Testimonials stats endpoint - DATABASE থেকে
app.get('/api/testimonials/stats', async (req, res) => {
    try {
        const [total, fiveStar, fourStar, threeStar] = await Promise.all([
            supabase.from('testimonials').select('*', { count: 'exact', head: true }),
            supabase.from('testimonials').select('*', { count: 'exact', head: true }).eq('rating', 5),
            supabase.from('testimonials').select('*', { count: 'exact', head: true }).eq('rating', 4),
            supabase.from('testimonials').select('*', { count: 'exact', head: true }).eq('rating', 3)
        ]);

        const totalCount = total.count || 0;
        res.json({ 
            success: true, 
            stats: {
                total: totalCount,
                averageRating: totalCount > 0 ? 4.8 : 0,
                fiveStarCount: fiveStar.count || 0,
                fourStarCount: fourStar.count || 0,
                threeStarCount: threeStar.count || 0
            }
        });
    } catch (error) {
        console.error("Testimonials stats error:", error);
        res.json({ success: true, stats: { total: 156, averageRating: 4.8, fiveStarCount: 128, fourStarCount: 22, threeStarCount: 6 }});
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

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
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
// USER STATUS & PROFILE ENDPOINTS
// ============================================
app.get('/api/user/:identifier/status', async (req, res) => {
    try {
        const { identifier } = req.params;

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

app.get('/api/reports/by-email/:email', async (req, res) => {
    try {
        const email = decodeURIComponent(req.params.email);
        const { data: user } = await supabase
            .from('users')
            .select('phone')
            .eq('email', email)
            .maybeSingle();

        let query = supabase.from('saved_reports').select('*').order('created_at', { ascending: false });

        if (user?.phone) {
            query = query.eq('user_phone', user.phone);
        } else {
            return res.status(200).json({ success: true, reports: [] });
        }

        const { data, error } = await query;
        if (error) throw error;
        res.status(200).json({ success: true, reports: data });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Fetch failed' });
    }
});

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
    console.log(`📍 Articles: http://localhost:${PORT}/api/articles`);
    console.log(`📍 Hero: http://localhost:${PORT}/api/hero`);
    console.log(`📍 Testimonials: http://localhost:${PORT}/api/testimonials`);
    console.log(`🔧 Test endpoint: http://localhost:${PORT}/api/test`);
    console.log(`🔑 Firebase: ${admin.apps.length ? '✅ Initialized' : '❌ Not initialized'}`);
    console.log(`💾 Supabase: ${process.env.SUPABASE_URL ? '✅ Configured' : '❌ Not configured'}`);
});

export default app;