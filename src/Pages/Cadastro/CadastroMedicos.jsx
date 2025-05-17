import React, { useState, useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useTheme } from '../../context/ThemeContext';
import './cadastroMedicos.css';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import { IMaskInput } from 'react-imask';

export default function CadastroMedicos() {
    const { darkMode } = useTheme();
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

    const handleChange = (eOrName, value) => {
        if (eOrName && eOrName.target) {
            const { id, value } = eOrName.target;
            setFormData(prev => ({ ...prev, [id]: value }));
        }
        else {
            setFormData(prev => ({ ...prev, [eOrName]: value }));
        }
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

    const getCepData = async (cep) => {
        try {
            const response = await axios.get(`http://localhost:5000/cep/${cep}`);
            const data = response.data;

            setFormData(prev => ({
                ...prev,
                logradouro: data.logradouro,
                bairro: data.bairro,
                cidade: data.cidade,
                estado: data.estado,
                endereco: `${data.logradouro}, ${data.bairro}, ${data.cidade} - ${data.estado}`
            }));
        } catch (error) {
            console.error('Erro ao buscar o CEP:', error);
            toast.error("CEP inválido ou não encontrado.", {
                position: "top-right",
                autoClose: 5000,
                theme: darkMode ? 'dark' : 'light'
            });
        }
    };
    const handleCepChange = (e) => {
        const cep = e.target.value;
        setFormData(prev => ({ ...prev, cep }));

        // Quando o cep estiver completo (ex: 8 dígitos sem traço), busca os dados
        const cepNumeros = cep.replace(/\D/g, '');
        if (cepNumeros.length === 8) {
            getCepData(cepNumeros);
        }
    };

    //validar dados do formulário
    const validateForm = () => {
        let isValid = true;
        const newErrors = { dataNascimento: '' };
        const validationErrors = [];

        if (!formData.nome_completo.trim()) {
            validationErrors.push('Nome completo é obrigatório');
            isValid = false;
        }

        if (!formData.dataNascimento || formData.dataNascimento.trim() === '') {
            newErrors.dataNascimento = 'A data de nascimento é obrigatória.';
            validationErrors.push('A data de nascimento é obrigatória.');
            isValid = false;
        } else {
            const birthDate = new Date(formData.dataNascimento);
            const today = new Date();

            if (isNaN(birthDate.getTime())) {
                newErrors.dataNascimento = 'Data de nascimento inválida.';
                validationErrors.push('Data de nascimento inválida.');
                isValid = false;
            } else {
                let age = today.getFullYear() - birthDate.getFullYear();
                const monthDiff = today.getMonth() - birthDate.getMonth();

                if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                    age--;
                }

                if (age < 18 || age > 80) {
                    newErrors.dataNascimento = 'A idade deve estar entre 18 e 80 anos.';
                    validationErrors.push('A idade deve estar entre 18 e 80 anos.');
                    isValid = false;
                }
            }
        }
        function validarCPF(cpf) {
            cpf = cpf.replace(/[^\d]+/g, ''); // Remove tudo que não é número

            if (cpf.length !== 11) return false;

            // Elimina CPFs inválidos conhecidos
            if (/^(\d)\1{10}$/.test(cpf)) return false;

            let soma = 0;
            let resto;

            for (let i = 1; i <= 9; i++) {
                soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
            }

            resto = (soma * 10) % 11;
            if (resto === 10 || resto === 11) resto = 0;
            if (resto !== parseInt(cpf.substring(9, 10))) return false;

            soma = 0;
            for (let i = 1; i <= 10; i++) {
                soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
            }

            resto = (soma * 10) % 11;
            if (resto === 10 || resto === 11) resto = 0;
            if (resto !== parseInt(cpf.substring(10, 11))) return false;

            return true;
        }

        if (!validarCPF(formData.cpf)) {
            validationErrors.push('CPF inválido');
            isValid = false;
        }

        const crm = formData.crm.trim().toUpperCase();

        if (!/^[0-9]{6}\/[A-Z]{2}$/.test(crm)) {
            validationErrors.push('Formato CRM inválido (ex: 123456/SP)');
            isValid = false;
        }

        const phone = formData.telefone.replace(/\D/g, ''); // Remove tudo que não é dígito

        if (!/^\d{10,11}$/.test(phone)) {
            validationErrors.push('Telefone deve ter 10 ou 11 dígitos numéricos');
            isValid = false;
        }

        const dominiosPermitidos = ["@hsaintmichel.com"];

        function validarEmailCorporativo(email) {
            return dominiosPermitidos.some(dominio => email.endsWith(dominio));
        }

        if (!validarEmailCorporativo(formData.email_corporativo)) {
            validationErrors.push("O email deve ser corporativo (ex: @hsaintmichel.com)");
            isValid = false;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email_corporativo)) {
            validationErrors.push("Email corporativo inválido");
            isValid = false;
        }

        if (!formData.senha_corporativa.trim()) {
            validationErrors.push('Senha corporativa é obrigatória');
            isValid = false;
        }

        if (!selectedFile) {
            validationErrors.push('Foto do médico é obrigatória');
            isValid = false;
        } else {
            const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
            if (!allowedTypes.includes(selectedFile.type)) {
                validationErrors.push('Formato de imagem inválido (use JPEG, PNG ou GIF)');
                isValid = false;
            }

            if (selectedFile.size > 2 * 1024 * 1024) {
                validationErrors.push('A imagem deve ter no máximo 2MB');
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
                theme: darkMode ? 'dark' : 'light'
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

            toast.success('Médico cadastrado com sucesso!', {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: darkMode ? 'dark' : 'light'
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
            toast.error(`${errorMessage}`, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: darkMode ? 'dark' : 'light'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={`page-container ${darkMode ? 'dark-mode' : 'light-mode'}`}>
            <Header />
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
                                    maxLength={50}
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
                                    min="1950-01-01" // impede datas muito antigas
                                    max={new Date().toISOString().split("T")[0]} // impede datas futuras
                                />
                            </div>

                            <div className="form-groupAdm">
                                <label htmlFor="cpf">CPF:</label>
                                <IMaskInput
                                    mask="000.000.000-00"
                                    value={formData.cpf}
                                    onAccept={(value) => handleChange('cpf', value)}
                                    id="cpf"
                                    placeholder="000.000.000-00"
                                    className="seu-estilo"
                                />
                            </div>

                            <div className="form-groupAdm">
                                <label htmlFor="crm">CRM:</label>
                                <input
                                    type="text"
                                    id="crm"
                                    value={formData.crm}
                                    onChange={handleChange}
                                    placeholder="123456/SP"
                                    maxLength={9}
                                    style={{ textTransform: 'uppercase' }}
                                />
                            </div>

                            <div className="form-groupAdm">
                                <label htmlFor="telefone">Telefone:</label>
                                <IMaskInput
                                    mask="(00) 00000-0000"
                                    type="text"
                                    id="telefone"
                                    value={formData.telefone}
                                    onAccept={(value) => handleChange('telefone', value)}
                                    placeholder="(11) 91234-5678"
                                />
                            </div>
                        </div>

                        <div className="coluna-vertical">
                            <div className="form-groupSegundo">
                                <label htmlFor="cep">CEP:</label>
                                <input
                                    type="text"
                                    id="cep"
                                    value={formData.cep}
                                    onChange={handleCepChange}
                                    placeholder="Digite o CEP"
                                    maxLength={9}
                                />
                            </div>

                            <div className="form-groupSegundo">
                                <label>Logradouro:</label>
                                <input type="text" value={formData.logradouro} readOnly />
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
        </div>
    );
}