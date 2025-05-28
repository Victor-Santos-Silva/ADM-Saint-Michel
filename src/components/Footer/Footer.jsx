import React from 'react';
import { FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";
import { useTheme } from '../../context/ThemeContext';
import './footer.css';
import logoDark from '../../assets/Img/footerLogoAdm.png';
import logoLight from '../../assets/Img/FooterLogoAdmLight.png';

export default function Footer() {
    const { darkMode } = useTheme();

    return (
        <footer className={`footer-container ${darkMode ? 'dark-theme' : 'light-theme'}`}>
            <div className='footer-content'>
                <div className='logo-wrapper'>
                    <img
                        src={darkMode ? logoDark : logoLight}
                        className={`footer-logo ${darkMode ? 'dark-logo' : 'light-logo'}`}
                        alt="Hospital Logo"
                    />
                </div>
                <p className='footer-text'>© 2025 Direitos reservados Hospital Saint-Michel by PNTEC-LTD</p>
                <div className="partnership">
                    <span>Parcerias:</span> <strong>Libbs</strong>
                </div>
                <div className="social-icons">
                    <a href="https://www.linkedin.com/in/saint-michael-hospital-47ab05359/" target='_blank'><FaLinkedin className="social-icon" /></a>
                    <a href="https://www.instagram.com/hospital.saintmichel/" target='_blank'><FaInstagram className="social-icon" /></a>
                </div>
            </div>
        </footer>
    );
}