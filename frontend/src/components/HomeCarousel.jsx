import React, { useState, useEffect } from 'react';
import './HomeCarousel.css';
import slide1 from '../assets/images/logo_Exito.PNG';
import slide2 from '../assets/images/logo_Exito.PNG';
import slide3 from '../assets/images/logo_Exito.PNG';

const slides = [
  { image: slide1, alt: 'Promo 1', text: 'Somos tu Tienda Favorita' },
  { image: slide2, alt: 'Promo 2', text: 'Somos tu Tienda Favorita' },
  { image: slide3, alt: 'Promo 3', text: 'Somos tu Tienda Favorita' },
];

const HomeCarousel = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="carousel-container">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`carousel-slide ${index === current ? 'active' : ''}`}
          style={{ backgroundImage: `url(${slide.image})` }}
        >
          <div className="overlay-text">{slide.text}</div>
        </div>
      ))}
      <div className="carousel-dots">
        {slides.map((_, idx) => (
          <span
            key={idx}
            className={`dot ${idx === current ? 'active' : ''}`}
            onClick={() => setCurrent(idx)}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default HomeCarousel;
