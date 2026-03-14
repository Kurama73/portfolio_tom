import type { Project, Skill, Passion, IutCompetence, SoftSkill, Formation, ProfessionalExperience } from "../models";
import { buildApiUrl } from "./api";

export class PortfolioService {
  static async getProjects(): Promise<Project[]> {
    const response = await fetch(buildApiUrl('/projects'));
    return response.json();
  }

  static async getSkills(): Promise<Skill[]> {
    const response = await fetch(buildApiUrl('/skills'));
    return response.json();
  }

  static async getSoftSkills(): Promise<SoftSkill[]> {
    const response = await fetch(buildApiUrl('/soft-skills'));
    return response.json();
  }

  static async getFormations(): Promise<Formation[]> {
    const response = await fetch(buildApiUrl('/formations'));
    return response.json();
  }

  static async getProfessionalExperiences(): Promise<ProfessionalExperience[]> {
    const response = await fetch(buildApiUrl('/professional_experiences'));
    return response.json();
  }

  static async getPassions(): Promise<Passion[]> {
    const response = await fetch(buildApiUrl('/passions'));
    return response.json();
  }

  static async getIutCompetences(): Promise<IutCompetence[]> {
    const response = await fetch(buildApiUrl('/iut-competences'));
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