import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { generateVerificationToken } from '../../utils/authUtils';

// Simulated API calls - in a real app, these would call your backend
const loginUser = async (credentials) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock validation - in production, this would be a real API call
  if (credentials.email === 'user@example.com' && credentials.password === 'password123') {
    return { 
      id: '1',
      name: 'John Doe',
      email: 'user@example.com',
      token: 'mock-jwt-token'
    };
  }
  
  throw new Error('Invalid credentials');
};

const registerUser = async (userData) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Simulate checking if email already exists
  if (userData.email === 'user@example.com') {
    throw new Error('Email already in use');
  }
  
  // Create verification token (in a real app, this would be a unique token)
  const verificationToken = generateVerificationToken();
  
  // In a real app, this would create a new user in your database
  // and send a verification email
  return {
    id: Math.random().toString(36).substr(2, 9),
    name: userData.name,
    email: userData.email,
    verified: false,
    verificationToken,
    createdAt: new Date().toISOString()
  };
};

const verifyUserEmail = async (token) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Get stored user
  const storedUser = JSON.parse(localStorage.getItem('user'));
  
  // In a real app, this would verify the token against the database
  if (storedUser && storedUser.verificationToken === token) {
    return { ...storedUser, verified: true };
  }
  
  throw new Error('Invalid verification token');
};

// Async thunks
export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const user = await loginUser(credentials);
      localStorage.setItem('user', JSON.stringify(user));
      return user;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const user = await registerUser(userData);
      localStorage.setItem('user', JSON.stringify(user));
      return user;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const verifyEmail = createAsyncThunk(
  'auth/verifyEmail',
  async (token, { rejectWithValue }) => {
    try {
      const verifiedUser = await verifyUserEmail(token);
      
      // Update stored user info
      localStorage.setItem('user', JSON.stringify(verifiedUser));
      
      return verifiedUser;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  user: JSON.parse(localStorage.getItem('user')) || null,
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  registrationStatus: 'idle', // separate status for registration
  verificationStatus: 'idle', // status for email verification
  registrationData: null, // store registration data temporarily
  verificationSent: false, // track if verification email was sent
  error: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem('user');
      state.user = null;
      state.status = 'idle';
      state.error = null;
      state.registrationStatus = 'idle';
      state.verificationStatus = 'idle';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(register.pending, (state) => {
        state.registrationStatus = 'loading';
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.registrationStatus = 'succeeded';
        state.verificationSent = true;
        state.user = action.payload;
        state.registrationData = action.payload;
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.registrationStatus = 'failed';
        state.error = action.payload;
      })
      .addCase(verifyEmail.pending, (state) => {
        state.verificationStatus = 'loading';
        state.error = null;
      })
      .addCase(verifyEmail.fulfilled, (state, action) => {
        state.verificationStatus = 'succeeded';
        state.user = action.payload;
        state.error = null;
        // Update the stored user with verification status
        if (state.user) {
          state.user.verified = true;
        }
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        state.verificationStatus = 'failed';
        state.error = action.payload;
      });
  }
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;