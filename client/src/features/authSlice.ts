import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppDispatch } from '../store/store';
import apiClient from '@/api/apiClient';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isEligibleToVerify: boolean;
  authLoading: boolean;
  gender: string;
}

const initialState: AuthState = {
  user: null,
  gender: localStorage.getItem('gender') || 'female',
  isAuthenticated: false,
  isEligibleToVerify: false,
  authLoading: true,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthLoading: (state, action: PayloadAction<boolean>) => {
      state.authLoading = action.payload;
    },
    eligibleToVerify: (state) => {
      state.isEligibleToVerify = true;
    },
    signIn: (state, action: PayloadAction<{ user: User }>) => {
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.isEligibleToVerify = false;
      state.authLoading = false;
    },
    signOutSuccess: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isEligibleToVerify = false;
      state.authLoading = false;
    },
  },
});

export const signOut = () => async (dispatch: AppDispatch) => {
  try {
    await apiClient.post('/users/sign-out');
  } catch (error) {
    console.error('Logout failed:', error);
  } finally {
    dispatch(signOutSuccess());
  }
};

export const checkSession = () => async (dispatch: AppDispatch) => {
  try {
    const response = await apiClient.get('/users/current-user');
    dispatch(signIn({ user: response.data.data.user }));
  } catch {
    dispatch(signOutSuccess());
  }
};

export const { signIn, signOutSuccess, eligibleToVerify, setAuthLoading } =
  authSlice.actions;
export default authSlice.reducer;
