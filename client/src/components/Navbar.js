import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <img src="/brigthon.jpeg" alt="Logo" />
          <span>Monitoring Seminar</span>
        </div>
        <div className="navbar-menu">
          <Link 
            to="/" 
            className={`navbar-link ${location.pathname === '/' ? 'active' : ''}`}
          >
            Dashboard
          </Link>
          <Link 
            to="/monitoring" 
            className={`navbar-link ${location.pathname === '/monitoring' ? 'active' : ''}`}
          >
            Layar Monitoring
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

