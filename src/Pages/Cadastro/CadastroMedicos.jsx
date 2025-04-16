import React, { useState, useRef } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useTheme } from '../../context/ThemeContext';
import './cadastroMedicos.css';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';

export default function CadastroMedicos() {
    const { isDarkMode } = useTheme();
    const [formData, setFormData] = useState({
        nome_completo: '',
        dataNascimento: '',
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
    const [errors, setErrors] = useState({ dataNascimento: '' });
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
        const newErrors = { dataNascimento: '' };
        const validationErrors = [];

        if (!formData.nome_completo.trim()) {
            validationErrors.push('✖ Nome completo é obrigatório');
            isValid = false;
        }

        if (!formData.dataNascimento) {
            newErrors.dataNascimento = 'A data de nascimento é obrigatória.';
            isValid = false;
        } else {
            const birthDate = new Date(formData.dataNascimento);
            const today = new Date();
            let age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();

            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }

            if (age < 18 || age > 80) {
                newErrors.dataNascimento = 'A idade deve estar entre 18 e 80 anos.';
                validationErrors.push('✖ Idade deve ser entre 18 e 80 anos');
                isValid = false;
            }
        }

        if (!/^\d{11}$/.test(formData.cpf)) {
            validationErrors.push('✖ CPF deve ter 11 dígitos');
            isValid = false;
        }

        if (!/^[0-9]{6}\/[A-Z]{2}$/.test(formData.crm)) {
            validationErrors.push('✖ Formato CRM inválido (ex: 123456/SP)');
            isValid = false;
        }

        if (!/^\d{10,11}$/.test(formData.telefone)) {
            validationErrors.push('✖ Telefone deve ter 10 ou 11 dígitos');
            isValid = false;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email_corporativo)) {
            validationErrors.push('✖ Email corporativo inválido');
            isValid = false;
        }

        if (!formData.senha_corporativa.trim()) {
            validationErrors.push('✖ Senha corporativa é obrigatória');
            isValid = false;
        }

        if (!selectedFile) {
            validationErrors.push('✖ Foto do médico é obrigatória');
            isValid = false;
        } else {
            const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
            if (!allowedTypes.includes(selectedFile.type)) {
                validationErrors.push('✖ Formato de imagem inválido (use JPEG, PNG ou GIF)');
                isValid = false;
            }

            if (selectedFile.size > 2 * 1024 * 1024) {
                validationErrors.push('✖ A imagem deve ter no máximo 2MB');
                isValid = false;
            }
        }

        setErrors(newErrors);

        if (validationErrors.length > 0) {
            validationErrors.forEach(error => toast.error(error, {
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

            setFormData({
                nome_completo: '',
                dataNascimento: '',
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

            <div className={`background ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
                <form onSubmit={handleSubmit} className={`formularioAdm ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
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
                                <label htmlFor="dataNascimento">Data de Nascimento:</label>
                                <input
                                    type="date"
                                    id="dataNascimento"
                                    value={formData.dataNascimento}
                                    onChange={handleChange}
                                    className={errors.dataNascimento ? 'input-error' : ''}
                                />
                                {errors.dataNascimento && <span className="error-message">{errors.dataNascimento}</span>}
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
                        className={`botaoCadastrar ${isDarkMode ? 'dark-mode' : 'light-mode'}`}
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