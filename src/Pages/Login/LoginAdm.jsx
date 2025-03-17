import React, { useState } from 'react';
import './loginAdm.css'
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
        setError({ ...error, [name]: false }); // Remove erro ao digitar
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.email || !formData.senha) {
            alert("Preencha todos os campos!");
            setError({ email: !formData.email, senha: !formData.senha });
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/admin/login', formData);

            login(response.data.usuario); // Passa o nome do usuário para o contexto

            setFormData({ email: '', senha: '' }); // Limpa os campos após login

            navigate('/cadastro'); // indo para a pagina home
        } catch (error) {
            console.error('Erro no login:', error.response?.data?.error || error.message);

            setError({
                email: true,
                senha: true
            });
        }
    };


    return (
        <div className="backgroundImage">
            <br />
            <form className='formularioLogin' onSubmit={handleSubmit}>
                <h2>Login</h2>
                <div className="form-group">
                    <label htmlFor="crm" className='campos'>EMAIL:</label>
                    <input
                        type="text"
                        className="form-control"
                        id="email"
                        placeholder="Informe o seu email corporativo"
                        value={formData.email}
                        onChange={handleChange}
                        name='email'
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="password" className='campos'>SENHA:</label>
                    <input
                        type="password"
                        className="form-control"
                        id="password"
                        placeholder="Informe a sua senha corporativa"
                        value={formData.senha}
                        onChange={handleChange}
                        name='senha'
                    />
                </div>

                <button type="submit" className="botaoEntrar">Entrar</button>
            </form>
        </div>

    )
}
