import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext'; // Importe o hook do tema
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import './visualizarMedicos.css';

export default function VisualizarMedicos() {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme(); // Obtenha o estado do tema
  const [medicos, setMedicos] = useState([]);

  useEffect(() => {
    const getMedicos = async () => {
      try {
        const response = await fetch('http://localhost:5000/medico');
        const data = await response.json();
        setMedicos(data);
      } catch (error) {
        console.error('Erro ao buscar médicos:', error);
      }
    };

    getMedicos();
  }, []);

  const handleCardClick = (id) => {
    navigate(`/perfilMedico/${id}`);
  };

  return (
    <div className={`app-container ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
      <Header />
      <h1 className='title-medicos'>Médicos</h1>
      <div className='Container-visualizarMedicos'>
        <div className="corpo">
          {medicos.map((medico) => (
            <div
              className={`quadroMedico ${isDarkMode ? 'dark' : 'light'}`}
              key={medico.id}
              onClick={() => handleCardClick(medico.id)}
            >
              <div className="imgMedico">
                <img
                  src={`http://localhost:5000${medico.foto}`}
                  alt={medico.nome}
                  className="fotoMedico"
                  onError={(e) => e.target.src = '/fallback-image.jpg'}
                />
              </div>
              <div className="componentes">
                <p className="componente-a">Nome: {medico.nome_completo}</p>
                <p>Idade: {medico.idade}</p>
                <p>Especialidade: {medico.especialidade}</p>
                <p>CRM: {medico.crm}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}