import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./loginAdm.css";
import adminImage from "../../assets/Img/administracao.png";
import { toast } from "react-toastify";

export default function LoginAdm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    senha: "",
  });

  const [error, setError] = useState({
    email: false,
    senha: false,
  });

  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError({ ...error, [name]: false });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.senha) {
      toast.error("Preencha todos os campos!");
      setError({ email: !formData.email, senha: !formData.senha });
      return;
    }

    const urlLogin = "http://localhost:3000/admin/login";

    try {
      const response = await axios.post(urlLogin, formData);
      login(
        response.data.result.nome,
        response.data.result.token,
        response.data.result.id,
      );

      setFormData({ email: "", senha: "" });
      navigate("/homeAdm");
    } catch (error) {
      console.error("Erro no login:", error.message);
      setError({ email: true, senha: true });
      toast.error(error.response.data.error);
    }
  };

  return (
    <div
      className="container-page-login-adm"
      style={{ backgroundImage: `url(${adminImage})` }}
    >
      <div className="container-formulario-login-adm">
        <h1 className="title-login-adm">Login Administrativo</h1>
        <form onSubmit={handleSubmit} className="form-login-adm">
          <div className="text-field-adm">
            <input
              className="input-login-adm"
              type="email"
              name="email"
              placeholder="Email corporativo"
              value={formData.email}
              onChange={handleChange}
              style={{ borderColor: error.email ? "red" : "" }}
            />
            {error.email && (
              <p className="error-message-adm">Campo obrigatório</p>
            )}
          </div>

          <div className="text-field-adm">
            <input
              className="input-login-adm"
              type="password"
              name="senha"
              placeholder="Senha"
              value={formData.senha}
              onChange={handleChange}
              style={{ borderColor: error.senha ? "red" : "" }}
            />
            {error.senha && (
              <p className="error-message-adm">Campo obrigatório</p>
            )}
          </div>

          <button type="submit" className="btn-login-adm">
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}
