// server/controllers/authController.js
import admin from 'firebase-admin';
import { supabase } from '../utils/supabase.js';

// ==========================================
// REGISTER USER - Step 1
// ==========================================
export const registerUser = async (req, res) => {
  try {
    console.log("📝 Registration request received:", req.body);

    const { name, email, phone } = req.body;

    // Validation
    if (!name || !email || !phone) {
      return res.status(400).json({ 
        success: false, 
        message: 'নাম, ইমেইল এবং ফোন নম্বর আবশ্যক!' 
      });
    }

    // Check if user already exists
    const { data: existingUser, error: searchError } = await supabase
      .from('users')
      .select('*')
      .eq('phone', phone)
      .maybeSingle();

    if (searchError) {
      console.error('❌ Search error:', searchError);
      return res.status(500).json({ 
        success: false, 
        message: 'ডাটাবেস চেক করতে সমস্যা হয়েছে।' 
      });
    }

    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: 'এই ফোন নম্বরটি আগে থেকেই রেজিস্টার করা আছে! দয়া করে লগইন করুন।' 
      });
    }

    // Create new user
    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert([{ 
        name, 
        email, 
        phone, 
        role: 'user',
        created_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (insertError) {
      console.error('❌ Supabase Insert Error:', insertError);
      return res.status(500).json({ 
        success: false, 
        message: 'ডাটাবেসে সেভ করতে সমস্যা হয়েছে: ' + insertError.message 
      });
    }

    return res.status(200).json({ 
      success: true, 
      message: 'সফলভাবে অ্যাকাউন্ট তৈরি হয়েছে! এবার OTP ভেরিফাই করুন।',
      user: newUser
    });

  } catch (error) {
    console.error('❌ Registration Error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'সার্ভারে সমস্যা হয়েছে! ' + error.message 
    });
  }
};

// ==========================================
// VERIFY PHONE / LOGIN - Step 2 (FIXED)
// ==========================================
export const verifyPhoneAuth = async (req, res) => {
  try {
    console.log("📱 Verify phone request received:", req.body);

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
      console.error('❌ Firebase verification error:', firebaseError);
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid or expired token: ' + firebaseError.message 
      });
    }

    const { uid, phone_number } = decodedToken;

    if (!phone_number) {
      return res.status(400).json({ 
        success: false, 
        message: 'Phone number not found in token' 
      });
    }

    // Check if user exists in database
    const { data: existingUser, error: searchError } = await supabase
      .from('users')
      .select('*')
      .eq('phone', phone_number)
      .maybeSingle();

    if (searchError) {
      console.error('❌ Database search error:', searchError);
      return res.status(500).json({ 
        success: false, 
        message: 'Database error: ' + searchError.message 
      });
    }

    let user;
    
    if (existingUser) {
      // Update existing user with Firebase UID
      const { data: updatedUser, error: updateError } = await supabase
        .from('users')
        .update({ 
          firebase_uid: uid,
          updated_at: new Date().toISOString()
        })
        .eq('phone', phone_number)
        .select()
        .single();

      if (updateError) {
        console.error('❌ Update error:', updateError);
        // Continue with existing user even if update fails
        user = existingUser;
      } else {
        user = updatedUser;
      }
      
      console.log("✅ Existing user logged in:", user.phone);
      
      return res.status(200).json({ 
        success: true, 
        message: 'Login successful',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          firebase_uid: user.firebase_uid
        }
      });
      
    } else {
      // Create new user
      const { data: newUser, error: insertError } = await supabase
        .from('users')
        .insert([{ 
          firebase_uid: uid,
          phone: phone_number,
          role: 'user',
          name: `User_${phone_number.slice(-4)}`, // Temporary name
          created_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (insertError) {
        console.error('❌ Insert error:', insertError);
        return res.status(500).json({ 
          success: false, 
          message: 'Failed to create user: ' + insertError.message 
        });
      }

      console.log("✅ New user created:", newUser.phone);
      
      return res.status(200).json({ 
        success: true, 
        message: 'User created successfully',
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          phone: newUser.phone,
          role: newUser.role,
          firebase_uid: newUser.firebase_uid
        }
      });
    }

  } catch (error) {
    console.error('❌ Verify phone error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Server error: ' + error.message 
    });
  }
};

// ==========================================
// SEND OTP
// ==========================================
export const sendOTP = async (req, res) => {
  try {
    const { phoneNumber } = req.body;
    
    if (!phoneNumber) {
      return res.status(400).json({ 
        success: false, 
        message: 'Phone number is required' 
      });
    }

    // Check if user exists
    const { data: existingUser, error: searchError } = await supabase
      .from('users')
      .select('*')
      .eq('phone', phoneNumber)
      .maybeSingle();

    if (searchError) {
      console.error('❌ Database search error:', searchError);
    }

    return res.status(200).json({ 
      success: true, 
      exists: !!existingUser,
      message: existingUser ? 'Existing user' : 'New user'
    });

  } catch (error) {
    console.error('❌ Send OTP error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Server error: ' + error.message 
    });
  }
};

// ==========================================
// GET USER PROFILE
// ==========================================
export const getUserProfile = async (req, res) => {
  try {
    const { phone } = req.params;
    
    if (!phone) {
      return res.status(400).json({ 
        success: false, 
        message: 'Phone number is required' 
      });
    }

    const { data: user, error: searchError } = await supabase
      .from('users')
      .select('*')
      .eq('phone', phone)
      .maybeSingle();

    if (searchError) {
      console.error('❌ Database error:', searchError);
      return res.status(500).json({ 
        success: false, 
        message: 'Database error' 
      });
    }

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    return res.status(200).json({ 
      success: true, 
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    });

  } catch (error) {
    console.error('❌ Get profile error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

// ==========================================
// UPDATE USER PROFILE
// ==========================================
export const updateUserProfile = async (req, res) => {
  try {
    const { phone } = req.params;
    const { name, email } = req.body;

    if (!phone) {
      return res.status(400).json({ 
        success: false, 
        message: 'Phone number is required' 
      });
    }

    const { data: updatedUser, error: updateError } = await supabase
      .from('users')
      .update({ 
        name, 
        email,
        updated_at: new Date().toISOString()
      })
      .eq('phone', phone)
      .select()
      .single();

    if (updateError) {
      console.error('❌ Update error:', updateError);
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to update profile' 
      });
    }

    return res.status(200).json({ 
      success: true, 
      message: 'Profile updated successfully',
      user: updatedUser
    });

  } catch (error) {
    console.error('❌ Update profile error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};