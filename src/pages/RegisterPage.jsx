import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { register, verifyEmail } from '../features/auth/authSlice';
import { isValidEmail, isStrongPassword } from '../utils/authUtils';
import PasswordStrengthMeter from '../components/PasswordStrengthMeter';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });
  const [formErrors, setFormErrors] = useState({});
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { 
    registrationStatus, 
    error, 
    user, 
    verificationStatus,
    verificationSent: stateVerificationSent 
  } = useSelector((state) => state.auth);

  useEffect(() => {
    setVerificationSent(stateVerificationSent);
  }, [stateVerificationSent]);

  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Full name is required';
    }
    
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!isValidEmail(formData.email)) {
      errors.email = 'Please enter a valid email';
    }
    
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (!isStrongPassword(formData.password)) {
      errors.password = 'Password must be at least 8 characters with letters and numbers';
    }
    
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.agreeToTerms) {
      errors.agreeToTerms = 'You must agree to the Terms and Conditions';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      [name]: checked
    });
  };

  const handleVerificationCodeChange = (e) => {
    setVerificationCode(e.target.value);
  };

  const handleVerifyEmail = async (e) => {
    e.preventDefault();
    
    if (!verificationCode.trim()) {
      toast.error('Please enter the verification code');
      return;
    }
    
    try {
      const resultAction = await dispatch(verifyEmail(verificationCode));
      if (verifyEmail.fulfilled.match(resultAction)) {
        toast.success('Email verified successfully!');
        setTimeout(() => {
          navigate('/');
        }, 1500);
      } else {
        toast.error(resultAction.payload || 'Verification failed. Please try again.');
      }
    } catch (err) {
      toast.error('An error occurred during verification. Please try again.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Remove confirmPassword and create userData
      const { confirmPassword, ...userData } = formData;
      
      try {
        const resultAction = await dispatch(register(userData));
        if (register.fulfilled.match(resultAction)) {
          toast.success('Account created! Please verify your email to continue.');
          setIsVerifying(true);
          
          // In a real app, this is where an email would be sent
          // For this demo, we'll simulate by showing the verification form
          setTimeout(() => {
            toast.info('A verification code has been sent to your email.');
          }, 1000);
        } else {
          toast.error(resultAction.error?.message || 'Registration failed. Please try again.');
        }
      } catch (err) {
        toast.error('An error occurred. Please try again.');
      }
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="container mx-auto px-4 py-12 max-w-screen-lg"
    >
      <AnimatePresence mode="wait">
        {isVerifying ? (
          <motion.div
            key="verification"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="max-w-md mx-auto"
          >
            <div className="card p-6">
              <div className="text-center mb-6">
                <h1 className="text-2xl font-bold">Verify Your Email</h1>
                <p className="text-surface-600 dark:text-surface-400 mt-2">
                  We've sent a verification code to <strong>{formData.email}</strong>
                </p>
              </div>
              
              {error && (
                <div className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 p-3 rounded-lg mb-4">
                  {error}
                </div>
              )}
              
              <form onSubmit={handleVerifyEmail}>
                <div className="mb-4">
                  <label htmlFor="verificationCode" className="block text-sm font-medium mb-1">
                    Verification Code
                  </label>
                  <input
                    type="text"
                    id="verificationCode"
                    className="input-field text-center tracking-wide text-lg"
                    placeholder="Enter code"
                    value={verificationCode}
                    onChange={handleVerificationCodeChange}
                    autoComplete="off"
                  />
                </div>
                
                <button
                  type="submit"
                  className="btn-primary w-full mt-2"
                  disabled={verificationStatus === 'loading'}
                >
                  {verificationStatus === 'loading' ? 'Verifying...' : 'Verify Email'}
                </button>
                
                <div className="mt-4 text-center text-sm text-surface-600 dark:text-surface-400">
                  <p>Didn't receive the code?</p>
                  <button
                    type="button"
                    className="text-primary dark:text-primary-light hover:underline mt-1"
                    onClick={() => {
                      toast.info('Verification code resent to your email.');
                    }}
                  >
                    Resend Code
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="registration"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="max-w-md mx-auto"
          >
            <div className="card p-6">
              <h1 className="text-2xl font-bold mb-6 text-center">Create an Account</h1>
              
              {error && (
                <div className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 p-3 rounded-lg mb-4">
                  {error}
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="name" className="block text-sm font-medium mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className={`input-field ${formErrors.name ? 'border-red-500 dark:border-red-400' : ''}`}
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    autoComplete="name"
                  />
                  {formErrors.name && <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>}
                </div>
                
                <div className="mb-4">
                  <label htmlFor="email" className="block text-sm font-medium mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className={`input-field ${formErrors.email ? 'border-red-500 dark:border-red-400' : ''}`}
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    autoComplete="email"
                  />
                  {formErrors.email && <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>}
                </div>
                
                <div className="mb-4">
                  <label htmlFor="password" className="block text-sm font-medium mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    className={`input-field ${formErrors.password ? 'border-red-500 dark:border-red-400' : ''}`}
                    value={formData.password}
                    onChange={handleChange}
                    autoComplete="new-password"
                  />
                  <PasswordStrengthMeter password={formData.password} />
                  {formErrors.password && <p className="text-red-500 text-xs mt-1">{formErrors.password}</p>}
                </div>
                
                <div className="mb-5">
                  <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    className={`input-field ${formErrors.confirmPassword ? 'border-red-500 dark:border-red-400' : ''}`}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    autoComplete="new-password"
                  />
                  {formErrors.confirmPassword && <p className="text-red-500 text-xs mt-1">{formErrors.confirmPassword}</p>}
                </div>
                
                <div className="mb-6">
                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      id="agreeToTerms"
                      name="agreeToTerms"
                      checked={formData.agreeToTerms}
                      onChange={handleCheckboxChange}
                      className="mt-1 h-4 w-4 rounded border-surface-300 text-primary focus:ring-primary"
                    />
                    <label htmlFor="agreeToTerms" className="ml-2 text-sm text-surface-600 dark:text-surface-400">
                      I agree to the <a href="#" className="text-primary dark:text-primary-light hover:underline">Terms of Service</a> and <a href="#" className="text-primary dark:text-primary-light hover:underline">Privacy Policy</a>
                    </label>
                  </div>
                  {formErrors.agreeToTerms && <p className="text-red-500 text-xs mt-1">{formErrors.agreeToTerms}</p>}
                </div>
                
                <button
                  type="submit"
                  className="btn-primary w-full"
                  disabled={registrationStatus === 'loading'}
                >
                  {registrationStatus === 'loading' ? 'Creating Account...' : 'Create Account'}
                </button>
              </form>
              
              <div className="mt-4 text-center">
                <p className="text-surface-600 dark:text-surface-400">
                  Already have an account?{' '}
                  <Link to="/login" className="text-primary dark:text-primary-light hover:underline">
                    Sign In
                  </Link>
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
};

export default RegisterPage;