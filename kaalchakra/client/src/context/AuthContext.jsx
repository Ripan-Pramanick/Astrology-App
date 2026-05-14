import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api'; // ✅ API import করা হলো

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
  };

  // Update user in state + localStorage
  const updateUser = (updatedUser) => {
    const merged = { ...user, ...updatedUser };
    setUser(merged);
    localStorage.setItem('user', JSON.stringify(merged));
  };

  // Refresh premium status from server
  const refreshPremiumStatus = async () => {
    if (!user) return;
    try {
      const identifier = user.email || user.phone;
      if (!identifier) return;
      
      // ✅ Fetch এর বদলে সরাসরি Render-এ কল করা হচ্ছে
      const response = await api.get(`/user/${encodeURIComponent(identifier)}/status`);
      const data = response.data;
      
      if (data.success && data.user) {
        updateUser({
          is_premium: data.isPremium,
          subscription: data.user.subscription
        });
      }
    } catch (err) {
      console.error('Failed to refresh premium status:', err);
    }
  };

  const value = {
    user,
    setUser,
    loading,
    logout,
    updateUser,
    refreshPremiumStatus,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};