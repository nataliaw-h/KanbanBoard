import React from 'react';
import { useTranslation } from 'react-i18next';
import './styles/Footer.css';

const Footer: React.FC = () => {
  const { t, i18n } = useTranslation();

  const handleLanguageChange = (language: string) => {
    i18n.changeLanguage(language);
  };

  return (
    <footer className="footer">
      <p>© 2023 KanBoard. {t('footer.allRightsReserved')}</p>
      <div className="language-switcher">
        <button onClick={() => handleLanguageChange('en')}>{t('footer.english')}</button>
        <button onClick={() => handleLanguageChange('pl')}>{t('footer.polish')}</button>
      </div>
    </footer>
  );
};

export default Footer;
