import React, { useEffect, useState } from 'react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import './perfilMedico.css';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  FaPhone, FaMapMarkerAlt, FaEnvelope, FaEdit, 
  FaSave, FaTimes, FaUser, FaIdCard 
} from 'react-icons/fa';
import { useTheme } from '../../context/ThemeContext';

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
    baseURL: 'http://localhost:5000',
    headers: {
      'Authorization': `Bearer ${getAuthToken()}`
    }
  });

  useEffect(() => {
    const fetchMedico = async () => {
      try {
        const response = await api.get(`/medico/${id}`);
        setMedico(response.data);
        setEditedMedico({
          nome_completo: response.data.nome_completo,
          crm: response.data.crm,
          telefone: response.data.telefone,
          endereco: response.data.endereco,
          email_corporativo: response.data.email_corporativo,
          foto: null
        });
        setPreviewImage(`http://localhost:5000${response.data.foto}`);
      } catch (error) {
        console.error('Erro ao buscar médico:', error);
        if (error.response?.status === 401) {
          alert('Sessão expirada. Faça login novamente.');
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
    setPreviewImage(`http://localhost:5000${medico.foto}`);
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
      alert('Dados atualizados com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar médico:', error);
      
      if (error.response) {
        if (error.response.status === 401) {
          alert('Sessão expirada! Por favor, faça login novamente.');
          navigate('/login');
        } else if (error.response.status === 403) {
          alert('Você não tem permissão para editar este perfil.');
        } else {
          alert(`Erro: ${error.response.data.message || 'Erro ao atualizar dados'}`);
        }
      } else {
        alert('Erro de conexão. Verifique sua internet e tente novamente.');
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditedMedico(prev => ({
        ...prev,
        foto: file
      }));
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
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
      <main className="profile-main">
        <div className="profile-header">
          <h1 className="profile-title">Perfil do Médico</h1>
          <div className="profile-breadcrumb">
          </div>
        </div>

        <div className="profile-container">
          <div className="profile-card">
            <div className="profile-image-container">
              <img 
                src={previewImage || `http://localhost:5000${medico.foto}`} 
                alt={`Dr. ${medico.nome_completo}`} 
                className="profile-image"
                onError={(e) => {
                  e.target.src = '/default-doctor.jpg';
                }}
              />
              {editing && (
                <div className="image-upload-container">
                  <label htmlFor="foto" className="upload-button">
                    Alterar Foto
                  </label>
                  <input
                    id="foto"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                  />
                </div>
              )}
              <div className="profile-badge">{medico.especialidade}</div>
            </div>

            <div className="profile-info">
              <div className="profile-header-actions">
                {editing ? (
                  <div className="edit-fields-container">
                    <div className="input-group">
                      <FaUser className="input-icon" />
                      <input
                        type="text"
                        name="nome_completo"
                        value={editedMedico.nome_completo}
                        onChange={handleChange}
                        className="edit-input"
                        placeholder="Nome Completo"
                      />
                    </div>
                    <div className="input-group">
                      <FaIdCard className="input-icon" />
                      <input
                        type="text"
                        name="crm"
                        value={editedMedico.crm}
                        onChange={handleChange}
                        className="edit-input"
                        placeholder="CRM"
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    <h2 className="doctor-name">Dr. {medico.nome_completo}</h2>
                    <p className="doctor-crm">CRM: {medico.crm}</p>
                  </>
                )}
                
                {!editing ? (
                  <button className="edit-button" onClick={handleEdit}>
                    <FaEdit /> Editar
                  </button>
                ) : (
                  <div className="edit-actions">
                    <button className="save-button" onClick={handleSave}>
                      <FaSave /> Salvar
                    </button>
                    <button className="cancel-button" onClick={handleCancel}>
                      <FaTimes /> Cancelar
                    </button>
                  </div>
                )}
              </div>

              <div className="info-grid">
                <div className="info-item">
                  <FaPhone className="info-icon" />
                  <div>
                    <h4>Telefone</h4>
                    {editing ? (
                      <input
                        type="text"
                        name="telefone"
                        value={editedMedico.telefone || ''}
                        onChange={handleChange}
                        className="edit-input"
                      />
                    ) : (
                      <p>{medico.telefone}</p>
                    )}
                  </div>
                </div>

                <div className="info-item">
                  <FaMapMarkerAlt className="info-icon" />
                  <div>
                    <h4>Endereço</h4>
                    {editing ? (
                      <input
                        type="text"
                        name="endereco"
                        value={editedMedico.endereco || ''}
                        onChange={handleChange}
                        className="edit-input"
                      />
                    ) : (
                      <p>{medico.endereco}</p>
                    )}
                  </div>
                </div>

                <div className="info-item">
                  <FaEnvelope className="info-icon" />
                  <div>
                    <h4>E-mail</h4>
                    {editing ? (
                      <input
                        type="email"
                        name="email_corporativo"
                        value={editedMedico.email_corporativo || ''}
                        onChange={handleChange}
                        className="edit-input"
                      />
                    ) : (
                      <p>{medico.email_corporativo}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}