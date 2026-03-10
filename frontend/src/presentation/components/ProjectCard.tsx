import React from 'react';
import { Project } from '../../domain/models';
import './ProjectCard.css';

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick }) => {
  let safeTechStack: string[] = [];

  if (Array.isArray(project.techStack)) {
    safeTechStack = project.techStack;
  } else if (typeof project.techStack === 'string') {
    try { safeTechStack = JSON.parse(project.techStack); } catch (e) { safeTechStack = []; }
  }

  const coverImage = (project as any).images?.[0] || project.imageUrl;

  // Classe dynamique pour la couleur du statut
  const statusClass = project.status === 'Déployé' ? 'status-deployed' : project.status === 'Archivé' ? 'status-archived' : 'status-dev';

  return (
    <div className="mac-card project-card" onClick={onClick}>
      {coverImage ? (
        <div className="project-image-container">
          <img src={coverImage} alt={project.title} className="project-image" />
        </div>
      ) : (
        <div className="project-image-placeholder">
          <span>{project.category}</span>
        </div>
      )}

      <div className="project-content">
        <div className="project-header">
          <span className="tech-badge" style={{ fontSize: '0.7rem' }}>{project.category}</span>
          <span className={`project-status ${statusClass}`}>
            {project.status}
          </span>
        </div>

        <h3 className="project-title">{project.title}</h3>
        <p className="project-desc">{project.shortDescription || 'Aucune description disponible.'}</p>

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