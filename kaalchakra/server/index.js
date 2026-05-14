// server/index.js
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
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
import serviceRoutes from './routes/services.js';
import heroRoutes from './routes/hero.js';
import homeRoutes from './routes/home.js';
import articleRoutes from './routes/articles.js';
import testimonialRoutes from './routes/testimonials.js';
import aboutRoutes from './routes/about.js';
import contactRoutes from './routes/contact.js';
import panchangRoutes from './routes/panchang.js';
import astrologyRoutes from './routes/astrologyRoutes.js'; 

// ============================================
// FIREBASE ADMIN INITIALIZATION
// ============================================
if (!admin.apps.length) {
    try {
        let privateKey = firebaseConfig.firebase?.privateKey;
        if (!privateKey) throw new Error('Firebase private key is missing');
        if (privateKey && privateKey.includes('\\n')) privateKey = privateKey.replace(/\\n/g, '\n');
        
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
        console.warn('⚠️ Firebase Admin initialization skipped/failed:', error.message);
    }
}

// ✅ APP INITIALIZATION
const app = express();

// ============================================
// MIDDLEWARES
// ============================================
app.use(cors({
    origin: [
        'https://astrology-app-teal.vercel.app',
        'https://kaalchakraa.vercel.app',
        'http://localhost:5173',
        'http://localhost:5174'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
}));

app.use(helmet({ contentSecurityPolicy: false }));
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined', { stream: { write: (msg) => logger.info(msg.trim()) } }));

// ============================================
// BASIC ENDPOINTS
// ============================================
app.get('/', (req, res) => res.status(200).send('Kaalchakra API is running successfully!'));
app.get('/health', (req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));
app.get('/api/test', (req, res) => res.json({ message: 'API is working!' }));

// ============================================
// MAIN ROUTES
// ============================================
app.use('/api/auth', authRoutes);
app.use('/api/kundli', kundliRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api', homeRoutes);
app.use('/api/hero', heroRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/about', aboutRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/panchang', panchangRoutes);

app.get('/hero/stats', async (req, res) => {
    try {
        // এখানে আপনার ডাটাবেস থেকে স্ট্যাটস এনেও দেখাতে পারেন। আপাতত আমি একটি ডামি ডেটা দিয়ে দিচ্ছি:
        res.json({ 
            success: true, 
            stats: { 
                happy_users: "10k+", 
                kundlis_generated: "50k+", 
                expert_astrologers: "50+" 
            } 
        });
    } catch (error) {
        res.json({ success: false, stats: {} });
    }
});


// ✅ ASTROLOGY ROUTES
app.use('/api', astrologyRoutes); 
app.use('/', astrologyRoutes);

// ============================================
// DATABASE SAVE & FETCH APIs (Reports)
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
        res.status(500).json({ success: false, message: "Save Failed" });
    }
});

app.get('/api/reports/by-email/:email', async (req, res) => {
    try {
        const email = decodeURIComponent(req.params.email);
        const { data: user } = await supabase.from('users').select('phone').eq('email', email).maybeSingle();
        if (!user?.phone) return res.status(200).json({ success: true, reports: [] });

        const { data, error } = await supabase.from('saved_reports').select('*').eq('user_phone', user.phone).order('created_at', { ascending: false });
        if (error) throw error;
        res.status(200).json({ success: true, reports: data });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Fetch failed' });
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
    }
} catch (error) {
    console.warn('⚠️ Gemini AI failed to load');
}

app.post('/api/ai/interpret', async (req, res) => {
    try {
        if (!genAI) throw new Error("No AI Client");
        const { planets, basic } = req.body;
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const prompt = `You are an expert Vedic Astrologer. Analyze Lagna: ${basic?.ascendant || 'Unknown'}, Moon Sign: ${basic?.sign || 'Unknown'}, Nakshatra: ${basic?.Naksahtra || 'Unknown'}. Positions: ${JSON.stringify(planets)}. Give a professional reading in 4 short paragraphs.`;
        const result = await model.generateContent(prompt);
        res.json({ success: true, interpretation: result.response.text() });
    } catch (error) {
        res.json({ success: true, interpretation: "Due to cosmic alignment issues, a general reading is generated: Focus on your strengths, career growth is likely in the coming months, and maintain mental peace through meditation." });
    }
});

// ============================================
// DIRECT ENDPOINTS (Legacy)
// ============================================
app.get('/hero', async (req, res) => {
    try {
        const { data, error } = await supabase.from('hero_section').select('*').eq('is_active', true).single();
        res.json({ success: true, hero: data || {} });
    } catch (error) {
        res.json({ success: true, hero: {} });
    }
});

app.get('/articles', async (req, res) => {
    try {
        const { data } = await supabase.from('articles').select('*').eq('status', 'published').order('created_at', { ascending: false });
        res.json({ success: true, articles: data || [] });
    } catch (error) {
        res.json({ success: true, articles: [] });
    }
});

app.get('/testimonials', async (req, res) => {
    try {
        const { data } = await supabase.from('testimonials').select('*').eq('is_approved', true).order('created_at', { ascending: false });
        res.json({ success: true, testimonials: data || [] });
    } catch (error) {
        res.json({ success: true, testimonials: [] });
    }
});

// ============================================
// 404 HANDLER
// ============================================
app.use((req, res) => {
    console.log(`❌ 404 Not Found: ${req.method} ${req.url}`);
    res.status(404).json({ message: 'Route not found' });
});

app.use(errorHandler);

// ============================================
// START SERVER
// ============================================
const PORT = appConfig.port || 5000;
app.listen(PORT, () => {
    console.log(`\n✅ Server started successfully on port ${PORT}!`);
});

export default app;