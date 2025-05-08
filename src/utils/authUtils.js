// Helper functions for authentication

// Validate email format
export const isValidEmail = (email) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

// Validate password strength
export const isStrongPassword = (password) => {
  // Password must be at least 8 characters with at least 1 letter and 1 number
  return getPasswordStrength(password).score >= 2;
};

// Calculate password strength
export const getPasswordStrength = (password) => {
  if (!password) {
    return { score: 0, feedback: 'Password is required' };
  }

  let score = 0;
  const feedback = [];

  // Length check
  if (password.length < 8) {
    feedback.push('Password should be at least 8 characters');
  } else {
    score += 1;
  }

  // Contains letters check
  if (!/[a-zA-Z]/.test(password)) {
    feedback.push('Include at least one letter');
  } else {
    score += 1;
  }

  // Contains numbers check
  if (!/\d/.test(password)) {
    feedback.push('Include at least one number');
  } else {
    score += 1;
  }

  // Contains special characters check
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    feedback.push('Include at least one special character');
  } else {
    score += 1;
  }

  // Mixed case check
  if (!/[a-z]/.test(password) || !/[A-Z]/.test(password)) {
    feedback.push('Include both uppercase and lowercase letters');
  } else {
    score += 1;
  }

  // Get final score (0-4)
  score = Math.max(0, Math.min(4, score));

  // Generate feedback message
  let strengthText = '';
  if (score === 0) strengthText = 'Very Weak';
  else if (score === 1) strengthText = 'Weak';
  else if (score === 2) strengthText = 'Fair';
  else if (score === 3) strengthText = 'Good';
  else strengthText = 'Strong';

  return {
    score,
    strengthText,
    feedback: feedback.length > 0 ? feedback : ['Password is strong']
  };
};

// Check if user is authenticated
export const isAuthenticated = () => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    return user !== null && user.token;
  } catch (error) {
    return false;
  }
};

// Generate verification token
export const generateVerificationToken = () => {
  // In a real app, this would generate a secure token
  // For this demo, we'll create a simple random string
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};