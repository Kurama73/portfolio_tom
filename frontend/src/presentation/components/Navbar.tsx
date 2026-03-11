import React from 'react';
import { useTranslation } from 'react-i18next';
import './Navbar.css';

const Navbar: React.FC = () => {
  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    const nextLang = i18n.language.startsWith('fr') ? 'en' : 'fr';
    i18n.changeLanguage(nextLang);
  };

  return (
    <nav className="navbar">
      <div className="navbar-glass">
        <div className="nav-logo">Tom<span className="dot">.</span></div>
        <div className="nav-links">
          <a href="#home">{t('nav.home')}</a>
          <a href="#parcours">{t('nav.parcours')}</a>
          <a href="#projects">{t('nav.projects')}</a>
          <a href="#passions">{t('nav.passions')}</a>
          <a href="#iut">{t('nav.iut')}</a>
          <a href="#contact" className="nav-contact">{t('nav.contact')}</a>

          <button onClick={toggleLanguage} className="lang-switcher">
            {i18n.language.startsWith('fr') ? 'FR' : 'EN'}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;