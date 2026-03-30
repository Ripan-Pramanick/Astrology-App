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
app.use(express.json()); // 👈 এই লাইনটা না থাকলে req.body ফাঁকা আসবে এবং 500 এরর দেবে!

// server/index.js (যেখানে আপনার অন্যান্য API আছে)

app.get('/api/dashboard', (req, res) => {
  // আপনার ফ্রন্টএন্ড ঠিক যেই ফরম্যাটে ডাটা খুঁজছে (response.data.requests)
  res.status(200).json({
    success: true,
    requests: [
      { id: 'req_001', created_at: '2026-03-25T10:30:00Z', status: 'completed' },
      { id: 'req_002', created_at: '2026-03-28T14:15:00Z', status: 'processing' },
      { id: 'req_003', created_at: '2026-03-30T09:00:00Z', status: 'pending' }
    ]
  });
});

// server/index.js (বা আপনার controllers ফাইলে)

app.put('/api/user/profile', async (req, res) => {
  const { name, email, phone } = req.body; // ফ্রন্টএন্ড থেকে পাঠানো ডাটা

  try {
    // Supabase-এ ইউজার আপডেট করা
    const { data, error } = await supabase
      .from('users')
      .update({ name, email })
      .eq('phone', phone) // ফোন নম্বর দিয়ে ইউজারকে খুঁজে বের করবে
      .select();

    if (error) throw error;

    res.status(200).json({
      success: true,
      message: "Profile updated successfully!",
      user: data[0]
    });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ success: false, message: "Error updating profile" });
  }
});



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