// server/routes/auth.js
import express from 'express';
import admin from 'firebase-admin';
import { supabase } from '../utils/supabase.js';

const router = express.Router();

// Register user
router.post('/register', async (req, res) => {
  try {
    console.log("📝 Register request body:", req.body);
    
    const { name, email, phone, firebase_uid } = req.body;
    
    if (!name || !email || !phone) {
      return res.status(400).json({ 
        success: false, 
        message: 'Name, email, and phone are required' 
      });
    }
    
    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .eq('phone', phone)
      .maybeSingle();
    
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: 'User already exists with this phone number' 
      });
    }
    
    // Insert new user
    const { data, error } = await supabase
      .from('users')
      .insert([{ 
        name, 
        email, 
        phone, 
        firebase_uid, 
        role: 'user',
        created_at: new Date().toISOString()
      }])
      .select()
      .single();
    
    if (error) {
      console.error("Supabase insert error:", error);
      return res.status(500).json({ 
        success: false, 
        message: 'Database error: ' + error.message 
      });
    }
    
    console.log("✅ User registered:", data);
    
    return res.status(200).json({ 
      success: true, 
      message: 'Registration successful',
      user: {
        id: data.id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        role: data.role
      }
    });
    
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// Verify phone (Firebase token)
router.post('/verify-phone', async (req, res) => {
  try {
    console.log("📱 Verify phone request body:", req.body);
    
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json({ 
        success: false, 
        message: 'Token is required' 
      });
    }
    
    // Verify Firebase token
    let decodedToken;
    try {
      decodedToken = await admin.auth().verifyIdToken(token);
      console.log("✅ Firebase token verified for UID:", decodedToken.uid);
    } catch (firebaseError) {
      console.error("Firebase verification error:", firebaseError);
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid or expired token: ' + firebaseError.message 
      });
    }
    
    const { uid, phone_number, email, name } = decodedToken;
    
    if (!phone_number) {
      return res.status(400).json({ 
        success: false, 
        message: 'Phone number not found in token' 
      });
    }
    
    // Check if user exists
    let { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('phone', phone_number)
      .maybeSingle();
    
    if (error) {
      console.error("Supabase select error:", error);
      return res.status(500).json({ 
        success: false, 
        message: 'Database error: ' + error.message 
      });
    }
    
    if (!user) {
      // Create new user
      const { data: newUser, error: insertError } = await supabase
        .from('users')
        .insert([{ 
          firebase_uid: uid, 
          phone: phone_number, 
          email: email || '',
          name: name || email?.split('@')[0] || 'User',
          role: 'user',
          created_at: new Date().toISOString()
        }])
        .select()
        .single();
      
      if (insertError) {
        console.error("Supabase insert error:", insertError);
        return res.status(500).json({ 
          success: false, 
          message: 'Failed to create user: ' + insertError.message 
        });
      }
      
      user = newUser;
      console.log("✅ New user created:", user);
    } else {
      // Update existing user's firebase_uid if not set
      if (!user.firebase_uid) {
        await supabase
          .from('users')
          .update({ firebase_uid: uid, updated_at: new Date().toISOString() })
          .eq('id', user.id);
        user.firebase_uid = uid;
      }
      console.log("✅ Existing user found:", user);
    }
    
    return res.status(200).json({ 
      success: true, 
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        firebase_uid: user.firebase_uid
      }
    });
    
  } catch (error) {
    console.error("Verify phone error:", error);
    return res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// Verify email login (for Email/Password auth)
router.post('/verify-email', async (req, res) => {
  try {
    console.log("📧 Verify email request body:", req.body);
    
    const { token, email, name } = req.body;
    
    if (!token) {
      return res.status(400).json({ 
        success: false, 
        message: 'Token is required' 
      });
    }
    
    // Verify Firebase token
    let decodedToken;
    try {
      decodedToken = await admin.auth().verifyIdToken(token);
      console.log("✅ Firebase token verified for UID:", decodedToken.uid);
    } catch (firebaseError) {
      console.error("Firebase verification error:", firebaseError);
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid or expired token: ' + firebaseError.message 
      });
    }
    
    const { uid, email: tokenEmail } = decodedToken;
    const userEmail = email || tokenEmail;
    
    if (!userEmail) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email not found in token' 
      });
    }
    
    // Check if user exists by email
    let { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', userEmail)
      .maybeSingle();
    
    if (error) {
      console.error("Supabase select error:", error);
      return res.status(500).json({ 
        success: false, 
        message: 'Database error: ' + error.message 
      });
    }
    
    if (!user) {
      // Create new user with email
      const userName = name || userEmail.split('@')[0];
      const { data: newUser, error: insertError } = await supabase
        .from('users')
        .insert([{ 
          firebase_uid: uid, 
          email: userEmail,
          name: userName,
          role: 'user',
          created_at: new Date().toISOString()
        }])
        .select()
        .single();
      
      if (insertError) {
        console.error("Supabase insert error:", insertError);
        return res.status(500).json({ 
          success: false, 
          message: 'Failed to create user: ' + insertError.message 
        });
      }
      
      user = newUser;
      console.log("✅ New user created:", user);
    } else {
      // Update existing user's firebase_uid if not set
      if (!user.firebase_uid) {
        await supabase
          .from('users')
          .update({ firebase_uid: uid, updated_at: new Date().toISOString() })
          .eq('id', user.id);
        user.firebase_uid = uid;
      }
      console.log("✅ Existing user found:", user);
    }
    
    return res.status(200).json({ 
      success: true, 
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        role: user.role,
        firebase_uid: user.firebase_uid
      }
    });
    
  } catch (error) {
    console.error("Verify email error:", error);
    return res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

export default router; // Make sure this is at the end