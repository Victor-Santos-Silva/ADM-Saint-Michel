import React from 'react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import { FaReply, FaUserMd, FaUser } from 'react-icons/fa';
import './duvidaPaciente.css';

const DuvidaPaciente = () => {
  // Dados mockados (não funcionais)
  const duvidas = [
    {
      id: 1,
      mensagem: 'Bom dia, gostaria de saber sobre os horários de atendimento.',
      remetente: 'paciente',
      data: '2023-06-15T09:30:00',
      respondida: false
    },
    {
      id: 2,
      mensagem: 'Nosso horário é das 8h às 18h, de segunda a sexta.',
      remetente: 'medico',
      data: '2023-06-15T10:15:00',
      respondida: true
    },
    {
      id: 3,
      mensagem: 'Preciso remarcar minha consulta, como posso fazer?',
      remetente: 'paciente',
      data: '2023-06-16T14:20:00',
      respondida: false
    }
  ];

  // Função mockada para o botão de responder
  const handleReply = () => {
    alert('Esta funcionalidade será implementada posteriormente!');
  };

  return (
    <>
      <Header />
      <div className="duvidas-container">
        <h1 className="title-duvidas">Dúvidas</h1>
        
        <div className="messages-container">
          {duvidas.map((duvida) => (
            <div 
              key={duvida.id} 
              className={`message ${duvida.remetente}`}
            >
              <div className="message-header">
                {duvida.remetente === 'medico' ? (
                  <FaUserMd className="icon" />
                ) : (
                  <FaUser className="icon" />
                )}
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
                  onClick={handleReply}
                >
                  <FaReply /> Responder
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default DuvidaPaciente;