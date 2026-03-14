import React, { useState } from 'react';
import { buildAssetUrl } from '../../domain/services/api';
import './Modal.css';

interface ProjectGalleryProps {
  images: string[];
  alt: string;
  showGalleryOnly?: boolean;
}

const ProjectGallery: React.FC<ProjectGalleryProps> = ({ images, alt, showGalleryOnly = false }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);

  if (!images || images.length === 0) return null;

  const openFullscreen = (index: number) => {
    setCurrentIndex(index);
    setIsFullScreen(true);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  if (showGalleryOnly) {
    if (images.length <= 1) return null;
    return (
      <>
        <div className="gallery-section">
          <h3 className="modal-section-title">Galerie Photos</h3>
          <div className="gallery-grid">
            {images.map((img, idx) => (
              <div key={idx} className="gallery-item" onClick={() => openFullscreen(idx)}>
                <img src={buildAssetUrl(img)} alt={`${alt} - ${idx + 1}`} />
              </div>
            ))}
          </div>
        </div>

        {isFullScreen && (
          <FullscreenOverlay
            images={images}
            currentIndex={currentIndex}
            onClose={() => setIsFullScreen(false)}
            onPrev={handlePrev}
            onNext={handleNext}
            alt={alt}
          />
        )}
      </>
    );
  }

  return (
    <>
      <div className="hero-illustration-header" onClick={() => openFullscreen(0)}>
        <img src={buildAssetUrl(images[0])} alt={alt} />
        <div className="header-melt-gradient"></div>
      </div>

      {isFullScreen && (
        <FullscreenOverlay
          images={images}
          currentIndex={currentIndex}
          onClose={() => setIsFullScreen(false)}
          onPrev={handlePrev}
          onNext={handleNext}
          alt={alt}
        />
      )}
    </>
  );
};

const FullscreenOverlay: React.FC<{
  images: string[];
  currentIndex: number;
  onClose: () => void;
  onPrev: (e: React.MouseEvent) => void;
  onNext: (e: React.MouseEvent) => void;
  alt: string;
}> = ({ images, currentIndex, onClose, onPrev, onNext, alt }) => (
  <div className="full-screen-overlay" onClick={onClose}>
    <button className="close-fullscreen" onClick={onClose}>&times;</button>

    <img
      src={buildAssetUrl(images[currentIndex])}
      alt={alt}
      className="full-screen-image"
      onClick={(e) => e.stopPropagation()}
    />

    {images.length > 1 && (
      <>
        <button className="fs-nav-btn prev" onClick={onPrev}>&larr;</button>
        <button className="fs-nav-btn next" onClick={onNext}>&rarr;</button>
        <div className="fs-counter">
          {currentIndex + 1} / {images.length}
        </div>
      </>
    )}
  </div>
);

export default ProjectGallery;