import React from 'react';
import { Link } from 'react-router-dom';
import './header.css';

export default function Header({ isLoggedIn, username, logout }) {
  return (
    <header className="headerAdm">
      <div className="logoHeader">
        <img className="imgHeader" src="../src/Img/Logo.png" />
      </div>

      <nav className="navbar">
        <div>
          <Link to='/cadastro' className='links'>Cadastrar médicos</Link>
        </div>
        <div>
          <Link to='/verMedicos' className='links'>Visualizar médicos</Link>
        </div>
      </nav>

        <button className="submit-btn">Sair</button>
     
    </header >
  );
}
