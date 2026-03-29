// server/index.js
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import { config } from './config/env.js';
import { supabase } from './utils/supabase.js';
import logger from './utils/logger.js';
import { errorHandler } from './middleware/errorHandler.js';

// Import routes
import authRoutes from './routes/auth.js';
import kundliRoutes from './routes/kundli.js';
import paymentRoutes from './routes/payment.js';
import aiRoutes from './routes/ai.js';
import adminRoutes from './routes/admin.js';
// import dashboardRoutes from './routes/dashboard.js'; // We'll create later
import matchmakingRoutes from './routes/matchmaking.js';
import astrologyRoutes from './routes/astrology.routes.js'; // <-- এই লাইনটা যোগ করুন (আপনার ফাইলের নাম যদি শুধু astrology.js হয়, তাহলে সেটাই দেবেন)

// Firebase Admin initialization (if needed)
import admin from 'firebase-admin';
import { config as firebaseConfig } from './config/env.js';

admin.initializeApp({
    projectId: firebaseConfig.firebase.projectId,
    credential: admin.credential.cert({
        projectId: firebaseConfig.firebase.projectId,
        privateKey: firebaseConfig.firebase.privateKey,
        clientEmail: firebaseConfig.firebase.clientEmail,
    }),
});

const app = express();

// Middleware
app.use(helmet());
app.use(compression());
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined', { stream: { write: (msg) => logger.info(msg.trim()) } }));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/kundli', kundliRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/admin', adminRoutes);
// app.use('/api/dashboard', dashboardRoutes);
app.use('/api/matchmaking', matchmakingRoutes);
app.use('/api/astrology', astrologyRoutes); // <-- এই লাইনটা এখানে যোগ করে দিন!

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

// Start server
const PORT = config.port;
app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT} in ${config.nodeEnv} mode`);
});