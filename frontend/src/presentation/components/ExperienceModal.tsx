import React, { useState, useEffect } from 'react';
import type { Experience, IutCompetence, Skill } from '../../domain/models';
import { PortfolioService } from '../../domain/services/portfolio.service';
import SkillBar from './SkillBar';
import './Modal.css'; // On utilise le nouveau CSS globalisé des modales

interface ExperienceModalProps {
  experience: Experience;
  onClose: () => void;
}

const ExperienceModal: React.FC<ExperienceModalProps> = ({ experience, onClose }) => {
  const [competences, setCompetences] = useState<IutCompetence[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [allSkills, allCompetences] = await Promise.all([
          PortfolioService.getSkills(),
          PortfolioService.getIutCompetences()
        ]);

        const experienceCompetences = allCompetences.filter(c =>
          experience.competencesIds.includes(c.id)
        );

        setSkills(allSkills);
        setCompetences(experienceCompetences);
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [experience]);

  if (loading) {
    return (
      <div className="tech-modal" onClick={e => e.stopPropagation()} style={{ alignItems: 'center', justifyContent: 'center', padding: '3rem' }}>
        <p className="modal-title" style={{ fontSize: '1.2rem' }}>Chargement...</p>
      </div>
    );
  }

  return (
    <div className="tech-modal" onClick={e => e.stopPropagation()}>
      <button className="close-button" onClick={onClose}>&times;</button>

      <div className="modal-content-scroll">
        {experience.imageUrl && (
          <img
            src={`http://localhost:3001${experience.imageUrl}`}
            alt={experience.title}
            className="modal-header-image"
          />
        )}

        <div className="modal-body-padding">
          <h2 className="modal-title">{experience.title}</h2>
          <div className="modal-meta">
            <span className="tech-badge">{experience.company}</span>
            <span className="tech-badge" style={{ borderColor: '#ff3300', color: '#ff3300' }}>{experience.period}</span>
          </div>

          <div className="modal-grid">
            {/* Colonne de gauche (principale) */}
            <div>
              <h3 className="modal-section-title">Détails du parcours</h3>
              <p className="modal-text">{experience.longDescription}</p>

              <h3 className="modal-section-title" style={{ margin: '1.8rem 0 0 0' }}>Compétences Techniques Globales</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', margin: '1rem 0 0 0' }}>
                {skills.map(skill => (
                  <SkillBar key={skill.id} name={skill.name} mastery={skill.mastery} />
                ))}
              </div>
            </div>

            {/* Colonne de droite (sidebar) */}
            <div>
              <h3 className="modal-section-title">Compétences IUT mobilisées</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                {competences.length > 0 ? (
                  competences.map(comp => (
                    <div key={comp.id} className="tech-badge" style={{ whiteSpace: 'normal', textAlign: 'left', background: 'rgba(0, 255, 204, 0.02)' }}>
                      {comp.name}
                    </div>
                  ))
                ) : (
                  <p className="modal-text" style={{ fontStyle: 'italic', opacity: 0.7 }}>Aucune compétence IUT spécifique liée.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExperienceModal;