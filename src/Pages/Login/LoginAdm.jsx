import React, { useState } from 'react';
import './loginAdm.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext.jsx';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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

    const [loginError, setLoginError] = useState('');
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [forgotPasswordData, setForgotPasswordData] = useState({
        email: '',
        novaSenha: ''
    });

    const { login } = useAuth();

    const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setError(prev => ({ ...prev, [name]: false }));
        setLoginError('');
    };

    const handleForgotPasswordChange = (e) => {
        const { name, value } = e.target;
        setForgotPasswordData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoginError('');

        const newError = {
            email: !formData.email,
            senha: !formData.senha
        };

        if (newError.email || newError.senha) {
            setError(newError);
            toast.error('Preencha todos os campos obrigatórios');
            return;
        }

        try {
            const response = await axios.post(`http://localhost:5000/admin/login`, formData);
            login(response.data.nome, response.data.token, response.data.id);
            setFormData({ email: '', senha: '' });
            toast.success('Login realizado com sucesso!');
            navigate('/homeAdm');

        } catch (error) {
            const errorMsg = error.response?.data?.error || 'Erro ao fazer login';
            console.error('Erro no login:', errorMsg);
            if (error.response?.status === 401) {
                setLoginError('Credenciais inválidas!');
                setError({ email: true, senha: true });
                toast.error('Credenciais inválidas!');
            } else {
                setLoginError('Email ou senha incorretos, tente novamente.');
                toast.error('Email ou senha incorretos, tente novamente.');
            }
        }
    };

    const handlePasswordRecovery = async (e) => {
        e.preventDefault();

        if (!forgotPasswordData.email || !forgotPasswordData.novaSenha) {
            toast.error('Preencha todos os campos');
            return;
        }

        if (!validateEmail(forgotPasswordData.email)) {
            toast.error('Formato de email inválido');
            return;
        }

        if (forgotPasswordData.novaSenha.length < 6) {
            toast.error('A senha deve ter no mínimo 6 caracteres');
            return;
        }

        try {
            const response = await axios.put(
                `http://localhost:5000/admin/esqueciSenha/${id}`,
                { novaSenha: forgotPasswordData.novaSenha }
            );

            toast.success('Senha alterada com sucesso!');
            setShowForgotPassword(false);
            setForgotPasswordData({ email: '', novaSenha: '' });

        } catch (error) {
            console.error('Erro na recuperação de senha:', error);
            const errorMsg = error.response?.data?.error || 'Erro ao redefinir senha';

            if (error.response?.status === 404) {
                toast.error('Email não cadastrado no sistema');
            } else {
                toast.error(errorMsg);
            }
        }
    };

    return (
        <div className="backgroundImage">
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
            />

            <form className='formularioLogin' onSubmit={handleSubmit}>
                <h2>Login Administrativo</h2>
                {loginError && (
                    <div className="login-error-message">
                        {loginError}
                    </div>
                )}

                <div className="form-group">
                    <label htmlFor="email" className='campos'>EMAIL:</label>
                    <input
                        type="email"
                        className={`form-control ${error.email ? 'is-invalid' : ''}`}
                        id="email"
                        placeholder="Informe o seu email corporativo"
                        value={formData.email}
                        onChange={handleChange}
                        name='email'
                        autoComplete='username'
                    />
                    {error.email &&
                        <div className="invalid-feedback">Campo obrigatório</div>}
                </div>

                <div className="form-group">
                    <label htmlFor="password" className='campos'>SENHA:</label>
                    <input
                        type="password"
                        className={`form-control ${error.senha ? 'is-invalid' : ''}`}
                        id="password"
                        placeholder="Informe a sua senha corporativa"
                        value={formData.senha}
                        onChange={handleChange}
                        name='senha'
                        autoComplete='current-password'
                    />
                    {error.senha &&
                        <div className="invalid-feedback">Campo obrigatório</div>}
                </div>

                <button type="submit" className="botaoEntrar">
                    Entrar
                </button>

                <button
                    type="button"
                    className="botaoEsqueciSenha"
                    onClick={() => setShowForgotPassword(true)}
                >
                    Esqueci a senha
                </button>
            </form>

            {showForgotPassword && (
                <div className="forgot-password-overlay">
                    <div className="forgot-password-modal">
                        <h3>Redefinição de Senha</h3>

                        <form onSubmit={handlePasswordRecovery}>
                            <div className="form-group">
                                <label>Email Corporativo:</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={forgotPasswordData.email}
                                    onChange={handleForgotPasswordChange}
                                    required
                                    placeholder="exemplo@hospital.com"
                                />
                            </div>

                            <div className="form-group">
                                <label>Nova Senha:</label>
                                <input
                                    type="password"
                                    name="novaSenha"
                                    value={forgotPasswordData.novaSenha}
                                    onChange={handleForgotPasswordChange}
                                    required
                                    minLength="6"
                                    placeholder="Mínimo 6 caracteres"
                                />
                            </div>

                            <div className="button-group">
                                <button type="submit" className="botaoConfirmar">
                                    Alterar Senha
                                </button>
                                <button
                                    type="button"
                                    className="botaoCancelar"
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
    );
}