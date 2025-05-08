import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { logout } from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import { isValidEmail } from '../utils/authUtils';

const ProfilePage = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [formErrors, setFormErrors] = useState({});

  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!isValidEmail(formData.email)) {
      errors.email = 'Please enter a valid email';
    }
    
    if (formData.newPassword) {
      if (!formData.currentPassword) {
        errors.currentPassword = 'Current password is required to set a new password';
      }
      
      if (formData.newPassword.length < 8) {
        errors.newPassword = 'Password must be at least 8 characters';
      }
      
      if (formData.newPassword !== formData.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
      }
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

  const handleEditToggle = () => {
    if (isEditing) {
      // Cancel editing, reset form
      setFormData({
        name: user?.name || '',
        email: user?.email || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setFormErrors({});
    }
    setIsEditing(!isEditing);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // In a real app, you would dispatch an update profile action here
      // For this demo, just show a success toast
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    toast.info('You have been logged out');
    navigate('/login');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto px-4 py-8"
    >
      <div className="max-w-2xl mx-auto card p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">My Profile</h1>
          <div className="space-x-2">
            <button
              type="button"
              onClick={handleEditToggle}
              className={isEditing ? "btn border border-surface-300 dark:border-surface-600" : "btn-outline"}
            >
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
            {isEditing ? (
              <button
                type="button"
                onClick={handleSubmit}
                className="btn-primary"
              >
                Save Changes
              </button>
            ) : (
              <button
                type="button"
                onClick={handleLogout}
                className="btn bg-red-500 hover:bg-red-600 text-white"
              >
                Sign Out
              </button>
            )}
          </div>
        </div>
        
        <div className="mb-6 rounded-lg bg-surface-100 dark:bg-surface-700 p-4">
          <h2 className="text-lg font-semibold mb-2">Account Information</h2>
          {!isEditing ? (
            <div>
              <p><span className="font-medium">Name:</span> {user?.name}</p>
              <p className="mt-2"><span className="font-medium">Email:</span> {user?.email}</p>
            </div>
          ) : (
            <form>
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="input-field"
                  value={formData.name}
                  onChange={handleChange}
                />
                {formErrors.name && <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>}
              </div>
              
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="input-field"
                  value={formData.email}
                  onChange={handleChange}
                />
                {formErrors.email && <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>}
              </div>
            </form>
          )}
        </div>
        
        {isEditing && (
          <div className="rounded-lg bg-surface-100 dark:bg-surface-700 p-4">
            <h2 className="text-lg font-semibold mb-2">Change Password</h2>
            <form>
              <div className="mb-4">
                <label htmlFor="currentPassword" className="block text-sm font-medium mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  id="currentPassword"
                  name="currentPassword"
                  className="input-field"
                  value={formData.currentPassword}
                  onChange={handleChange}
                />
                {formErrors.currentPassword && <p className="text-red-500 text-sm mt-1">{formErrors.currentPassword}</p>}
              </div>
              
              <div className="mb-4">
                <label htmlFor="newPassword" className="block text-sm font-medium mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  className="input-field"
                  value={formData.newPassword}
                  onChange={handleChange}
                />
                {formErrors.newPassword && <p className="text-red-500 text-sm mt-1">{formErrors.newPassword}</p>}
              </div>
              
              <div className="mb-4">
                <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  className="input-field"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
                {formErrors.confirmPassword && <p className="text-red-500 text-sm mt-1">{formErrors.confirmPassword}</p>}
              </div>
            </form>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ProfilePage;