import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Price, PublicRoute, ProtectedRoute } from './components';
import { Authenticate, Dashboard, Home, VerifyEmail } from './pages';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from './store/store';
import { userApi } from './api/userApi';
import { useEffect } from 'react';
import { signIn } from './features/authSlice';

function App() {
  const isEligibleToVerify = useSelector((state: RootState) => state.auth.isEligibleToVerify);
  const dispatch = useDispatch();

  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const response = await userApi.getCurrentUser();
        console.log(response);

        dispatch(signIn({ user: response.data.user }));
      } catch (error: any) {
        console.log(error.message);
      }
    }

    getCurrentUser();
  }, []);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <PublicRoute>
              <Home />
            </PublicRoute>
          }
        />

        <Route path="/price" element={<Price />} />

        <Route
          path="/authenticate/signup"
          element={
            <PublicRoute>
              <Authenticate flag={false} />
            </PublicRoute>
          }
        />

        <Route
          path="/authenticate/signin"
          element={
            <PublicRoute>
              <Authenticate flag={true} />
            </PublicRoute>
          }
        />

        <Route
          path="/authenticate/verify-email/:email"
          element={isEligibleToVerify ? <VerifyEmail /> : <Navigate to="/" />}
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;