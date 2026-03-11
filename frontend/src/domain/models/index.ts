export const ProjectCategory = {
  WEB: 'WEB',
  MOBILE: 'MOBILE',
  SOFTWARE: 'SOFTWARE',
  DESKTOP: 'DESKTOP',
  SYSTEM: 'SYSTEM',
  DATA: 'DATA',
  NETWORK: 'NETWORK'
} as const;

export type ProjectCategory = typeof ProjectCategory[keyof typeof ProjectCategory];

export const ProjectStatus = {
  DEPLOYED: 'DEPLOYED',
  DEVELOPMENT: 'DEVELOPMENT',
  ARCHIVED: 'ARCHIVED'
} as const;

export type ProjectStatus = typeof ProjectStatus[keyof typeof ProjectStatus];

export const ExperienceType = {
  INTERNSHIP: 'INTERNSHIP',
  APPRENTICESHIP: 'APPRENTICESHIP',
  EDUCATION: 'EDUCATION',
  WORK: 'WORK',
  PRO: 'PRO'
} as const;

export type ExperienceType = typeof ExperienceType[keyof typeof ExperienceType];

export interface Project {
  id: string;
  title: string;
  titleEn?: string;
  category: ProjectCategory;
  status: ProjectStatus;
  description: string;
  descriptionEn?: string;
  longDescription: string;
  longDescriptionEn?: string;
  techStack: string[];
  imageUrl?: string;
  github?: string;
  link?: string;
  competencesIds: string[];
  skillsIds: string[];
  images: string[];
  startDate?: string;
}

export interface IutCompetence {
  id: string;
  name: string;
  nameEn?: string;
  description: string;
  descriptionEn?: string;
  level: number;
}

export interface Skill {
  id: string;
  name: string;
  mastery: number;
  category?: string;
  icon?: string;
}

export interface Experience {
  id: string;
  title: string;
  titleEn?: string;
  company: string;
  companyEn?: string;
  period: string; // Maintain for legacy if needed, but per-field translation is better
  periodEn?: string;
  description: string;
  descriptionEn?: string;
  longDescription?: string;
  longDescriptionEn?: string;
  imageUrl?: string;
  competencesIds?: string[];
  startDate?: string;
  type: ExperienceType;
}

export interface ProfessionalExperience extends Experience {
  missions: string[];
  missionsEn?: string[];
  hardSkills: string[];
  hardSkillsEn?: string[];
  softSkills: string[];
  softSkillsEn?: string[];
}

export interface Formation extends Experience {
  institution: string;
  institutionEn?: string;
  hardSkills: string[];
  hardSkillsEn?: string[];
  softSkills: string[];
  softSkillsEn?: string[];
}

export interface Passion {
  id: string;
  name: string;
  nameEn?: string;
  description: string;
  descriptionEn?: string;
  imageUrl?: string;
}

export interface SoftSkill {
  id: string;
  name: string;
  nameEn?: string;
}

