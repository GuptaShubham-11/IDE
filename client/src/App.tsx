import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Authenticate, Dashboard, Home, VerifyEmail } from './pages';
import { Price, PublicRoute, PrivateRoute, Spinner } from './components';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './hooks/redux';
import { checkSession } from './features/authSlice';

function App() {
  const dispatch = useAppDispatch();
  const { isEligibleToVerify, authLoading } = useAppSelector(state => state.auth);

  useEffect(() => {
    dispatch(checkSession());
  }, [dispatch]);

  if (authLoading) return <Spinner size={32} />;

  return (
    <Routes>
      <Route path="/" element={<PublicRoute><Home /></PublicRoute>} />
      <Route path="/price" element={<Price />} />
      <Route path="/authenticate/signup" element={<PublicRoute><Authenticate flag={false} /></PublicRoute>} />
      <Route path="/authenticate/signin" element={<PublicRoute><Authenticate flag={true} /></PublicRoute>} />
      <Route
        path="/authenticate/verify-email/:email"
        element={isEligibleToVerify ? <VerifyEmail /> : <Navigate to="/" replace />}
      />
      <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
    </Routes>
  );
}

export default App;
