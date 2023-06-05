import React from 'react';
import { useTranslation } from 'react-i18next';
import './styles/Footer.css';

const Footer: React.FC = () => {
  const { i18n } = useTranslation();

  const handleLanguageChange = (language: string) => {
    i18n.changeLanguage(language);
  };

  return (
    <footer className="footer">
      <p>© 2023 KanBoard. All rights reserved.</p>
      <div className="language-switcher">
        <button onClick={() => handleLanguageChange('en')}>English</button>
        <button onClick={() => handleLanguageChange('pl')}>Polish</button>
      </div>
    </footer>
  );
};

export default Footer;
