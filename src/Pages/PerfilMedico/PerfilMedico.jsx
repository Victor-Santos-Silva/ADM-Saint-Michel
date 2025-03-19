import React, { useState } from 'react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import './perfilMedico.css'

export default function PerfilMedico() {
  const [editing, setEditing] = useState(false);
  const [medico, setMedico] = useState({
    nome: '',
    idade: '',
    especialidade: '',
    crm: '',
    cpf: '',
    telefone: '',
    endereco: '',
    nacionalidade: '',
    emailCorporativo: '',
    senhaCorporativa: '',
    foto: '../../Img/Logo.png'
  });

  const handleEditar = () => setEditing(true);
  const handleSalvar = () => setEditing(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMedico(prev => ({ ...prev, [name]: value }));
  };

  return (
    <>
      <Header/>
      <div className='background-image'>
        <div className='perfilMedico'>
          <div className='quadroMedicoGrande'>
            <div className='imgMedicoGrande'>
             {/*  <img src={medico.foto} alt="Foto do Médico" /> */}
            </div>
            
            <div className='componentesGrande'>
              {editing ? (
                <>
                  <CampoEdicao label="Nome:" name="nome" value={medico.nome} onChange={handleChange} />
                  <CampoEdicao label="Idade:" name="idade" value={medico.idade} onChange={handleChange} />
                  <CampoEdicao label="Especialidade:" name="especialidade" value={medico.especialidade} onChange={handleChange} />
                  <CampoEdicao label="CRM:" name="crm" value={medico.crm} onChange={handleChange} />
                  <CampoEdicao label="CPF:" name="cpf" value={medico.cpf} onChange={handleChange} />
                  <CampoEdicao label="Telefone:" name="telefone" value={medico.telefone} onChange={handleChange} />
                  <CampoEdicao label="Endereço:" name="endereco" value={medico.endereco} onChange={handleChange} />
                  <CampoEdicao label="Nacionalidade:" name="nacionalidade" value={medico.nacionalidade} onChange={handleChange} />
                  <CampoEdicao label="Email Corporativo:" name="emailCorporativo" value={medico.emailCorporativo} onChange={handleChange} type="email" />
                  <CampoEdicao label="Senha Corporativa:" name="senhaCorporativa" value={medico.senhaCorporativa} onChange={handleChange} type="password" />
                </>
              ) : (
                <>
                  <p>Nome: {medico.nome}</p>
                  <p>Idade: {medico.idade}</p>
                  <p>Especialidade: {medico.especialidade}</p>
                  <p>CRM: {medico.crm}</p>
                  <p>CPF: {medico.cpf}</p>
                  <p>Telefone: {medico.telefone}</p>
                  <p>Endereço: {medico.endereco}</p>
                  <p>Nacionalidade: {medico.nacionalidade}</p>
                  <p>Email Corporativo: {medico.emailCorporativo}</p>
                  <p>Senha Corporativa: {medico.senhaCorporativa}</p>
                </>
              )}
              
              <div className="botoesAcao">
                {editing ? (
                  <button className="botaoSalvar" onClick={handleSalvar}>
                    Salvar Alterações
                  </button>
                ) : (
                  <button className="botaoEditar" onClick={handleEditar}>
                    Editar Perfil
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer/>
    </>
  );
}

const CampoEdicao = ({ label, name, value, onChange, type = 'text' }) => (
  <div className="campo-edicao">
    <label>{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className="editable-input"
    />
  </div>
);