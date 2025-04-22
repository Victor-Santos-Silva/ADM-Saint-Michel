import React, { useState, useEffect } from 'react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import { FaUser, FaEnvelope } from 'react-icons/fa';
import './duvidaPaciente.css';
import axios from 'axios';

const DuvidaPaciente = () => {
  // 1. Todos os Hooks no topo (regra fundamental do React)
  const [duvidas, setDuvidas] = useState([]);
  const [contatos, setContatos] = useState([]);
  const [loading, setLoading] = useState({
    duvidas: true,
    contatos: true
  });
  const [error, setError] = useState(null);
  const [resposta, setResposta] = useState('');

  // 2. Efeitos para carregar dados
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

  // 3. Funções auxiliares
  const handleReply = (email, assunto) => {
    const corpoEmail = `Prezado(a),\n\nEm resposta ao seu contato:\n\n${resposta}`;
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(assunto)}&body=${encodeURIComponent(corpoEmail)}`;
    setResposta('');
    
    // Marcar como respondido
    setContatos(prev => prev.map(c => 
      c.email === email ? { ...c, respondida: true } : c
    ));
  };

  // 4. Verificação de carregamento e erros (após todos os Hooks)
  const isLoading = loading.duvidas || loading.contatos;

  if (isLoading) {
    return (
      <div className="loading">
        <Header />
        <div className="loading-message">Carregando mensagens...</div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <div className="error-message">
          Erro: {error}
          <button onClick={() => window.location.reload()} className="reload-button">
            Tentar novamente
          </button>
        </div>
        <Footer />
      </>
    );
  }

  // 5. Renderização principal
  return (
    <>
      <Header />
      <div className="duvidas-container">
        {/* Seção de Dúvidas */}
        <section aria-labelledby="duvidas-title" className="duvidas-section">
          <h1 id="duvidas-title" className="section-title">Dúvidas dos Médicos</h1>
          
          {duvidas.length > 0 ? (
            duvidas.map(duvida => (
              <div key={duvida.id} className="message">
                <div className="message-header">
                  <FaUser className="icon" />
                  <span className="message-sender">Usuário</span>
                  <time dateTime={duvida.data} className="message-date">
                    {new Date(duvida.data).toLocaleString()}
                  </time>
                </div>
                <div className="message-content">
                  <p>{duvida.mensagem}</p>
                </div>
                <button
                  className="reply-button"
                  onClick={() => handleReply('suporte@clinica.com', `Dúvida ${duvida.id}`)}
                >
                  <FaEnvelope /> Responder
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
              <article key={contato._id} className="message paciente">
                <div className="message-header">
                  <FaUser className="icon paciente-icon" />
                  <span className="message-sender">
                    {contato.nome || 'Paciente'}
                  </span>
                  <time dateTime={contato.data} className="message-date">
                    {new Date(contato.data).toLocaleString()}
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
                        Resposta:
                      </label>
                      <textarea
                        id={`resposta-${contato._id}`}
                        name={`resposta-${contato._id}`}
                        value={resposta}
                        onChange={(e) => setResposta(e.target.value)}
                        placeholder="Digite sua resposta aqui..."
                        required
                        className="resposta-textarea"
                      />
                    </div>
                    <button type="submit" className="reply-button">
                      <FaEnvelope /> Responder por E-mail
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
      <Footer />
    </>
  );
};

export default DuvidaPaciente;