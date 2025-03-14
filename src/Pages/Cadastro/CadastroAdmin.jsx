import React, { useState } from 'react';
import axios from 'axios';
import './cadastroAdmin.css';

export default function CadastroAdmin() {
    const [formData, setFormData] = useState({
        nome_completo: '',
        idade: '',
        cpf: '',
        crm: '',
        telefone: '',
        endereco: '',
        especialidade: '',
        nacionalidade: '',
        email_corporativo: '',
        senha_corporativa: '',
    });

    const [selectedFile, setSelectedFile] = useState(null);
    const [previewImagem, setPreviewImagem] = useState(null);
    const [errors, setErrors] = useState({}); // Estado para armazenar mensagens de erro

    const handleChange = (event) => {
        const { id, value } = event.target;
        setFormData({ ...formData, [id]: value });
        // Limpa o erro ao digitar no campo
        setErrors((prevErrors) => ({ ...prevErrors, [id]: '' }));
    };

    const handleImagemChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreviewImagem(URL.createObjectURL(file));
        }
    };

    // Função para validar o formulário no frontend
    const validateForm = () => {
        const newErrors = {};

        // Validação do Nome Completo
        if (!formData.nome_completo.trim()) {
            newErrors.nome_completo = 'O nome completo não pode estar vazio.';
        }

        // Validação da Idade
        if (!formData.idade) {
            newErrors.idade = 'A idade é obrigatória.';
        } else if (formData.idade < 18 || formData.idade > 80) {
            newErrors.idade = 'A idade deve estar entre 18 e 80 anos.';
        }

        // Validação do CPF
        if (!formData.cpf.trim()) {
            newErrors.cpf = 'O CPF é obrigatório.';
        } else if (!/^\d{11}$/.test(formData.cpf)) {
            newErrors.cpf = 'O CPF deve ter 11 dígitos.';
        }

        // Validação do CRM
        if (!formData.crm.trim()) {
            newErrors.crm = 'O CRM é obrigatório.';
        } else if (!/^[0-9]{6}\/[A-Z]{2}$/.test(formData.crm)) {
            newErrors.crm = 'CRM inválido! Formato correto: 123456/SP.';
        }

        // Validação do Telefone
        if (!formData.telefone.trim()) {
            newErrors.telefone = 'O telefone é obrigatório.';
        } else if (!/^\d{10,11}$/.test(formData.telefone)) {
            newErrors.telefone = 'O telefone deve ter 10 ou 11 dígitos.';
        }

        // Validação do Email Corporativo
        if (!formData.email_corporativo.trim()) {
            newErrors.email_corporativo = 'O email corporativo é obrigatório.';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email_corporativo)) {
            newErrors.email_corporativo = 'Informe um email válido.';
        }

        // Validação da Senha Corporativa
        if (!formData.senha_corporativa.trim()) {
            newErrors.senha_corporativa = 'A senha corporativa é obrigatória.';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; // Retorna true se não houver erros
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Validação no frontend
        if (!validateForm()) {
            return; // Impede o envio se houver erros
        }

        const formDataToSend = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            formDataToSend.append(key, value);
        });
        if (selectedFile) {
            formDataToSend.append('foto', selectedFile);
        }

        try {
            await axios.post('http://localhost:5000/medico/cadastro', formDataToSend, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            alert('Cadastro de Médico realizado com sucesso!');
            setFormData({
                nome_completo: '',
                idade: '',
                cpf: '',
                crm: '',
                telefone: '',
                endereco: '',
                especialidade: '',
                nacionalidade: '',
                email_corporativo: '',
                senha_corporativa: '',
            });
            setSelectedFile(null);
            setPreviewImagem(null);
            setErrors({}); // Limpa os erros após o sucesso
        } catch (error) {
            if (error.response && error.response.data.errors) {
                // Captura os erros retornados pelo backend
                setErrors(error.response.data.errors);
            } else {
                alert('Erro ao cadastrar. Tente novamente mais tarde.');
                console.error('Erro ao cadastrar:', error);
            }
        }
    };

    return (
        <div className="background">
            <form onSubmit={handleSubmit} className="formularioAdm">
                <h2 className="tituloAdm">Cadastro de novos médicos:</h2>

                <div className="linha-colunas">
                    <div className="coluna-vertical">
                        <div className="form-groupAdm">
                            <label htmlFor="nome_completo">Nome completo:</label>
                            <input
                                type="text"
                                id="nome_completo"
                                value={formData.nome_completo}
                                onChange={handleChange}
                                className={errors.nome_completo ? 'input-error' : ''}
                            />
                            {errors.nome_completo && <span className="error-message">{errors.nome_completo}</span>}
                        </div>
                        <div className="form-groupAdm">
                            <label htmlFor="idade">Idade:</label>
                            <input
                                type="number"
                                id="idade"
                                value={formData.idade}
                                onChange={handleChange}
                                className={errors.idade ? 'input-error' : ''}
                            />
                            {errors.idade && <span className="error-message">{errors.idade}</span>}
                        </div>
                        <div className="form-groupAdm">
                            <label htmlFor="cpf">CPF:</label>
                            <input
                                type="text"
                                id="cpf"
                                value={formData.cpf}
                                onChange={handleChange}
                                placeholder='00000000000'
                                className={errors.cpf ? 'input-error' : ''}
                            />
                            {errors.cpf && <span className="error-message">{errors.cpf}</span>}
                        </div>
                        <div className="form-groupAdm">
                            <label htmlFor="crm">CRM:</label>
                            <input
                                type="text"
                                id="crm"
                                value={formData.crm}
                                onChange={handleChange}
                                placeholder='123456/SP'
                                className={errors.crm ? 'input-error' : ''}
                            />
                            {errors.crm && <span className="error-message">{errors.crm}</span>}
                        </div>
                        <div className="form-groupAdm">
                            <label htmlFor="telefone">Telefone:</label>
                            <input
                                type="text"
                                id="telefone"
                                value={formData.telefone}
                                onChange={handleChange}
                                placeholder='(DDD)000000000'
                                className={errors.telefone ? 'input-error' : ''}
                            />
                            {errors.telefone && <span className="error-message">{errors.telefone}</span>}
                        </div>
                    </div>

                    <div className="coluna-vertical">
                        <div className="form-groupSegundo">
                            <label htmlFor="endereco">Endereço:</label>
                            <input
                                type="text"
                                id="endereco"
                                value={formData.endereco}
                                onChange={handleChange}
                                className={errors.endereco ? 'input-error' : ''}
                            />
                            {errors.endereco && <span className="error-message">{errors.endereco}</span>}
                        </div>
                        <div className="form-groupSegundo">
                            <label htmlFor="especialidade">Especialidade:</label>
                            <select
                                id="especialidade"
                                value={formData.especialidade}
                                onChange={handleChange}
                                className={errors.especialidade ? 'input-error' : ''}
                            >
                                <option value="">Selecione uma especialidade</option>
                                <option value="Ortopedista">Ortopedista</option>
                                <option value="Proctologista">Proctologista</option>
                                <option value="Oncologista">Oncologista</option>
                                <option value="Otorrinolaringologista">Otorrinolaringologista</option>
                                <option value="Oftalmologista">Oftalmologista</option>
                                <option value="Cardiologista">Cardiologista</option>
                                <option value="Pneumologista">Pneumologista</option>
                                <option value="Nefrologista">Nefrologista</option>
                                <option value="Gastroenterologista">Gastroenterologista</option>
                                <option value="Urologista">Urologista</option>
                                <option value="Dermatologista">Dermatologista</option>
                                <option value="Ginecologista">Ginecologista</option>
                            </select>
                            {errors.especialidade && <span className="error-message">{errors.especialidade}</span>}
                        </div>
                        <div className="form-groupSegundo">
                            <label htmlFor="nacionalidade">Nacionalidade:</label>
                            <input
                                type="text"
                                id="nacionalidade"
                                value={formData.nacionalidade}
                                onChange={handleChange}
                                className={errors.nacionalidade ? 'input-error' : ''}
                            />
                            {errors.nacionalidade && <span className="error-message">{errors.nacionalidade}</span>}
                        </div>
                        <div className="form-groupSegundo">
                            <label htmlFor="email_corporativo">Email Corporativo:</label>
                            <input
                                type="email"
                                id="email_corporativo"
                                value={formData.email_corporativo}
                                onChange={handleChange}
                                placeholder='exemplo@gmail.com'
                                className={errors.email_corporativo ? 'input-error' : ''}
                            />
                            {errors.email_corporativo && <span className="error-message">{errors.email_corporativo}</span>}
                        </div>
                        <div className="form-groupSegundo">
                            <label htmlFor="senha_corporativa">Senha Corporativa:</label>
                            <input
                                type="password"
                                id="senha_corporativa"
                                value={formData.senha_corporativa}
                                onChange={handleChange}
                                className={errors.senha_corporativa ? 'input-error' : ''}
                            />
                            {errors.senha_corporativa && <span className="error-message">{errors.senha_corporativa}</span>}
                        </div>
                    </div>
                </div>

                <div className="form-group">
                    <input type="file" id="imagem" accept="image/*" onChange={handleImagemChange} />
                    {errors.foto && <span className="error-message">{errors.foto}</span>}
                </div>

                {previewImagem && (
                    <div className="imgPreview">
                        <img src={previewImagem} alt="Pré-visualização" className="imgPreviewImage" />
                    </div>
                )}

                <button type="submit" className="botaoCadastrar">
                    Cadastrar
                </button>
            </form>
        </div>
    );
}