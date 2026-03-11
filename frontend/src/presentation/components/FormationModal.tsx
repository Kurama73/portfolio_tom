import { useSafeTranslation } from '../hooks/useSafeTranslation';
import type { Formation } from '../../domain/models';
import './Modal.css';

interface FormationModalProps {
  formation: Formation;
  onClose: () => void;
}

const FormationModal: React.FC<FormationModalProps> = ({ formation, onClose }) => {
  const { t, translateField, translateArray } = useSafeTranslation();
  const hardSkills = translateArray(formation, 'hardSkills');
  const softSkills = translateArray(formation, 'softSkills');

  return (
    <div className="tech-modal animate-fade-in" onClick={e => e.stopPropagation()}>
      <button className="close-button" onClick={onClose}>&times;</button>
      <div className="modal-content-scroll">

        <div className="modal-body-padding" style={{ marginTop: '3rem' }}>
          <h2 className="modal-title">{translateField(formation, 'title')}</h2>
          <div className="modal-meta">
            <span className="tag tag-tech">{translateField(formation, 'institution')}</span>
            <span className="tag tag-soft">{translateField(formation, 'period')}</span>
            {formation.type && <span className="tag tag-hard">{t(`labels.types.${formation.type}`)}</span>}
          </div>

          <div className="modal-grid">
            <div>
              <h3 className="modal-section-title">{t('modals.formation.program')}</h3>
              <p className="modal-text">{translateField(formation, 'longDescription') || translateField(formation, 'description')}</p>
            </div>

            <div>
              <h3 className="modal-section-title">{t('modals.formation.tech_skills')}</h3>
              <div className="skills-group">
                {hardSkills.length > 0 ? (
                  hardSkills.map((skill: string, index: number) => <span key={index} className="tag tag-hard">{skill}</span>)
                ) : <span className="modal-text" style={{ fontStyle: 'italic' }}>{t('modals.formation.ongoing')}</span>}
              </div>

              <h3 className="modal-section-title">{t('modals.formation.soft_skills')}</h3>
              <div className="skills-group">
                {softSkills.length > 0 ? (
                  softSkills.map((skill: string, index: number) => <span key={index} className="tag tag-soft">{skill}</span>)
                ) : <span className="modal-text" style={{ fontStyle: 'italic' }}>{t('modals.formation.unspecified')}</span>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormationModal;