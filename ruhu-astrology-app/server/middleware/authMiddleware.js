// server/middleware/authMiddleware.js
import admin from 'firebase-admin';
import { supabase } from '../utils/supabase.js';

// Firebase Admin should be initialized elsewhere (e.g., config/firebase.js)

export const protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ message: 'Not authorized, no token' });
    }

    // Verify token with Firebase Admin
    const decodedToken = await admin.auth().verifyIdToken(token);
    const firebaseUid = decodedToken.uid;

    // 🚀 TODO: [SUPABASE DB] Fetch user from Supabase using firebase_uid
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('firebase_uid', firebaseUid)
      .single();

    if (error || !user) {
      // If user not found in Supabase, we might create one or reject.
      // For now, reject.
      return res.status(401).json({ message: 'User not found in database' });
    }

    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

// Optional: restrict to admin users
export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Admin only.' });
  }
};