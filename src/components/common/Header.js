import React from 'react';
import { Link } from 'react-router-dom';
import './styles/Header.css';
import logoImage from './logo.png';
import { withTranslation } from 'react-i18next';

const Header = ({ isLoggedIn, email, onLogout, t }) => {
  return (
    <header>
      <nav>
        <div className="left-section">
          <Link to="/"><img src={logoImage} alt="Logo" className="logo" /></Link>
          <Link to="/projects">{t('header.projects')}</Link>
          <Link to="/calendar">{t('header.calendar')}</Link>
          <Link to="/notifications">{t('header.notifications')}</Link>
        </div>
        <div className="right-section">
          {isLoggedIn ? (
            <>
              <span className="username">{t('header.welcome')}, {email}</span>
              <button className="logout-button" onClick={onLogout}>
                {t('header.logout')}
              </button>
            </>
          ) : (
            <>
              <Link to="/login">{t('header.login')}</Link>
              <Link to="/register">{t('header.signIn')}</Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default withTranslation()(Header);
