// Helper functions for authentication

// Validate email format
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate password strength
export const isStrongPassword = (password) => {
  // Password must be at least 8 characters with at least 1 letter and 1 number
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  return passwordRegex.test(password);
};

// Check if user is authenticated
export const isAuthenticated = () => {
  try {
    return localStorage.getItem('user') !== null;
  } catch (error) {
    return false;
  }
};