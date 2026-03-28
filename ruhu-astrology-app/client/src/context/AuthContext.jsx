// client/src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import { auth } from '../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Listen to Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Get ID token
        const idToken = await firebaseUser.getIdToken();
        localStorage.setItem('authToken', idToken);

        // Verify token with backend and get user details
        try {
          const response = await api.post('/auth/verify-phone', { idToken });
          if (response.data.success) {
            setUser(response.data.user);
            localStorage.setItem('user', JSON.stringify(response.data.user));
          } else {
            throw new Error('Backend verification failed');
          }
        } catch (error) {
          console.error('Error syncing user with backend:', error);
          // Still set basic user from Firebase
          setUser({
            uid: firebaseUser.uid,
            phone: firebaseUser.phoneNumber,
            name: firebaseUser.displayName,
            email: firebaseUser.email,
          });
        }
      } else {
        // No user
        setUser(null);
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const value = {
    user,
    loading,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};