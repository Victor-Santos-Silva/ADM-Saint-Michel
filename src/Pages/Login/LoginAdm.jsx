import React, { useState } from 'react';
import './loginAdm.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext.jsx';

export default function LoginAdm() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        senha: ''
    });

    const [error, setError] = useState({
        email: false,
        senha: false
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setError(prev => ({ ...prev, [name]: false }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validação client-side
        const newError = {
            email: !formData.email,
            senha: !formData.senha
        };

        if (newError.email || newError.senha) {
            setError(newError);
            return;
        }

        try {
            const response = await axios.post(
                `http://localhost:5000/admin/login`,
                formData
            );

            login(response.data.usuario);
            setFormData({ email: '', senha: '' });
            navigate('/cadastro'); // Altere para a rota correta
        } catch (error) {
            const errorMsg = error.response?.data?.error || 'Erro ao fazer login';
            console.error('Erro no login:', errorMsg);

            if (error.response?.status === 401) {
                alert('Credenciais inválidas');
                setError({ email: true, senha: true });
            } else {
                alert('Erro no servidor. Tente novamente mais tarde.');
            }
        }
    };

    return (
        <div className="backgroundImage">
            <br />
            <form className='formularioLogin' onSubmit={handleSubmit}>
                <h2>Login Administrativo</h2>
                
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