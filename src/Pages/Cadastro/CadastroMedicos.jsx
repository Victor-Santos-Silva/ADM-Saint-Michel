import React, { useState, useRef } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './cadastroMedicos.css';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';

export default function CadastroMedicos() {
    const [formData, setFormData] = useState({
        nome_completo: '',
        data_nascimento: '',
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
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fileInputRef = useRef(null);

    const handleChange = (event) => {
        const { id, value } = event.target;
        setFormData({ ...formData, [id]: value });
    };

    const handleImagemChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreviewImagem(URL.createObjectURL(file));
        } else {
            setSelectedFile(null);
            setPreviewImagem(null);
        }
    };

    const validateForm = () => {
        let isValid = true;
        const errors = [];

        // Validação dos campos
        if (!formData.nome_completo.trim()) {
            errors.push('✖ Nome completo é obrigatório');
            isValid = false;
        }


        if (!formData.data_nascimento) {
            newErrors.data_nascimento = 'A data de nascimento é obrigatória.';
        } else if (formData.data_nascimento < 18 || formData.idade > 80) {
            newErrors.data_nascimento = 'A idade deve estar entre 18 e 80 anos.';
        if (!formData.idade || formData.idade < 18 || formData.idade > 80) {
            errors.push('✖ Idade deve ser entre 18 e 80 anos');
            isValid = false;

        }

        if (!/^\d{11}$/.test(formData.cpf)) {
            errors.push('✖ CPF deve ter 11 dígitos');
            isValid = false;
        }

        if (!/^[0-9]{6}\/[A-Z]{2}$/.test(formData.crm)) {
            errors.push('✖ Formato CRM inválido (ex: 123456/SP)');
            isValid = false;
        }

        if (!/^\d{10,11}$/.test(formData.telefone)) {
            errors.push('✖ Telefone deve ter 10 ou 11 dígitos');
            isValid = false;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email_corporativo)) {
            errors.push('✖ Email corporativo inválido');
            isValid = false;
        }

        if (!formData.senha_corporativa.trim()) {
            errors.push('✖ Senha corporativa é obrigatória');
            isValid = false;
        }

        // Validação da imagem
        if (!selectedFile) {
            errors.push('✖ Foto do médico é obrigatória');
            isValid = false;
        } else {
            const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
            if (!allowedTypes.includes(selectedFile.type)) {
                errors.push('✖ Formato de imagem inválido (use JPEG, PNG ou GIF)');
                isValid = false;
            }
            
            if (selectedFile.size > 2 * 1024 * 1024) {
                errors.push('✖ A imagem deve ter no máximo 2MB');
                isValid = false;
            }
        }

        // Mostrar erros
        if (errors.length > 0) {
            errors.forEach(error => toast.error(error, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            }));
        }

        return isValid;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsSubmitting(true);

        if (!validateForm()) {
            setIsSubmitting(false);
            return;
        }

        const formDataToSend = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            formDataToSend.append(key, value);
        });
        formDataToSend.append('foto', selectedFile);

        try {
            await axios.post('http://localhost:5000/medico/cadastro', formDataToSend, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            toast.success('✅ Médico cadastrado com sucesso!', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });

            // Resetar formulário
            setFormData({
                nome_completo: '',
                data_nascimento: '',
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
            if (fileInputRef.current) fileInputRef.current.value = '';

        } catch (error) {
            let errorMessage = 'Erro no cadastro. Tente novamente.';
            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            }
            toast.error(`✖ ${errorMessage}`, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <Header />
            <ToastContainer />
            
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
                                />
                            </div>
                            
                            <div className="form-groupAdm">
                                <label htmlFor="data_nascimento">Data de Nascimento:</label>
                                <input
                                    type="date"
                                    id="data_nascimento"
                                    value={formData.data_nascimento}
                                    onChange={handleChange}

                                    className={errors.data_nascimento ? 'input-error' : ''}
                                />
                                {errors.data_nascimento && <span className="error-message">{errors.data_nascimento}</span>}

                           

                            </div>
                            
                            <div className="form-groupAdm">
                                <label htmlFor="cpf">CPF:</label>
                                <input
                                    type="text"
                                    id="cpf"
                                    value={formData.cpf}
                                    onChange={handleChange}
                                    placeholder='00000000000'
                                />
                            </div>
                            
                            <div className="form-groupAdm">
                                <label htmlFor="crm">CRM:</label>
                                <input
                                    type="text"
                                    id="crm"
                                    value={formData.crm}
                                    onChange={handleChange}
                                    placeholder='123456/SP'
                                />
                            </div>
                            
                            <div className="form-groupAdm">
                                <label htmlFor="telefone">Telefone:</label>
                                <input
                                    type="text"
                                    id="telefone"
                                    value={formData.telefone}
                                    onChange={handleChange}
                                    placeholder='(DDD)000000000'
                                />
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
                                />
                            </div>
                            
                            <div className="form-groupSegundo">
                                <label htmlFor="especialidade">Especialidade:</label>
                                <select
                                    id="especialidade"
                                    value={formData.especialidade}
                                    onChange={handleChange}
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
                            </div>
                            
                            <div className="form-groupSegundo">
                                <label htmlFor="nacionalidade">Nacionalidade:</label>
                                <input
                                    type="text"
                                    id="nacionalidade"
                                    value={formData.nacionalidade}
                                    onChange={handleChange}
                                />
                            </div>
                            
                            <div className="form-groupSegundo">
                                <label htmlFor="email_corporativo">Email Corporativo:</label>
                                <input
                                    type="email"
                                    id="email_corporativo"
                                    value={formData.email_corporativo}
                                    onChange={handleChange}
                                    placeholder='exemplo@gmail.com'
                                />
                            </div>
                            
                            <div className="form-groupSegundo">
                                <label htmlFor="senha_corporativa">Senha Corporativa:</label>
                                <input
                                    type="password"
                                    id="senha_corporativa"
                                    value={formData.senha_corporativa}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="imagem">Foto do Médico</label>
                        <input
                            className="img"
                            type="file"
                            id="imagem"
                            accept="image/*"
                            onChange={handleImagemChange}
                            ref={fileInputRef}
                        />
                    </div>

                    {previewImagem && (
                        <div className="imgPreview">
                            <img src={previewImagem} alt="Pré-visualização" className="imgPreviewImage" />
                        </div>
                    )}

                    <button 
                        type="submit" 
                        className="botaoCadastrar"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Cadastrando...' : 'Cadastrar'}
                    </button>
                </form>
            </div>
            <Footer />
        </>
    );
}