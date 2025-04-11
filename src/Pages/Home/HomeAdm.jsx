import React, { useState, useEffect } from 'react';
import { Carousel, Form, Card, Row, Col, Spinner } from 'react-bootstrap';
import './HomeAdm.css';
import axios from 'axios';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import 'bootstrap/dist/css/bootstrap.min.css';
import imagem1 from '../../assets/Img/administracao.png';
import imagem2 from '../../assets/Img/administracao.png';
import imagem3 from '../../assets/Img/administracao.png';

export default function HomeAdm() {
  const [medicos, setMedicos] = useState([]);
  const [especialidades, setEspecialidades] = useState([]);
  const [especialidadeSelecionada, setEspecialidadeSelecionada] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Busca os médicos da API
  useEffect(() => {
    const fetchMedicos = async () => {
      try {
        const response = await axios.get('http://localhost:5000/medico');
        const data = response.data;
        setMedicos(data);
        
        const especialidadesUnicas = [...new Set(data.map(m => m.especialidade))];
        setEspecialidades(especialidadesUnicas);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };
  
    fetchMedicos();
  }, []);

  // Filtra médicos por especialidade
  const medicosFiltrados = especialidadeSelecionada
    ? medicos.filter(medico => medico.especialidade === especialidadeSelecionada)
    : medicos;

  if (loading) {
    return (
      <div className="d-flex justify-content-center mt-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger mt-5">
        Erro: {error}
      </div>
    );
  }

  return (
    <div className="homePrincipal">
      <Header/>
      
      <div className="carrossel-container">
        <Carousel>
          <Carousel.Item interval={3000}>
            <img
              className="d-block w-100 carrossel-image"
              src={imagem1}
              alt="Slide 1"
            />
          </Carousel.Item>
          <Carousel.Item interval={3000}>
            <img
              className="d-block w-100 carrossel-image"
              src={imagem2}
              alt="Slide 2"
            />
          </Carousel.Item>
          <Carousel.Item interval={3000}>
            <img
              className="d-block w-100 carrossel-image"
              src={imagem3}
              alt="Slide 3"
            />
          </Carousel.Item>
        </Carousel>
      </div>

      {/* Seção de Filtro e Listagem */}
      <div className="container my-5">
        <h2 className="text-center mb-4 text-white">Nossos Médicos</h2>
        
        <div className="row mb-4">
          <div className="col-md-6 mx-auto">
            <Form.Group controlId="especialidadeFilter">
              <Form.Label className="text-white">Filtrar por Especialidade:</Form.Label>
              <Form.Control
                as="select"
                value={especialidadeSelecionada}
                onChange={(e) => setEspecialidadeSelecionada(e.target.value)}
              >
                <option value="">Todas as especialidades</option>
                {especialidades.map((especialidade, index) => (
                  <option key={index} value={especialidade}>
                    {especialidade}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </div>
        </div>

        <Row>
          {medicosFiltrados.length > 0 ? (
            medicosFiltrados.map((medico) => (
              <Col key={medico.id} md={4} className="mb-4">
                <Card className="h-100 shadow">
                  <Card.Body>
                    <Card.Title>{medico.nome}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">
                      {medico.especialidade}
                    </Card.Subtitle>
                    <Card.Text>
                      CRM: {medico.crm}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))
          ) : (
            <Col className="text-center text-white">
              <p>Nenhum médico encontrado{especialidadeSelecionada && ` na especialidade ${especialidadeSelecionada}`}.</p>
            </Col>
          )}
        </Row>
      </div>

      <Footer/>
    </div>
  );
}