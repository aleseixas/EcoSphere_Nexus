import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'; // Importa o CSS

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Função para alternar o estado do menu hambúrguer
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Botão de Menu Hambúrguer */}
        <div className={`hamburger ${isOpen ? 'open' : ''}`} onClick={toggleMenu}>
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </div>

        {/* Links de Navegação */}
        <ul className={`nav-list ${isOpen ? 'open' : ''}`}>
          <li className="nav-item">
            <Link to="/world-simulation" className="nav-link" onClick={toggleMenu}>World Simulation</Link>
          </li>
          <li className="nav-item">
            <Link to="/informations" className="nav-link" onClick={toggleMenu}>Informations</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
