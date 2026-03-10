import React from 'react';
import type { Formation } from '../../domain/models';
import './Modal.css';

interface FormationModalProps {
  formation: Formation;
  onClose: () => void;
}

const FormationModal: React.FC<FormationModalProps> = ({ formation, onClose }) => {
  const hardSkills = formation.hardSkills || [];
  const softSkills = formation.softSkills || [];

  return (
    <div className="tech-modal animate-fade-in" onClick={e => e.stopPropagation()}>
      <button className="close-button" onClick={onClose}>&times;</button>
      <div className="modal-content-scroll">

        <div className="modal-body-padding" style={{ marginTop: '3rem' }}>
          <h2 className="modal-title">{formation.title}</h2>
          <div className="modal-meta">
            <span className="tag tag-tech">{formation.institution}</span>
            <span className="tag tag-soft">{formation.period}</span>
          </div>

          <div className="modal-grid">
            <div>
              <h3 className="modal-section-title">Programme & Objectifs</h3>
              <p className="modal-text">{formation.longDescription || formation.description}</p>
            </div>

            <div>
              <h3 className="modal-section-title">Compétences Techniques</h3>
              <div className="skills-group">
                {hardSkills.length > 0 ? (
                  hardSkills.map((skill, index) => <span key={index} className="tag tag-hard">{skill}</span>)
                ) : <span className="modal-text" style={{ fontStyle: 'italic' }}>En cours d'acquisition</span>}
              </div>

              <h3 className="modal-section-title">Compétences Transversales</h3>
              <div className="skills-group">
                {softSkills.length > 0 ? (
                  softSkills.map((skill, index) => <span key={index} className="tag tag-soft">{skill}</span>)
                ) : <span className="modal-text" style={{ fontStyle: 'italic' }}>Non spécifiées</span>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormationModal;