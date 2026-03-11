import { useSafeTranslation } from '../hooks/useSafeTranslation';
import type { ProfessionalExperience } from '../../domain/models';
import './Modal.css';

interface ProfExperienceModalProps {
  experience: ProfessionalExperience;
  onClose: () => void;
}

const ProfExperienceModal: React.FC<ProfExperienceModalProps> = ({ experience, onClose }) => {
  const { t, translateField, translateArray } = useSafeTranslation();

  const missions = translateArray(experience, 'missions');
  const hardSkills = translateArray(experience, 'hardSkills');
  const softSkills = translateArray(experience, 'softSkills');

  return (
    <div className="tech-modal animate-fade-in" onClick={e => e.stopPropagation()}>
      <button className="close-button" onClick={onClose}>&times;</button>
      <div className="modal-content-scroll">

        <div className="modal-body-padding" style={{ marginTop: '3rem' }}>
          <h2 className="modal-title">{translateField(experience, 'title')}</h2>
          <div className="modal-meta">
            <span className="tag tag-tech">{translateField(experience, 'company')}</span>
            <span className="tag tag-soft">{translateField(experience, 'period')}</span>
            {experience.type && <span className="tag tag-hard">{t(`labels.types.${experience.type}`)}</span>}
          </div>

          <div className="modal-grid">
            <div>
              <h3 className="modal-section-title">{t('modals.experience.missions')}</h3>
              <div className="missions-grid">
                {missions.length > 0 ? (
                  missions.map((mission, index) => (
                    <div key={index} className="mission-card">
                      <p style={{ color: '#ddd', fontSize: '0.95rem', margin: 0, lineHeight: 1.5, textAlign: 'justify' }}>
                        {mission}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="modal-text" style={{ fontStyle: 'italic' }}>{t('modals.experience.restricted')}</p>
                )}
              </div>

              <div style={{ marginTop: '2.5rem' }}>
                <h3 className="modal-section-title">{t('modals.experience.context')}</h3>
                <p className="modal-text">{translateField(experience, 'longDescription') || translateField(experience, 'description')}</p>
              </div>
            </div>

            <div>
              <h3 className="modal-section-title">{t('modals.experience.tech_skills')}</h3>
              <div className="skills-group">
                {hardSkills.length > 0 ? (
                  hardSkills.map((skill, index) => <span key={index} className="tag tag-hard">{skill}</span>)
                ) : <span className="modal-text" style={{ fontStyle: 'italic' }}>{t('modals.experience.unspecified')}</span>}
              </div>

              <h3 className="modal-section-title">{t('modals.experience.soft_skills')}</h3>
              <div className="skills-group">
                {softSkills.length > 0 ? (
                  softSkills.map((skill, index) => <span key={index} className="tag tag-soft">{skill}</span>)
                ) : <span className="modal-text" style={{ fontStyle: 'italic' }}>{t('modals.experience.unspecified')}</span>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfExperienceModal;