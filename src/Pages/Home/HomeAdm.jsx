import React, { useState, useEffect } from 'react';
import { Carousel, Spinner } from 'react-bootstrap';
import axios from 'axios';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import { useTheme } from '../../context/ThemeContext';
import { FaSun, FaMoon } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import './HomeAdm.css';
import imagemPadrao from '../../assets/Img/administracao.png';
import imagem1 from '../../assets/Img/auxiliar.png';
import imagem2 from '../../assets/Img/grafico.jpg';
import imagem3 from '../../assets/Img/administracao.png';

export default function HomeAdm() {
  const { isDarkMode, toggleTheme } = useTheme();
  const [medicos, setMedicos] = useState([]);
  const [notification, setNotification] = useState([]);
  const [especialidades, setEspecialidades] = useState([]);
  const [especialidadeSelecionada, setEspecialidadeSelecionada] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [avisos, setAvisos] = useState([
    {
      id: 1,
      titulo: "Manutenção programada",
      mensagem: "O sistema ficará indisponível no próximo sábado das 00h às 06h para manutenção.",
      data: "15/06/2023",
      importante: true
    },
    {
      id: 2,
      titulo: "Novos médicos",
      mensagem: "Damos as boas-vindas aos novos médicos que se juntaram à nossa equipe este mês.",
      data: "10/06/2023",
      importante: false
    },
    {
      id: 3,
      titulo: "Atualização do sistema",
      mensagem: "Todos os médicos devem atualizar seus dados até o final do mês.",
      data: "05/06/2023",
      importante: true
    }
  ]);

  useEffect(() => {
    const fetchMedicos = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/medico');
        setMedicos(data);
        setEspecialidades([...new Set(data.map(m => m.especialidade))]);
      } catch (err) {
        setError('Erro ao carregar médicos');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMedicos();
  }, []);

  const medicosFiltrados = especialidadeSelecionada
    ? medicos.filter(medico => medico.especialidade === especialidadeSelecionada)
    : medicos;

  if (loading) return <Spinner animation="border" className="d-block mx-auto mt-5" />;
  if (error) return <div className="alert alert-danger mt-5 mx-auto text-center">{error}</div>;

  return (
    <div className={`homePrincipal ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
      <Header />
      
      <button 
        onClick={toggleTheme} 
        className={`theme-toggle-btn ${isDarkMode ? 'dark' : 'light'}`}
      >
        {isDarkMode ? <FaSun className="theme-icon" /> : <FaMoon className="theme-icon" />}
        <span className="theme-text">
          {isDarkMode ? ' Modo Claro' : ' Modo Escuro'}
        </span>
      </button>

      <div className="carrossel-container">
        <Carousel>
          {[imagem1, imagem2, imagem3].map((image, index) => (
            <Carousel.Item key={index} interval={3000}>
              <img 
                className="d-block w-100 carrossel-image" 
                src={image} 
                alt={`Banner ${index + 1}`} 
              />
            </Carousel.Item>
          ))}
        </Carousel>
      </div>

      <main className="content-wrapper">
        <div className="doctors-container">
          <h2 className="section-title">Nossos Médicos</h2>
          
          <div className="filter-container">
            <label className="filter-label">Filtrar por Especialidade:</label>
            <select
              className="filter-select"
              value={especialidadeSelecionada}
              onChange={(e) => setEspecialidadeSelecionada(e.target.value)}
            >
              <option value="">Todas as especialidades</option>
              {especialidades.map((especialidade, index) => (
                <option key={index} value={especialidade}>
                  {especialidade}
                </option>
              ))}
            </select>
          </div>

          <div className="doctors-grid">
            {medicosFiltrados.length > 0 ? (
              medicosFiltrados.map((medico) => (
                <div key={medico.id} className="doctor-card">
                  <img
                    className="doctor-image"
                    src={`http://localhost:5000${medico.foto}`}
                    alt={medico.nome_completo}
                    onError={(e) => e.target.src = imagemPadrao}
                  />
                  <div className="doctor-info">
                    <h3 className="doctor-name">{medico.nome_completo}</h3>
                    <p className="doctor-specialty">{medico.especialidade}</p>
                    <p className="doctor-crm">CRM: {medico.crm}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-results">
                Nenhum médico encontrado{especialidadeSelecionada && ` na especialidade ${especialidadeSelecionada}`}
                <button 
                  className="btn btn-outline-light mt-3"
                  onClick={() => setEspecialidadeSelecionada('')}
                >
                  Limpar filtro
                </button>
              </div>
            )}
          </div>
        </div>
        
        <div className="avisos-container">
          <h3 className="avisos-titulo">Quadro de Avisos</h3>
          <div className="avisos-lista">
            {avisos.map(aviso => (
              <div 
                key={aviso.id} 
                className={`aviso-item ${aviso.importante ? 'importante' : ''}`}
              >
                <div className="aviso-cabecalho">
                  <h4 className="aviso-titulo">{aviso.titulo}</h4>
                  <span className="aviso-data">{aviso.data}</span>
                </div>
                <p className="aviso-mensagem">{aviso.mensagem}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer darkMode={isDarkMode} />
    </div>
  );
}