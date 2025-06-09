import React, { useEffect, useState } from 'react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import './perfilMedico.css';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import {
  FaPhone, FaMapMarkerAlt, FaEnvelope, FaEdit,
  FaSave, FaTimes, FaUser, FaIdCard,
  FaRegHospital
} from 'react-icons/fa';
import { useTheme } from '../../context/ThemeContext';
import { Fa0 } from 'react-icons/fa6';
import { toast } from 'react-toastify';

export default function PerfilMedico() {
  const [medico, setMedico] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editedMedico, setEditedMedico] = useState({
    nome_completo: '',
    crm: '',
    telefone: '',
    endereco: '',
    email_corporativo: '',
    foto: null
  });
  const [previewImage, setPreviewImage] = useState('');
  const { id } = useParams();
  const { darkMode } = useTheme();
  const navigate = useNavigate();

  // Função para obter token de autenticação
  const getAuthToken = () => {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
  };

  // Configuração do Axios para incluir token nas requisições
  const api = axios.create({
    baseURL: 'https://apisaintmichel-a2fjc0c4d3bygmhe.eastus2-01.azurewebsites.net',
    headers: {
      'Authorization': `Bearer ${getAuthToken()}`
    }
  });

  useEffect(() => {
    const fetchMedico = async () => {
      try {
        const response = await api.get(`/medico/${id}`);
        setMedico(response.data);
        console.log(response.data);

        setEditedMedico({
          nome_completo: response.data.nome_completo,
          crm: response.data.crm,
          telefone: response.data.telefone,
          endereco: response.data.endereco,
          email_corporativo: response.data.email_corporativo,
          foto: null
        });
        setPreviewImage(`https://apisaintmichel-a2fjc0c4d3bygmhe.eastus2-01.azurewebsites.net${response.data.foto}`);
      } catch (error) {
        console.error('Erro ao buscar médico:', error);
        if (error.response?.status === 401) {
          toast.error('Sessão expirada. Faça login novamente.');
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchMedico();
  }, [id]);

  const handleEdit = () => {
    setEditing(true);
  };

  const handleCancel = () => {
    setEditing(false);
    setEditedMedico({
      nome_completo: medico.nome_completo,
      crm: medico.crm,
      telefone: medico.telefone,
      endereco: medico.endereco,
      email_corporativo: medico.email_corporativo,
      foto: null
    });
    setPreviewImage(`https://apisaintmichel-a2fjc0c4d3bygmhe.eastus2-01.azurewebsites.net${medico.foto}`);
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append('nome_completo', editedMedico.nome_completo);
      formData.append('crm', editedMedico.crm);
      formData.append('telefone', editedMedico.telefone);
      formData.append('endereco', editedMedico.endereco);
      formData.append('email_corporativo', editedMedico.email_corporativo);

      if (editedMedico.foto) {
        formData.append('foto', editedMedico.foto);
      }

      const response = await api.put(`/medico/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setMedico(response.data);
      setEditing(false);
      toast.info('Dados atualizados com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar médico:', error);

      if (error.response) {
        if (error.response.status === 401) {
          toast.error('Sessão expirada! Por favor, faça login novamente.');
          navigate('/login');
        } else if (error.response.status === 403) {
          toast.error('Você não tem permissão para editar este perfil.');
        } else {
          toast.error(`Erro: ${error.response.data.message || 'Erro ao atualizar dados'}`);
        }
      } else {
        toast.error('Erro de conexão. Verifique sua internet e tente novamente.');
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedMedico(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) {
    return (
      <div className={`loading-container ${darkMode ? 'dark-mode' : ''}`}>
        <div className="loading-spinner"></div>
        <p>Carregando informações do médico...</p>
      </div>
    );
  }

  if (!medico) {
    return (
      <div className={`error-container ${darkMode ? 'dark-mode' : ''}`}>
        <p>Não foi possível carregar as informações do médico.</p>
      </div>
    );
  }

  return (
    <div className={`perfil-medico-page ${darkMode ? 'dark-mode' : ''}`}>
      <Header />
      <div className='perfil-medico-header'>
        <h1>Perfil do Médico</h1>
      </div>

      <main className='container-perfil-medico'>
        <div className='perfil-medico-foto-container'>
          <img
            src={previewImage || `https://apisaintmichel-a2fjc0c4d3bygmhe.eastus2-01.azurewebsites.net${medico.foto}`}
            alt={`Dr. ${medico.nome_completo}`}
            onError={(e) => {
              e.target.src = '/default-doctor.jpg';
            }}
            className='perfil-medico-foto'
          />
        </div>

        <div>
          <div>
            {editing ? (
              <>
                <div className='perfil-medico-info'>
                  <FaUser />
                  <input
                    type="text"
                    name="nome_completo"
                    value={editedMedico.nome_completo}
                    onChange={handleChange}
                    placeholder="Nome Completo"
                    className='input-edit'
                  />
                </div>

                <div className='perfil-medico-info'>
                  <FaIdCard />
                  <input
                    type="text"
                    name="crm"
                    value={editedMedico.crm}
                    onChange={handleChange}
                    placeholder="CRM"
                    className='input-edit'
                  />
                </div>

                <div className='perfil-medico-info'>
                  <FaPhone />
                  <input
                    type="text"
                    name="telefone"
                    value={editedMedico.telefone || ''}
                    onChange={handleChange}
                    className='input-edit'
                  />
                </div>

                <div className='perfil-medico-info'>
                  <FaMapMarkerAlt />
                  <input
                    type="text"
                    name="endereco"
                    value={editedMedico.endereco || ''}
                    onChange={handleChange}
                    className='input-edit'
                  />
                </div>

                <div className='perfil-medico-info'>
                  <FaEnvelope />
                  <input
                    type="email"
                    name="email_corporativo"
                    value={editedMedico.email_corporativo || ''}
                    onChange={handleChange}
                    className='input-edit'
                  />
                </div>

                <div className='botoes-editar'>
                  <button onClick={handleSave} className='botao-salvar'>
                    <FaSave /> Salvar
                  </button>
                  <button onClick={handleCancel} className='botao-cancelar'>
                    <FaTimes /> Cancelar
                  </button>
                </div>

              </>
            ) : (
              <div className='info-perfil-medico'>
                <div className='perfil-medico-info'>
                  <FaUser />
                  <h2>Dr. {medico.nome_completo}</h2>
                </div>

                <div className='perfil-medico-info'>
                  <FaIdCard />
                  <p>CRM: {medico.crm}</p>
                </div>

                <div className='perfil-medico-info'>
                  <FaRegHospital />
                  <p>Especialidade: {medico.especialidade}</p>
                </div>

                <div className='perfil-medico-info'>
                  <FaPhone />
                  <p>Telefone: {medico.telefone}</p>
                </div>

                <div className='perfil-medico-info'>
                  <FaMapMarkerAlt />
                  <p>Endereço: {medico.endereco}</p>
                </div>

                <div className='perfil-medico-info'>
                  <FaEnvelope />
                  <p><b>Email:</b> {medico.email_corporativo}</p>
                </div>

                <button onClick={handleEdit} className='botao-editar'>
                  <FaEdit /> <b>Editar</b>
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
      <br />
      <br />
      <Footer />
    </div>
  );
}