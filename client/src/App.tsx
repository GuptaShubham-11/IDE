import './App.css';
import Header from './components/Header';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Price } from './components';

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Header />} />
          <Route path="/price" element={<Price />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
