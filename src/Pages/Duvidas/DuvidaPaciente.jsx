import React, { useState, useEffect } from 'react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import { FaUser, FaEnvelope, FaReply } from 'react-icons/fa';
import './duvidaPaciente.css';
import { useTheme } from '../../context/ThemeContext';
import axios from 'axios';

const DuvidaPaciente = () => {
  const [duvidas, setDuvidas] = useState([]);
  const { isDarkMode } = useTheme();
  const [contatos, setContatos] = useState([]);
  const [loading, setLoading] = useState({
    duvidas: true,
    contatos: true
  });
  const [error, setError] = useState(null);
  const [resposta, setResposta] = useState('');

  useEffect(() => {
    const fetchDuvidas = async () => {
      try {
        const response = await axios.get('http://localhost:5000/duvidas');
        
        if (!Array.isArray(response.data)) {
          throw new Error('A API de dúvidas não retornou um array');
        }

        setDuvidas(response.data.map(item => ({
          id: item.id,
          mensagem: item.duvidas,
          data: item.createdAt
        })));
        
        setLoading(prev => ({ ...prev, duvidas: false }));
        
      } catch (err) {
        console.error('Erro ao buscar dúvidas:', err);
        setError(err.message || 'Erro ao carregar dúvidas');
        setLoading(prev => ({ ...prev, duvidas: false }));
      }
    };

    fetchDuvidas();
  }, []);

  useEffect(() => {
    const fetchContatos = async () => {
      try {
        const response = await axios.get('http://localhost:5000/contato/listar');
        
        if (!Array.isArray(response.data)) {
          throw new Error('A API de contatos não retornou um array');
        }

        setContatos(response.data.map(contato => ({
          _id: contato.id,
          nome: contato.nome,
          email: contato.email,
          assunto: contato.assunto,
          mensagem: contato.mensagem,
          data: contato.createdAt,
          respondida: false
        })));
        
        setLoading(prev => ({ ...prev, contatos: false }));
        
      } catch (err) {
        console.error('Erro ao buscar contatos:', err);
        setError(err.message || 'Erro ao carregar contatos');
        setLoading(prev => ({ ...prev, contatos: false }));
      }
    };

    fetchContatos();
  }, []);

  const handleReply = (email, assunto) => {
    const corpoEmail = `Prezado(a),\n\nEm resposta ao seu contato sobre "${assunto}":\n\n${resposta}\n\nAtenciosamente,\nEquipe Médica`;
    
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}&su=${encodeURIComponent(assunto)}&body=${encodeURIComponent(corpoEmail)}`;
    
    window.open(gmailUrl, '_blank');
    
    setResposta('');
    
    setContatos(prev => prev.map(c => 
      c.email === email ? { ...c, respondida: true } : c
    ));
  };

  const isLoading = loading.duvidas || loading.contatos;

  if (isLoading) {
    return (
      <div className={`loading ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
        <Header />
        <div className="loading-message">Carregando mensagens...</div>
        <Footer darkMode={isDarkMode} />
      </div>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <div className={`error-message ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
          Erro: {error}
          <button onClick={() => window.location.reload()} className="reload-button">
            Tentar novamente
          </button>
        </div>
        <Footer darkMode={isDarkMode} />
      </>
    );
  }

  return (
    <>
      <Header />
      
      <div className={`duvidas-container ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
        {/* Seção de Dúvidas */}
        <section aria-labelledby="duvidas-title" className="duvidas-section">
          <h1 id="duvidas-title" className="section-title">Dúvidas dos Médicos</h1>
          
          {duvidas.length > 0 ? (
            duvidas.map(duvida => (
              <div key={duvida.id} className={`message ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
                <div className="message-header">
                  <FaUser className="icon" />
                  <span className="message-sender">Médico</span>
                  <time dateTime={duvida.data} className="message-date">
                    {new Date(duvida.data).toLocaleString('pt-BR')}
                  </time>
                </div>
                <div className="message-content">
                  <p>{duvida.mensagem}</p>
                </div>
                <button
                  className={`reply-button ${isDarkMode ? 'dark-mode' : 'light-mode'}`}
                  onClick={() => handleReply('suporte@clinica.com', `Dúvida ${duvida.id}`)}
                >
                  <FaReply /> Responder
                </button>
              </div>
            ))
          ) : (
            <p className="no-messages">Nenhuma dúvida cadastrada</p>
          )}
        </section>

        {/* Seção de Contatos */}
        <section aria-labelledby="contatos-title" className="contatos-section">
          <h1 id="contatos-title" className="section-title">Contatos dos Pacientes</h1>
          
          {contatos.length > 0 ? (
            contatos.map(contato => (
              <article key={contato._id} className={`message paciente ${contato.respondida ? 'respondida' : ''} ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
                <div className="message-header">
                  <FaUser className="icon paciente-icon" />
                  <span className="message-sender">
                    {contato.nome || 'Paciente'}
                  </span>
                  <time dateTime={contato.data} className="message-date">
                    {new Date(contato.data).toLocaleString('pt-BR')}
                  </time>
                </div>
                
                <div className="message-meta">
                  <p><strong>Assunto:</strong> {contato.assunto || 'Não especificado'}</p>
                  <p><strong>Email:</strong> {contato.email}</p>
                </div>
                
                <div className="message-content">
                  <p>{contato.mensagem || 'Sem conteúdo'}</p>
                </div>
                
                {!contato.respondida && (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleReply(contato.email, contato.assunto);
                    }}
                    className="resposta-form"
                  >
                    <div className="form-group">
                      <label htmlFor={`resposta-${contato._id}`} className="form-label">
                        Digite sua resposta:
                      </label>
                      <textarea
                        id={`resposta-${contato._id}`}
                        value={resposta}
                        onChange={(e) => setResposta(e.target.value)}
                        placeholder="Escreva aqui a resposta para o paciente..."
                        required
                        className={`resposta-textarea ${isDarkMode ? 'dark-mode' : 'light-mode'}`}
                      />
                    </div>
                    <button type="submit" className={`reply-button ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
                      <FaEnvelope /> Responder via Gmail
                    </button>
                  </form>
                )}
              </article>
            ))
          ) : (
            <p className="no-messages">Nenhum contato recebido</p>
          )}
        </section>
      </div>
      <Footer darkMode={isDarkMode} />
    </>
  );
};

export default DuvidaPaciente;