import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './header.css';

export default function Header() {

  const { logout } = useAuth();

  return (
    <header className="headerAdm">
      <div className="logoHeader">
        <Link to='/homeAdm'><img className="imgHeader" src="../../src/assets/Img/Logo.png" /></Link>
      </div>

      <nav className="navbar">
        <div>
          <Link to='/verMedicos' className='links'>Visualizar médicos</Link>
        </div>
        <div>
          <Link to='/cadastro' className='links'>Cadastrar médicos</Link>
        </div>
        <div>
          <Link to='/duvidas' className='links'>Cadastrar médicos</Link>
        </div>
      </nav>

      <button className="submit-btn" onClick={logout}>Sair</button>
    </header >
  );
}
