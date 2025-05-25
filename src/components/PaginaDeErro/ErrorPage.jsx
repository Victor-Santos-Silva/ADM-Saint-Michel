import React from 'react';
import { useNavigate } from 'react-router-dom';
import './error.css'

export default function ErrorPage() {
    const navigate = useNavigate();

    return (
        <div className="error-page-container">
            <div className="error-box">
                <div className="error-icon">⚠️</div>
                <h1 className="error-code">404</h1>
                <h2 className="error-message">Página não encontrada</h2>
                <p className="error-description">
                    Opa! Parece que a página que você está procurando não existe ou foi movida.
                </p>
                <button onClick={() => navigate('/')} className="error-button">
                    Voltar para a Home
                </button>
            </div>
        </div>
    );
}
