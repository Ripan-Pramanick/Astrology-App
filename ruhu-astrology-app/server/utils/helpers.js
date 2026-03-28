// server/utils/helpers.js
/**
 * Sanitize input to prevent injection.
 * @param {string} str - Input string.
 * @returns {string} Sanitized string.
 */
export const sanitize = (str) => {
  if (!str) return '';
  return str.replace(/[^\w\s]/gi, '');
};

/**
 * Convert date string to ISO format.
 * @param {string} date - Date in DD/MM/YYYY format.
 * @returns {string} ISO date.
 */
export const toISODate = (date) => {
  const [day, month, year] = date.split('/');
  return `${year}-${month}-${day}`;
};

/**
 * Calculate age from birth date.
 */
export const calculateAge = (birthDate) => {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
};

/**
 * Format currency.
 */
export const formatCurrency = (amount, currency = 'INR') => {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency }).format(amount / 100);
};