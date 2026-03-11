import React, { useState, useEffect } from 'react';
import { useSafeTranslation } from '../hooks/useSafeTranslation';
import type { Project, IutCompetence } from '../../domain/models';
import { PortfolioService } from '../../domain/services/portfolio.service';
import ImageCarousel from './ImageCarousel';
import './Modal.css';

interface ProjectModalProps {
  project: Project;
  onClose: () => void;
}

const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  const { t, translateField } = useSafeTranslation();
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
    try { safeTechStack = JSON.parse(project.techStack); } catch { safeTechStack = []; }
  }

  const imagesToDisplay = Array.isArray(project.images) && project.images.length > 0
    ? project.images
    : (project.imageUrl ? [project.imageUrl] : []);

  const title = translateField(project, 'title');

  return (
    <div className="tech-modal animate-fade-in" onClick={e => e.stopPropagation()}>
      <button className="close-button" onClick={onClose}>&times;</button>

      <div className="modal-content-scroll">
        {imagesToDisplay.length > 0 && (
          <ImageCarousel images={imagesToDisplay} alt={title} showGalleryOnly={false} />
        )}

        <div className="modal-body-padding" style={imagesToDisplay.length === 0 ? { marginTop: '3rem' } : {}}>
          <h2 className="modal-title">{title}</h2>
          <div className="modal-meta">
            <span className="tag tag-soft">{t(`labels.categories.${project.category}`)}</span>
          </div>

          <p className="modal-tagline">{translateField(project, 'description')}</p>

          <div className="modal-grid">
            <div>
              <h3 className="modal-section-title">{t('modals.project.analysis')}</h3>
              <p className="modal-text">{translateField(project, 'longDescription')}</p>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '2.5rem' }}>
                {project.github && <a href={project.github} target="_blank" rel="noreferrer" className="primary-button">{t('modals.project.github')}</a>}
                {project.link && <a href={project.link} target="_blank" rel="noreferrer" className="secondary-button" style={{ fontSize: '0.9rem' }}>{t('modals.project.live')}</a>}
              </div>
            </div>

            <div>
              <h3 className="modal-section-title">{t('modals.project.tech_stack')}</h3>
              <div className="skills-group">
                {safeTechStack.map(tech => (
                  <span key={tech} className="tag tag-tech">{tech}</span>
                ))}
              </div>

              {competences.length > 0 && (
                <>
                  <h3 className="modal-section-title" style={{ marginTop: '2.5rem' }}>{t('modals.project.iut_competences')}</h3>
                  <div className="skills-group">
                    {competences.map(comp => (
                      <span key={comp.id} className="tag tag-hard" style={{ width: '100%', textAlign: 'center' }}>
                        {translateField(comp, 'name')}
                      </span>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          <ImageCarousel images={imagesToDisplay} alt={title} showGalleryOnly={true} />
        </div>
      </div>
    </div>
  );
};

export default ProjectModal;