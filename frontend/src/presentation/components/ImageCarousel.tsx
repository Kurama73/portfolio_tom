import React, { useState } from 'react';
import './Modal.css';

interface ImageCarouselProps {
  images: string[];
  alt: string;
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({ images, alt }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) return null;

  const handlePrev = () => setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  const handleNext = () => setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));

  return (
    <div className="modal-carousel-container">
      <img src={images[currentIndex]} alt={`${alt} - vue ${currentIndex + 1}`} className="carousel-image animate-fade-in" key={currentIndex} />
      <div className="carousel-gradient"></div>

      {images.length > 1 && (
        <>
          <button className="carousel-btn prev" onClick={handlePrev}>&larr;</button>
          <button className="carousel-btn next" onClick={handleNext}>&rarr;</button>
          <div className="carousel-dots">
            {images.map((_, idx) => (
              <span key={idx} className={`dot-indicator ${idx === currentIndex ? 'active' : ''}`} onClick={() => setCurrentIndex(idx)} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ImageCarousel;