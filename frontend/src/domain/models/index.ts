// ==========================================
// ENUMS (Pour les formulaires et la cohérence)
// ==========================================
export const ProjectCategory = {
  Web: 'Web',
  Mobile: 'Mobile',
  Software: 'Software',
  Desktop: 'Desktop',
  System: 'System',
  Data: 'Data / IA',
  Network: 'Réseau & SysAdmin'
} as const;

export type ProjectCategory = typeof ProjectCategory[keyof typeof ProjectCategory];

export const ProjectStatus = {
  Deployed: 'Déployé',
  Development: 'En Développement',
  Archived: 'Archivé'
} as const;

export type ProjectStatus = typeof ProjectStatus[keyof typeof ProjectStatus];

// ==========================================
// INTERFACES (Les modèles de données)
// ==========================================
export interface Project {
  id: string;
  title: string;
  category: ProjectCategory;
  status: ProjectStatus;
  description: string;
  longDescription: string;
  techStack: string[];
  imageUrl?: string;
  github?: string;
  link?: string;
  competencesIds: string[];
  skillsIds: string[];
}

export interface IutCompetence {
  id: string;
  name: string;
  description: string;
  level: number;
}

export interface Skill {
  id: string;
  name: string;
  mastery: number;
  category?: string;
}

export interface Experience {
  id: string;
  title: string;
  company: string;
  period: string;
  description: string;
  longDescription?: string;
  imageUrl?: string;
}

export interface ProfessionalExperience extends Experience {
  type: string;
  missions: string[];
}

export interface Formation extends Experience {
  institution: string;
  type: string;
  hardSkills: string[];
  softSkills: string[];
}

export interface Passion {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
}

export interface SoftSkill {
  id: string;
  name: string;
}
