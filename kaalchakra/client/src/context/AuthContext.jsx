// client/src/context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api'; 

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // অ্যাপ লোড হওয়ার সময় লোকাল স্টোরেজ থেকে ইউজার ডেটা নেওয়া
  useEffect(() => {
    const initializeAuth = async () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          
          // অপশনাল: সার্ভার থেকে লেটেস্ট স্ট্যাটাস চেক করা
          // if (parsedUser) refreshPremiumStatus(parsedUser);
        } catch (error) {
          console.error("Auth initialization error:", error);
          localStorage.removeItem('user');
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  // লগআউট ফাংশন
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('authToken'); // যদি টোকেন আলাদা থাকে
    // সেশন স্টোরেজ ক্লিয়ার করা (যদি মোডাল ক্লিয়ার করতে চান)
    sessionStorage.removeItem('kundliModalSeen');
  };

  // ইউজার স্টেট এবং লোকাল স্টোরেজ আপডেট করার মেইন ফাংশন
  const loginUser = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  // ইউজারের আংশিক ডেটা আপডেট (যেমন: প্রিমিয়াম স্ট্যাটাস)
  const updateUser = (updatedFields) => {
    setUser(prevUser => {
      const merged = { ...prevUser, ...updatedFields };
      localStorage.setItem('user', JSON.stringify(merged));
      return merged;
    });
  };

  // সার্ভার থেকে প্রিমিয়াম স্ট্যাটাস রিফ্রেশ করা
  const refreshPremiumStatus = async (currentUser = user) => {
    if (!currentUser) return;
    try {
      const identifier = currentUser.email || currentUser.phone;
      if (!identifier) return;
      
      const response = await api.get(`/user/${encodeURIComponent(identifier)}/status`);
      const data = response.data;
      
      if (data.success && data.user) {
        updateUser({
          is_premium: data.isPremium || data.user.is_premium,
          subscription: data.user.subscription
        });
      }
    } catch (err) {
      console.error('Failed to refresh premium status:', err);
    }
  };

  const value = {
    user,
    setUser: loginUser, // setUser কল করলে এখন অটোমেটিক লোকাল স্টোরেজেও সেভ হবে
    loading,
    logout,
    updateUser,
    refreshPremiumStatus,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};