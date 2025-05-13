import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import './visualizarMedicos.css';

export default function VisualizarMedicos() {
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const [medicos, setMedicos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMedicos = async () => {
      try {
        const response = await fetch('http://localhost:5000/medico');
        if (!response.ok) throw new Error('Falha ao carregar médicos');
        const data = await response.json();
        setMedicos(data);
      } catch (err) {
        console.error('Erro:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMedicos();
  }, []);

  const handleCardClick = (id) => {
    navigate(`/perfilMedico/${id}`);
  };

  return (
    <div className={`page-container ${darkMode ? 'dark-mode' : 'light-mode'}`}>
      <Header />
      
      <main className="main-content">
        <h1 className="page-title">Nossos Médicos</h1>
        
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Carregando dados dos médicos...</p>
          </div>
        ) : error ? (
          <div className="error-state">
            <p className="error-message">{error}</p>
            <button 
              className="retry-button"
              onClick={() => window.location.reload()}
            >
              Tentar novamente
            </button>
          </div>
        ) : (
          <div className="medicos-container">
            <div className="medicos-grid">
              {medicos.map((medico) => (
                <div
                  className="medico-card"
                  key={medico.id}
                  onClick={() => handleCardClick(medico.id)}
                >
                  <div className="card-image-container">
                    <img
                      src={`http://localhost:5000${medico.foto}`}
                      alt={`Dr. ${medico.nome_completo}`}
                      className="medico-image"
                      onError={(e) => {
                        e.target.src = '/default-doctor.png';
                        e.target.className = 'medico-image default-image';
                      }}
                    />
                  </div>
                  <div className="card-content">
                    <h3 className="medico-name">{medico.nome_completo}</h3>
                    <div className="medico-details">
                      <p><span>Especialidade:</span> {medico.especialidade}</p>
                      <p><span>CRM:</span> {medico.crm}</p>
                      {medico.idade && <p><span>Idade:</span> {medico.idade} anos</p>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}