import React, { useEffect, useState } from 'react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import './perfilMedico.css';
import axios from 'axios';
import { useParams } from 'react-router-dom';

export default function PerfilMedico() {
  const [medico, setMedico] = useState([]);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    const getMedico = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/medico/${id}`); // Supondo que o id seja 3
        setMedico(response.data);
        console.log(response.data);
      } catch (error) {
        console.error('Erro ao buscar médico:', error);
      } finally {
        setLoading(false);
      }
    };
    getMedico();
  }, [id]);

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <>
      <Header />
      <div className='container-color'>
        <h1 className='title-medico'>Médico</h1>
        <div className='container-perfil-medico'>
          <div className='perfilMedico'>
            <div className='quadroMedicoGrande'>
              <div className='imgMedicoGrande'>
                <img src={`http://localhost:5000${medico.foto}`} alt="Foto do Médico" className='medico-img' />
              </div>

              <div className='componentesGrande'>
                <p>Nome: {medico.nome_completo}</p>
                <p>Idade: {medico.idade}</p>
                <p>Especialidade: {medico.especialidade}</p>
                <p>CRM: {medico.crm}</p>
                <p>CPF: {medico.cpf}</p>
                <p>Telefone: {medico.telefone}</p>
                <p>Endereço: {medico.endereco}</p>
                <p>Nacionalidade: {medico.nacionalidade}</p>
                <p>Email Corporativo: {medico.email_corporativo}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
