import React from 'react';
import './visualizarMedicos.css';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';


export default function VisualizarMedicos() {
  return (
    <>
      <Header />
      <div className='background-image'>

        <div className='corpo'>
          <div className='quadroMedico'>
            <div className='imgMedico'><img src="../../Img/Logo.png" alt="" /></div>
            <div className='componentes'>
              <p className='componente-a'>Nome:</p>
              <p>Idade:</p>
              <p>Especialidade:</p>
              <p>CRM:</p>
            </div>
          </div>

          <div className='quadroMedico'>
            <div className='imgMedico'><img src="../../Img/Logo.png" alt="" /></div>
            <div className='componentes'>
              <p className='componente-a'>Nome:</p>
              <p>Idade:</p>
              <p>Especialidade:</p>
              <p>CRM:</p>
            </div>
          </div>
          <div className='quadroMedico'>
            <div className='imgMedico'><img src="../../Img/Logo.png" alt="" /></div>
            <div className='componentes'>
              <p className='componente-a'>Nome:</p>
              <p>Idade:</p>
              <p>Especialidade:</p>
              <p>CRM:</p>
            </div>
          </div>   
           <div className='quadroMedico'>
            <div className='imgMedico'><img src="../../Img/Logo.png" alt="" /></div>
            <div className='componentes'>
              <p className='componente-a'>Nome:</p>
              <p>Idade:</p>
              <p>Especialidade:</p>
              <p>CRM:</p>
            </div>
          </div>

        </div>
      </div>
      <Footer />
    </>

  )
}
