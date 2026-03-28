// client/src/pages/OTPVerify.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getAuth, PhoneAuthProvider, signInWithCredential } from 'firebase/auth';
import { verifyPhoneToken } from '../services/auth'; // We'll create this API service

const OTPVerify = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const phoneNumber = location.state?.phone || sessionStorage.getItem('phoneNumber');

  useEffect(() => {
    if (!phoneNumber) {
      navigate('/login');
    }
  }, [phoneNumber, navigate]);

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Get the confirmationResult from session storage
      const confirmationResultRaw = sessionStorage.getItem('confirmationResult');
      if (!confirmationResultRaw) {
        throw new Error('No OTP request found. Please start over.');
      }
      const confirmationResult = JSON.parse(confirmationResultRaw);

      // Sign in with the OTP
      const result = await confirmationResult.confirm(otp);
      // result.user contains Firebase user with phone number and ID token
      const idToken = await result.user.getIdToken();

      // Call backend to verify token and create/update user in Supabase
      const response = await verifyPhoneToken(idToken);
      if (response.success) {
        // Store the token in localStorage (or context) for future requests
        localStorage.setItem('authToken', idToken);
        localStorage.setItem('user', JSON.stringify(response.user));

        // Clean up
        sessionStorage.removeItem('confirmationResult');
        sessionStorage.removeItem('phoneNumber');

        // Redirect to dashboard or home
        navigate('/dashboard');
      } else {
        setError(response.message || 'Authentication failed.');
      }
    } catch (err) {
      console.error(err);
      setError('Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Verify OTP
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter the OTP sent to {phoneNumber}
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleVerifyOTP}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="otp" className="sr-only">
                OTP
              </label>
              <input
                id="otp"
                name="otp"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            </div>
          </div>
          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
          </div>
          {error && <p className="text-red-600 text-sm text-center">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default OTPVerify;