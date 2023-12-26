import React from 'react'
import Carousel from 'react-bootstrap/Carousel';
import './galeriaImagenes.css';

function UncontrolledExample() {
  return (
    <Carousel className='imgContianer'>
      <Carousel.Item className='imgItem'>
      <img className='imgGaleria' src="/img/fotoHorizontal1.jpg" alt="modelo" />
        <Carousel.Caption>
          <h3>First slide label</h3>
          <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
      <img className='imgGaleria' src="/img/fotoHorizontal1.jpg" alt="modelo" />
        <Carousel.Caption>
          <h3>Second slide label</h3>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
      <img className='imgGaleria' src="/img/fotoHorizontal1.jpg" alt="modelo" />
        <Carousel.Caption>
          <h3>Third slide label</h3>
          <p>
            Praesent commodo cursus magna, vel scelerisque nisl consectetur.
          </p>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
  );
}

export default UncontrolledExample;