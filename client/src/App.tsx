import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Price } from './components';
import { Authenticate, Dashboard, Home, VerifyEmail } from './pages';
import { useSelector } from 'react-redux';
import { RootState } from './store/store';


function App() {
  const isEligibleToVerify = useSelector((state: RootState) => state.auth.isEligibleToVerify);
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={isAuthenticated ? <Navigate to='/dashboard' /> : <Home />} />
          <Route path="/price" element={<Price />} />
          <Route path="/authenticate/signup" element={isAuthenticated ? <Navigate to='/dashboard' /> : <Authenticate flag={false} />} />
          <Route path="/authenticate/signin" element={isAuthenticated ? <Navigate to='/dashboard' /> : <Authenticate flag={true} />} />
          <Route path="/authenticate/verify-email/:email" element={isEligibleToVerify && <VerifyEmail />} />
          <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to='/' />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
