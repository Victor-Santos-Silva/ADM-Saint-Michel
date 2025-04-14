import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaBell, FaCircle } from 'react-icons/fa';
import axios from 'axios';
import './header.css';

export default function Header() {
  const { logout, user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/notificacoes/${user.id}`);
      setNotifications(response.data);
      setUnreadCount(response.data.filter(n => !n.lida).length);
    } catch (error) {
      console.error("Erro ao buscar notificações:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleNotifications = async () => {
    if (!showNotifications) {
      await fetchNotifications();
    }
    setShowNotifications(!showNotifications);
  };

  const markAsRead = async (id) => {
    try {
      await axios.patch(`http://localhost:5000/notificacoes/${id}/marcar-como-lida`);
      setNotifications(notifications.map(n => 
        n.id === id ? { ...n, lida: true } : n
      ));
      setUnreadCount(prev => prev - 1);
    } catch (error) {
      console.error("Erro ao marcar como lida:", error);
    }
  };

  return (
    <header className="headerAdm">
      <div className="logoHeader">
        <Link to='/homeAdm'><img className="imgHeader" src="../../src/assets/Img/Logo.png" alt="Logo" /></Link>
      </div>

      <nav className="navbar">
        <div>
          <Link to='/verMedicos' className='links'>Visualizar médicos</Link>
        </div>
        <div>
          <Link to='/cadastro' className='links'>Cadastrar médicos</Link>
        </div>
        <div>
          <Link to='/duvidas' className='links'>Dúvidas</Link>
        </div>
      </nav>

      <div className="right-section">
        <div className="notification-container">
          <button className="notification-icon" onClick={toggleNotifications}>
            <FaBell size={20} />
            {unreadCount > 0 && (
              <span className="notification-badge">
                <FaCircle size={10} color="#ff4d4d" />
              </span>
            )}
          </button>
          
          {showNotifications && (
            <div className="notification-dropdown">
              {loading ? (
                <div className="notification-loading">Carregando...</div>
              ) : notifications.length === 0 ? (
                <div className="notification-empty">Nenhuma notificação</div>
              ) : (
                <>
                  <div className="notification-header">
                    <h4>Notificações</h4>
                    <button 
                      className="mark-all-read"
                      onClick={() => {
                        notifications.forEach(n => !n.lida && markAsRead(n.id));
                      }}
                    >
                      Marcar todas como lidas
                    </button>
                  </div>
                  <div className="notification-list">
                    {notifications.map(notification => (
                      <div 
                        key={notification.id} 
                        className={`notification-item ${!notification.lida ? 'unread' : ''}`}
                        onClick={() => !notification.lida && markAsRead(notification.id)}
                      >
                        <p>{notification.mensagem}</p>
                        <small>{new Date(notification.data).toLocaleString()}</small>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        <button className="submit-btn" onClick={logout}>Sair</button>
      </div>
    </header>
  );
}