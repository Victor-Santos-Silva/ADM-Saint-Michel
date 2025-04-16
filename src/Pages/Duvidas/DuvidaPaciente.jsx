import React, { useState, useEffect } from 'react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import { FaReply, FaUserMd, FaUser, FaEnvelope } from 'react-icons/fa';
import './duvidaPaciente.css';
import axios from 'axios';

const DuvidaPaciente = () => {
  const [duvidas, setDuvidas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Buscar dúvidas do backend
  useEffect(() => {
    const fetchDuvidas = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/duvidas');
        setDuvidas(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
        console.error('Erro ao buscar dúvidas:', err);
      }
    };

    fetchDuvidas();
  }, []);

  // Função para responder por e-mail
  const handleReply = (emailPaciente, assunto = 'Resposta à sua dúvida') => {
    const corpoEmail = `Prezado paciente,\n\nEm resposta à sua dúvida:\n\n`;
    
    // Cria o link mailto com todos os parâmetros necessários
    window.location.href = `mailto:${emailPaciente}?subject=${encodeURIComponent(assunto)}&body=${encodeURIComponent(corpoEmail)}`;
  };

  if (loading) return <div className="loading">Carregando dúvidas...</div>;
  if (error) return <div className="error">Erro ao carregar dúvidas: {error}</div>;

  return (
    <>
      <Header />
      <div className="duvidas-container">
        <h1 className="title-duvidas">Dúvidas dos Pacientes</h1>
        
        <div className="messages-container">
          {duvidas.length === 0 ? (
            <div className="no-messages">Nenhuma dúvida encontrada</div>
          ) : (
            duvidas.map((duvida) => (
              <div 
                key={duvida._id} 
                className={`message ${duvida.remetente}`}
              >
                <div className="message-header">
                  {duvida.remetente === 'medico' ? (
                    <FaUserMd className="icon" />
                  ) : (
                    <FaUser className="icon" />
                  )}
                  <span className="message-sender">
                    {duvida.nome || (duvida.remetente === 'medico' ? 'Médico' : 'Paciente')}
                  </span>
                  <span className="message-date">
                    {new Date(duvida.data).toLocaleString()}
                  </span>
                </div>
                
                <div className="message-content">
                  <p>{duvida.mensagem}</p>
                </div>
                
                {duvida.remetente === 'paciente' && !duvida.respondida && (
                  <button 
                    className="reply-button"
                    onClick={() => handleReply(duvida.email, `Resposta: ${duvida.assunto || 'Sua dúvida'}`)}
                  >
                    <FaEnvelope /> Responder por E-mail
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default DuvidaPaciente;