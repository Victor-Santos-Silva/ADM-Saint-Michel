import React from 'react';
import { Carousel } from 'react-bootstrap';
import './HomeAdm.css';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import 'bootstrap/dist/css/bootstrap.min.css';
// Importe as imagens corretamente (verifique o caminho real)
import imagem1 from '../../assets/Img/administracao.png';
import imagem2 from '../../assets/Img/administracao.png';
import imagem3 from '../../assets/Img/administracao.png';

export default function HomeAdm() {
  // Verifique se as imagens foram importadas corretamente
  console.log('Imagem 1:', imagem1);
  
  return (
    <div className="homePrincipal">
      <Header/>
      
      <div className="carrossel-container">
        <Carousel>
          <Carousel.Item interval={3000}>
            <img
              className="d-block w-100 carrossel-image"
              src={imagem1} // Use a variável importada
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

      <Footer/>
    </div>
  );
}