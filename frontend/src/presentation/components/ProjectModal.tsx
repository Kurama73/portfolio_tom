import React, { useState, useEffect } from 'react';
import type { Project, IutCompetence } from '../../domain/models';
import { PortfolioService } from '../../domain/services/portfolio.service';
import ImageCarousel from './ImageCarousel';
import './Modal.css';

interface ProjectModalProps {
  project: Project;
  onClose: () => void;
}

const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  const [competences, setCompetences] = useState<IutCompetence[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const allCompetences = await PortfolioService.getIutCompetences();
        const ids = Array.isArray(project.competencesIds) ? project.competencesIds : [];
        setCompetences(allCompetences.filter(c => ids.includes(c.id)));
      } catch (e) {
        console.error("Error loading competences", e);
      }
    };
    loadData();
  }, [project]);

  let safeTechStack: string[] = [];
  if (Array.isArray(project.techStack)) {
    safeTechStack = project.techStack;
  } else if (typeof project.techStack === 'string') {
    try { safeTechStack = JSON.parse(project.techStack); } catch (e) { safeTechStack = []; }
  }

  const imagesToDisplay = Array.isArray(project.images) && project.images.length > 0
    ? project.images
    : (project.imageUrl ? [project.imageUrl] : []);

  return (
    <div className="tech-modal animate-fade-in" onClick={e => e.stopPropagation()}>
      <button className="close-button" onClick={onClose}>&times;</button>

      <div className="modal-content-scroll">
        {/* HERO ILLUSTRATION HEADER */}
        {imagesToDisplay.length > 0 && (
          <ImageCarousel images={imagesToDisplay} alt={project.title} showGalleryOnly={false} />
        )}

        <div className="modal-body-padding" style={imagesToDisplay.length === 0 ? { marginTop: '3rem' } : {}}>
          <h2 className="modal-title">{project.title}</h2>
          <div className="modal-meta">
            <span className="tag tag-soft">{project.category}</span>
          </div>

          <p className="modal-tagline">{project.description}</p>

          <div className="modal-grid">
            <div>
              <h3 className="modal-section-title">Analyse du Projet</h3>
              <p className="modal-text">{project.longDescription}</p>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '2.5rem' }}>
                {project.github && <a href={project.github} target="_blank" rel="noreferrer" className="primary-button">Code Source (GitHub)</a>}
                {project.link && <a href={project.link} target="_blank" rel="noreferrer" className="secondary-button" style={{ fontSize: '0.9rem' }}>Déploiement Live</a>}
              </div>
            </div>

            <div>
              <h3 className="modal-section-title">Stack Technique</h3>
              <div className="skills-group">
                {safeTechStack.map(tech => (
                  <span key={tech} className="tag tag-tech">{tech}</span>
                ))}
              </div>

              {competences.length > 0 && (
                <>
                  <h3 className="modal-section-title" style={{ marginTop: '2.5rem' }}>Compétences IUT</h3>
                  <div className="skills-group">
                    {competences.map(comp => (
                      <span key={comp.id} className="tag tag-hard" style={{ width: '100%', textAlign: 'center' }}>
                        {comp.name}
                      </span>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* GALERIE MINIATURES AU BAS DE LA MODALE */}
          <ImageCarousel images={imagesToDisplay} alt={project.title} showGalleryOnly={true} />
        </div>
      </div>
    </div>
  );
};

export default ProjectModal;