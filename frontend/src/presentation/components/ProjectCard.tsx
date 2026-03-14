import { useSafeTranslation } from '../hooks/useSafeTranslation';
import type { Project } from '../../domain/models';
import { buildAssetUrl } from '../../domain/services/api';
import './ProjectCard.css';

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick }) => {
  const { t, translateField } = useSafeTranslation();
  let safeTechStack: string[] = [];

  if (Array.isArray(project.techStack)) {
    safeTechStack = project.techStack as string[];
  } else if (typeof project.techStack === 'string') {
    try { safeTechStack = JSON.parse(project.techStack); } catch { safeTechStack = []; }
  }

  let imagesArr: string[] = [];
  const projectAsAny = project as unknown as Record<string, unknown>;
  if (Array.isArray(projectAsAny.images)) {
    imagesArr = projectAsAny.images as string[];
  } else if (typeof projectAsAny.images === 'string') {
    try { imagesArr = JSON.parse(projectAsAny.images as string); } catch { imagesArr = []; }
  }

  const coverImage = imagesArr[0] || project.imageUrl;

  const statusClass = project.status === 'DEPLOYED' ? 'status-deployed' : project.status === 'ARCHIVED' ? 'status-archived' : 'status-dev';

  return (
    <div className="mac-card project-card" onClick={onClick}>
      {coverImage ? (
        <div className="project-image-container">
          <img src={buildAssetUrl(coverImage)} alt={translateField(project, 'title')} className="project-image" />
        </div>
      ) : (
        <div className="project-image-placeholder">
          <span>{t(`labels.categories.${project.category}`)}</span>
        </div>
      )}

      <div className="project-content">
        <div className="project-header">
          <span className="tech-badge" style={{ fontSize: '0.7rem' }}>{t(`labels.categories.${project.category}`)}</span>
          <span className={`project-status ${statusClass}`}>
            {t(`labels.status.${project.status}`)}
          </span>
        </div>

        <h3 className="project-title">{translateField(project, 'title')}</h3>
        <p className="project-desc">{translateField(project, 'description') || t('common.no_description')}</p>

        <div className="project-tech">
          {safeTechStack.slice(0, 3).map(tech => (
            <span key={tech} className="tech-pill">{tech}</span>
          ))}
          {safeTechStack.length > 3 && (
            <span className="tech-pill">+{safeTechStack.length - 3}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;