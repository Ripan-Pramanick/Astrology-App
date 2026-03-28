// server/controllers/authController.js
import admin from 'firebase-admin';
import { supabase } from '../utils/supabase.js'; // Supabase client instance

// Firebase Admin SDK should be initialized elsewhere (e.g., config/firebase.js)
// For now, assume it's already initialized in index.js or config.

/**
 * Verify Firebase ID token and sync user with Supabase
 * POST /api/auth/verify-phone
 * Expects body: { idToken }
 */
export const verifyPhoneAuth = async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({ success: false, message: 'Missing token.' });
    }

    // Verify the Firebase ID token
    let decodedToken;
    try {
      decodedToken = await admin.auth().verifyIdToken(idToken);
    } catch (err) {
      console.error('Token verification failed:', err);
      return res.status(401).json({ success: false, message: 'Invalid token.' });
    }

    const { uid, phone_number, name, email, picture } = decodedToken;

    // 🚀 TODO: [SUPABASE DB] Check if user exists in 'users' table
    let { data: existingUser, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('firebase_uid', uid)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 = not found
      console.error('Supabase fetch error:', fetchError);
      return res.status(500).json({ success: false, message: 'Database error.' });
    }

    let user;
    if (!existingUser) {
      // 🚀 TODO: [SUPABASE DB] Create new user
      const { data: newUser, error: insertError } = await supabase
        .from('users')
        .insert([
          {
            firebase_uid: uid,
            phone: phone_number,
            name: name || '',
            email: email || '',
            avatar: picture || '',
            role: 'user', // default role
            created_at: new Date(),
          },
        ])
        .select()
        .single();

      if (insertError) {
        console.error('Supabase insert error:', insertError);
        return res.status(500).json({ success: false, message: 'Failed to create user.' });
      }
      user = newUser;
    } else {
      // Optionally update user details (e.g., name, avatar) if changed
      const updates = {};
      if (name && existingUser.name !== name) updates.name = name;
      if (picture && existingUser.avatar !== picture) updates.avatar = picture;
      if (Object.keys(updates).length > 0) {
        await supabase.from('users').update(updates).eq('id', existingUser.id);
      }
      user = existingUser;
    }

    // Return user data (excluding sensitive fields like firebase_uid if needed)
    const { firebase_uid, ...safeUser } = user;

    return res.status(200).json({
      success: true,
      user: safeUser,
    });
  } catch (error) {
    console.error('Auth verification error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};