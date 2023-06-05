import React from 'react';
import { Link } from 'react-router-dom';
import './styles/Header.css';
import logoImage from './logo.png';

const Header = ({ isLoggedIn, email, onLogout }) => {
  return (
    <header>
      <nav>
        <div className="left-section">
          <Link to="/"><img src={logoImage} alt="Logo" className="logo" /></Link>
          <Link to="/projects">Projects</Link>
          <Link to="/calendar">Calendar</Link>
          <Link to="/notifications">Notifications</Link>
        </div>
        <div className="right-section">
          {isLoggedIn ? (
            <>
              <span className="username">Welcome, {email}</span>
              <button className="logout-button" onClick={onLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Sign In</Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;