import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import './loginAdm.css';
import adminImage from '../../assets/Img/admin.png';

export default function LoginAdm() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        senha: ''
    });

    const [error, setError] = useState({
        email: false,
        senha: false
    });

    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [forgotPasswordData, setForgotPasswordData] = useState({
        email: '',
        novaSenha: ''
    });

    const { login } = useAuth();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setError({ ...error, [name]: false });
    };

    const handleForgotPasswordChange = (e) => {
        const { name, value } = e.target;
        setForgotPasswordData({ ...forgotPasswordData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.email || !formData.senha) {
            toast.error('Preencha todos os campos!');
            setError({ email: !formData.email, senha: !formData.senha });
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/admin/login', formData);
            login(response.data.usuario, response.data.token, response.data.id);
            setFormData({ email: '', senha: '' });

            toast.success('Login realizado com sucesso!', {
                onClose: () => navigate('/homeAdm')
            });

        } catch (error) {
            console.error('Erro no login:', error.response?.data?.error || error.message);
            setError({ email: true, senha: true });
            toast.error(error.response?.data?.error || 'Erro no login. Tente novamente.');
        }
    };

    const handlePasswordReset = async (e) => {
        e.preventDefault();

        if (!forgotPasswordData.email) {
            toast.error('Email é obrigatório!');
            return;
        }

        if (!forgotPasswordData.novaSenha || forgotPasswordData.novaSenha.length < 6) {
            toast.error('A senha deve ter no mínimo 6 caracteres');
            return;
        }

        try {
            await axios.patch('http://localhost:5000/admin/esqueciSenha', {
                email: forgotPasswordData.email,
                novaSenha: forgotPasswordData.novaSenha
            });

            toast.success('Senha alterada com sucesso!');
            setShowForgotPassword(false);
            setForgotPasswordData({ email: '', novaSenha: '' });
        } catch (error) {
            toast.error(error.response?.data?.error || 'Erro ao redefinir senha');
        }
    };

    return (
        <div className='container-page-login-adm' style={{ backgroundImage: `url(${adminImage})` }}>
          <ToastContainer
                    position="top-right"
                    autoClose={5000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="colored"
                />

            <div className='container-formulario-login-adm'>
              
                <h1 className='title-login-adm'>Login Administrativo</h1>

                <form onSubmit={handleSubmit} className='form-login-adm'>
                    <div className='text-field-adm'>
                        <input
                            className='input-login-adm'
                            type="email"
                            name="email"
                            placeholder="Email corporativo"
                            value={formData.email}
                            onChange={handleChange}
                            style={{ borderColor: error.email ? 'red' : '' }}
                        />
                        {error.email && <p className="error-message-adm">Campo obrigatório</p>}
                    </div>

                    <div className='text-field-adm'>
                        <input
                            className='input-login-adm'
                            type="password"
                            name="senha"
                            placeholder="Senha"
                            value={formData.senha}
                            onChange={handleChange}
                            style={{ borderColor: error.senha ? 'red' : '' }}
                        />
                        {error.senha && <p className="error-message-adm">Campo obrigatório</p>}
                    </div>

                    <button type="submit" className='btn-login-adm'>Entrar</button>
                </form>

                <button
                    className='btn-forgot-password-adm'
                    onClick={() => setShowForgotPassword(true)}
                >
                    Esqueci a senha
                </button>

                {showForgotPassword && (
                    <div className='forgot-password-popup-adm'>
                        <div className='forgot-password-content-adm'>
                            <h2>Redefinir Senha</h2>
                            <form onSubmit={handlePasswordReset}>
                                <div className='text-field-adm'>
                                    <input
                                        className='input-login-adm'
                                        type="email"
                                        name="email"
                                        placeholder="Email cadastrado"
                                        value={forgotPasswordData.email}
                                        onChange={handleForgotPasswordChange}
                                    />
                                </div>

                                <div className='text-field-adm'>
                                    <input
                                        className='input-login-adm'
                                        type="password"
                                        name="novaSenha"
                                        placeholder="Nova senha (mínimo 6 caracteres)"
                                        value={forgotPasswordData.novaSenha}
                                        onChange={handleForgotPasswordChange}
                                    />
                                </div>

                                <div className='button-group-adm'>
                                    <button type="submit" className='btn-confirm-adm'>Redefinir Senha</button>
                                    <button 
                                        type="button" 
                                        className='btn-cancel-adm'
                                        onClick={() => {
                                            setShowForgotPassword(false);
                                            setForgotPasswordData({ email: '', novaSenha: '' });
                                        }}
                                    >
                                        Cancelar
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}