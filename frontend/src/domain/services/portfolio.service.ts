import type { Project, Skill, Experience, Passion, IutCompetence, SoftSkill, Formation, ProfessionalExperience } from "../models";

const API_BASE = 'http://localhost:3001/api';

export class PortfolioService {
  static async getProjects(): Promise<Project[]> {
    const response = await fetch(`${API_BASE}/projects`);
    return response.json();
  }

  static async getSkills(): Promise<Skill[]> {
    const response = await fetch(`${API_BASE}/skills`);
    return response.json();
  }

  static async getSoftSkills(): Promise<SoftSkill[]> {
    const response = await fetch(`${API_BASE}/soft-skills`);
    return response.json();
  }

  static async getFormations(): Promise<Formation[]> {
    const response = await fetch(`${API_BASE}/formations`);
    return response.json();
  }

  static async getProfessionalExperiences(): Promise<ProfessionalExperience[]> {
    const response = await fetch(`${API_BASE}/professional_experiences`);
    return response.json();
  }

  static async getPassions(): Promise<Passion[]> {
    const response = await fetch(`${API_BASE}/passions`);
    return response.json();
  }

  static async getIutCompetences(): Promise<IutCompetence[]> {
    const response = await fetch(`${API_BASE}/iut-competences`);
    return response.json();
  }

  static getProjectsBySkill(projects: Project[], skillId: string): Project[] {
    return projects.filter(p => p.skillsIds.includes(skillId));
  }

  static getProjectsByCompetence(projects: Project[], compId: string): Project[] {
    return projects.filter(p => p.competencesIds.includes(compId));
  }

  static getSkillsForProject(allSkills: Skill[], project: Project): Skill[] {
    return allSkills.filter(s => project.skillsIds.includes(s.id));
  }
}