import React from 'react';
import './Navbar.css';

const Navbar: React.FC = () => {
  return (
    <nav className="navbar">
      <div className="navbar-glass">
        <div className="nav-logo">Tom<span className="dot">.</span></div>
        <div className="nav-links">
          <a href="#home">Accueil</a>
          <a href="#parcours">Parcours</a>
          <a href="#projects">Projets</a>
          <a href="#passions">Passions</a>
          <a href="#iut">IUT</a>
          <a href="#contact" className="nav-contact">Contact</a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;