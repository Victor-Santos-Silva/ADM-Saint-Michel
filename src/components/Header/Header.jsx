import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { FaBell, FaCircle } from 'react-icons/fa';
import axios from 'axios';
import './header.css';

import logoLight from '../../assets/Img/LogoLight.png';
import logoDark from '../../assets/Img/Logo.png';

export default function Header() {  
  const { logout, id } = useAuth();
  console.log("ID vindo do AuthContext:", id, typeof id);
  const { isDarkMode } = useTheme();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = async () => {
    const user_id = id;
    console.log("user_id:", user_id);
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/notificacoes/notificacoes/${id}`);
      const data = Array.isArray(response.data) ? response.data : response.data.notificacoes || [];
      setNotifications(data);
      setUnreadCount(data.filter(n => !n.lida).length);
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

  const markAsRead = async (notificationId) => {
    try {
      await axios.patch(`http://localhost:5000/notificacoes/notificacoes/${notificationId}/marcar-como-lida`, { lida: true });
      const updated = notifications.map(n =>
        n.id === notificationId ? { ...n, lida: true } : n
      );
      setNotifications(updated);
      setUnreadCount(updated.filter(n => !n.lida).length);
    } catch (error) {
      console.error("Erro ao marcar como lida:", error);
    }
  };

  return (
    <header className={`headerAdm ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
      <div className="logoHeader">
        <Link to='/homeAdm'>
          <img
            className="imgHeader"
            src={isDarkMode ? logoDark : logoLight}
            alt="Logo"
          />
        </Link>
      </div>

      <nav className="navbar">
        <Link to='/verMedicos' className='links'>Visualizar médicos</Link>
        <Link to='/cadastro' className='links'>Cadastrar médicos</Link>
        <Link to='/duvidas' className='links'>Ver Dúvidas</Link>
      </nav>

      <div className="right-section">
        <div className="notification-container">
          <button className="notification-icon" onClick={toggleNotifications}>
            <FaBell size={20} color={isDarkMode ? '#ffffff' : '#333333'} />
            {unreadCount > 0 && (
              <span className="notification-badge">
                <FaCircle size={10} color="#ff4d4d" />
              </span>
            )}
          </button>

          {showNotifications && (
            <div className={`notification-dropdown ${isDarkMode ? 'dark' : 'light'}`}>
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
                        notifications.forEach(n => {
                          if (!n.lida) markAsRead(n.id);
                        });
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
                        <p>{notification.message}</p>
                        <small>{new Date(notification.createdAt).toLocaleString()}</small>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        <button className={`submit-btn ${isDarkMode ? 'dark' : 'light'}`} onClick={logout}>
          Sair
        </button>
      </div>
    </header>
  );
}
