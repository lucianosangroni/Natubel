import React from "react";
import Carousel from "react-bootstrap/Carousel";
import "./galeriaImagenes.css";

function UncontrolledExample() {
  return (
    <Carousel className="imgContianer">
      <Carousel.Item>
        <img
          className="imgGaleria"
          src="/img/5carrousel.jpeg"
          alt="modelo"
        />
        <Carousel.Caption>
          {/* <h3>Second slide label</h3>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p> */}
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img
          className="imgGaleria"
          src="/img/1carrousel.jpg"
          alt="modelo"
        />
        <Carousel.Caption>
          {/* <h3>Third slide label</h3>
          <p>
            Praesent commodo cursus magna, vel scelerisque nisl consectetur.
          </p> */}
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img
          className="imgGaleria"
          src="/img/2carrousel.jpg"
          alt="modelo"
        />
        <Carousel.Caption>
          {/* <h3>Third slide label</h3>
          <p>
            Praesent commodo cursus magna, vel scelerisque nisl consectetur.
          </p> */}
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img
          className="imgGaleria"
          src="/img/3carrousel.jpeg"
          alt="modelo"
        />
        <Carousel.Caption>
          {/* <h3>Third slide label</h3>
          <p>
            Praesent commodo cursus magna, vel scelerisque nisl consectetur.
          </p> */}
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img
          className="imgGaleria"
          src="/img/4carrousel.jpeg"
          alt="modelo"
        />
        <Carousel.Caption>
          {/* <h3>Third slide label</h3>
          <p>
            Praesent commodo cursus magna, vel scelerisque nisl consectetur.
          </p> */}
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
  );
}

export default UncontrolledExample;