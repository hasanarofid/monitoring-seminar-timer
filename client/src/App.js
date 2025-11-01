import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Monitoring from './pages/Monitoring';
import './App.css';

function AppContent() {
  const location = useLocation();
  const isMonitoring = location.pathname === '/monitoring';

  return (
    <div className="App">
      {!isMonitoring && <Navbar />}
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/monitoring" element={<Monitoring />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;

