import React from 'react';
import { useNavigate } from 'react-router-dom';
import './visualizarMedicos.css';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';

export default function VisualizarMedicos() {
  const navigate = useNavigate();

  // Função para navegação
  const handleCardClick = () => {
    navigate('/perfilMedico'); // Altere para a rota desejada
  };

  // Função para gerar os cards repetidos
  const renderMedicoCards = (count) => {
    return Array.from({ length: count }, (_, index) => (
      <div 
        className='quadroMedico' 
        key={index}
        onClick={handleCardClick}
      >
        <div className='imgMedico'>
         {/*  <img src="../../Img/Logo.png" alt="Médico" /> */}
        </div>
        <div className='componentes'>
          <p className='componente-a'>Nome Completo:</p>
          <p>Idade:</p>
          <p>Especialidade:</p>
          <p>CRM:</p>
        </div>
      </div>
    ));
  };

  return (
    <>
      <Header />
      <div className='background-image'>
        <div className='corpo'>
          {renderMedicoCards(4)}
        </div>
        <div className='SegundoCorpo'>
          {renderMedicoCards(4)}
        </div>
      </div>
      <Footer />
    </>
  );
}