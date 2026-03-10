import React from 'react';
import type { ProfessionalExperience } from '../../domain/models';
import './Modal.css';

interface ProfExperienceModalProps {
  experience: ProfessionalExperience;
  onClose: () => void;
}

const ProfExperienceModal: React.FC<ProfExperienceModalProps> = ({ experience, onClose }) => {
  return (
    <div className="tech-modal animate-fade-in" onClick={e => e.stopPropagation()}>
      <button className="close-button" onClick={onClose}>&times;</button>
      <div className="modal-content-scroll">

        <div className="modal-body-padding" style={{ marginTop: '3rem' }}>
          <h2 className="modal-title">{experience.title}</h2>
          <div className="modal-meta">
            <span className="tag tag-tech">{experience.company}</span>
            <span className="tag tag-soft">{experience.period}</span>
            {experience.type && <span className="tag tag-hard">{experience.type}</span>}
          </div>

          <div className="modal-grid">
            <div>
              <h3 className="modal-section-title">Missions & Réalisations</h3>
              <div className="missions-grid">
                {experience.missions?.length > 0 ? (
                  experience.missions.map((mission, index) => (
                    <div key={index} className="mission-card">
                      <p style={{ color: '#ddd', fontSize: '0.95rem', margin: 0, lineHeight: 1.5 }}>
                        {mission}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="modal-text" style={{ fontStyle: 'italic' }}>Détails des missions restreints.</p>
                )}
              </div>

              <div style={{ marginTop: '2.5rem' }}>
                <h3 className="modal-section-title">Contexte Opérationnel</h3>
                <p className="modal-text">{experience.longDescription || experience.description}</p>
              </div>
            </div>

            <div>
              <h3 className="modal-section-title">Compétences Techniques</h3>
              <div className="skills-group">
                {experience.hardSkills?.length > 0 ? (
                  experience.hardSkills.map((skill, index) => <span key={index} className="tag tag-hard">{skill}</span>)
                ) : <span className="modal-text" style={{ fontStyle: 'italic' }}>Non spécifiées</span>}
              </div>

              <h3 className="modal-section-title">Soft Skills</h3>
              <div className="skills-group">
                {experience.softSkills?.length > 0 ? (
                  experience.softSkills.map((skill, index) => <span key={index} className="tag tag-soft">{skill}</span>)
                ) : <span className="modal-text" style={{ fontStyle: 'italic' }}>Non spécifiées</span>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfExperienceModal;