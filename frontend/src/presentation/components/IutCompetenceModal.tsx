import { useSafeTranslation } from '../hooks/useSafeTranslation';
import type { Project, IutCompetence } from '../../domain/models';
import { PortfolioService } from '../../domain/services/portfolio.service';
import SkillBar from './SkillBar';
import './Modal.css';

interface IutCompetenceModalProps {
  competence: IutCompetence;
  projects: Project[];
  onClose: () => void;
  onOpenProject: (project: Project) => void;
}

const IutCompetenceModal: React.FC<IutCompetenceModalProps> = ({ competence, projects, onClose, onOpenProject }) => {
  const { t, translateField } = useSafeTranslation();
  const linkedProjects = PortfolioService.getProjectsByCompetence(projects, competence.id);

  return (
    <div className="tech-modal animate-fade-in" onClick={e => e.stopPropagation()}>
      <button className="close-button" onClick={onClose}>&times;</button>
      <div className="modal-content-scroll">
        <div className="modal-body-padding">
          <h2 className="modal-title">{translateField(competence, 'name')}</h2>
          <div className="modal-meta">
            <span className="tech-badge" style={{ borderColor: '#00ffcc', color: '#00ffcc' }}>{t('iut.title')}</span>
          </div>

          <div className="modal-grid" style={{ gridTemplateColumns: '1fr' }}>
            <div>
              <h3 className="modal-section-title">{t('iut.competence_analysis')}</h3>
              <p className="modal-text">{translateField(competence, 'description')}</p>
              <div style={{ marginTop: '2rem', marginBottom: '1rem', maxWidth: '400px' }}>
                <SkillBar name={t('iut.level_label')} mastery={competence.level} />
              </div>
            </div>

            {linkedProjects.length > 0 && (
              <div style={{ marginTop: '2rem' }}>
                <h3 className="modal-section-title">{t('iut.acquisition_proofs')}</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem', marginTop: '1.5rem' }}>
                  {linkedProjects.map(p => (
                    <div
                      key={p.id}
                      className="mac-card"
                      style={{ padding: '1.5rem', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '1rem', background: 'rgba(255, 255, 255, 0.02)' }}
                      onClick={() => onOpenProject(p)}
                    >
                      <h4 style={{ color: 'white', fontSize: '1.2rem', fontFamily: 'var(--font-display)' }}>{translateField(p, 'title')}</h4>
                      <p style={{ color: '#888', fontSize: '0.9rem', flex: 1, textAlign: 'justify' }}>{translateField(p, 'description')?.substring(0, 80) + '...'}</p>
                      <span className="tech-badge" style={{ width: 'fit-content', borderColor: 'var(--primary-color)', color: 'white' }}>
                        Ouvrir le projet ▹
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IutCompetenceModal;