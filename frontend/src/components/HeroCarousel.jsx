import React, { useState, useEffect } from 'react';
import './HeroCarousel.css';

const slides = [
  {
    image: '../assets/images/logo_Exito.PNG',
    alt: 'Slide 1',
    overlayText: 'Organiza tu hogar con estilo',
  },
  {
    image: '../assets/images/logo_Exito.PNG',
    alt: 'Slide 2',
    overlayText: 'Encuentra lo mejor en lácteos',
  },
  {
    image: '../assets/images/logo_Exito.PNG',
    alt: 'Slide 3',
    overlayText: '¡Aprovecha nuestras ofertas!',
  },
];

const HeroCarousel = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(prev => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="hero-carousel">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`slide ${index === current ? 'active' : ''}`}
          style={{ backgroundImage: `url(${slide.image})` }}
        >
          <div className="overlay">
            <h2>{slide.overlayText}</h2>
          </div>
        </div>
      ))}

      <div className="dots">
        {slides.map((_, idx) => (
          <button
            key={idx}
            className={idx === current ? 'dot active' : 'dot'}
            onClick={() => setCurrent(idx)}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroCarousel;
