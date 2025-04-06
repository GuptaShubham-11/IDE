import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Price } from './components';
import { Authenticate, Home } from './pages';


function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/price" element={<Price />} />
          <Route path="/authenticate/signup" element={<Authenticate flag={false} />} />
          <Route path="/authenticate/signin" element={<Authenticate flag={true} />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
