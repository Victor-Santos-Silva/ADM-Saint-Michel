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
      <button className="submit-btn" onClick={logout}>Sair</button>
    </header >
  );
}
