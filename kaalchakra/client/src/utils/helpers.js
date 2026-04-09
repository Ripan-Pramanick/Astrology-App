// client/src/utils/helpers.js
/**
 * Format a date to DD/MM/YYYY.
 */
export const formatDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
};

/**
 * Format a time to HH:MM AM/PM.
 */
export const formatTime = (timeString) => {
  // Assume input like "HH:MM AM/PM"
  if (!timeString) return '';
  return timeString;
};

/**
 * Validate phone number (basic).
 */
export const validatePhone = (phone) => {
  const phoneRegex = /^\+?[1-9]\d{1,14}$/;
  return phoneRegex.test(phone);
};

/**
 * Validate email (basic).
 */
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Truncate string to max length.
 */
export const truncate = (str, maxLength = 100) => {
  if (!str) return '';
  return str.length > maxLength ? str.slice(0, maxLength) + '...' : str;
};

/**
 * Capitalize first letter of each word.
 */
export const capitalizeWords = (str) => {
  return str.replace(/\b\w/g, (l) => l.toUpperCase());
};