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
    const { login } = useAuth();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setError(prev => ({ ...prev, [name]: false }));
        setLoginError('');
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
            return;
        }
        try {
            const response = await axios.post(`http://localhost:5000/admin/login`, formData);

            login(response.data.nome, response.data.token, response.data.id);
            setFormData({ email: '', senha: '' });
<<<<<<< HEAD
            navigate('/homeAdm');
=======
            toast.success('Login realizado com sucesso!');
            navigate('/verMedicos');
>>>>>>> 680c5bb93143ffc40322f184dff138936599b253
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
            <br />
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
            </form>
        </div>
    );
}