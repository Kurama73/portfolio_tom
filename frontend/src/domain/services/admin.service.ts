const API_URL = 'http://localhost:3001/api';

export class AdminService {
  private static getToken() {
    return localStorage.getItem('admin_token');
  }

  private static getHeaders() {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.getToken()}`
    };
  }

  static async login(username: string, password: string): Promise<string> {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    if (data.token) {
      localStorage.setItem('admin_token', data.token);
      return data.token;
    }
    throw new Error(data.error || 'Accès refusé');
  }

  static logout() {
    localStorage.removeItem('admin_token');
    window.location.reload();
  }

  static async uploadImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('image', file);
    const res = await fetch(`${API_URL}/upload`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${this.getToken()}` },
      body: formData
    });
    const data = await res.json();
    if (data.url) return data.url;
    throw new Error(data.error || 'Erreur d\'upload');
  }

  private static async request(endpoint: string, method: string, body?: unknown) {
    const res = await fetch(`${API_URL}${endpoint}`, {
      method,
      headers: this.getHeaders(),
      body: body ? JSON.stringify(body) : undefined
    });
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || 'Erreur serveur');
    }
    return res.json();
  }

  static createProject(data: unknown) { return this.request('/projects', 'POST', data); }
  static updateProject(id: string | number, data: unknown) { return this.request(`/projects/${id}`, 'PUT', data); }
  static deleteProject(id: string | number) { return this.request(`/projects/${id}`, 'DELETE'); }

  static createFormation(data: unknown) { return this.request('/formations', 'POST', data); }
  static updateFormation(id: string | number, data: unknown) { return this.request(`/formations/${id}`, 'PUT', data); }
  static deleteFormation(id: string | number) { return this.request(`/formations/${id}`, 'DELETE'); }

  static createExperience(data: unknown) { return this.request('/professional_experiences', 'POST', data); }
  static updateExperience(id: string | number, data: unknown) { return this.request(`/professional_experiences/${id}`, 'PUT', data); }
  static deleteExperience(id: string | number) { return this.request(`/professional_experiences/${id}`, 'DELETE'); }

  static createCompetence(data: unknown) { return this.request('/iut-competences', 'POST', data); }
  static updateCompetence(id: string, data: unknown) { return this.request(`/iut-competences/${id}`, 'PUT', data); }
  static deleteCompetence(id: string) { return this.request(`/iut-competences/${id}`, 'DELETE'); }

  static createSkill(data: unknown) { return this.request('/skills', 'POST', data); }
  static updateSkill(id: string, data: unknown) { return this.request(`/skills/${id}`, 'PUT', data); }
  static deleteSkill(id: string) { return this.request(`/skills/${id}`, 'DELETE'); }

  static createPassion(data: unknown) { return this.request('/passions', 'POST', data); }
  static updatePassion(id: string, data: unknown) { return this.request(`/passions/${id}`, 'PUT', data); }
  static deletePassion(id: string) { return this.request(`/passions/${id}`, 'DELETE'); }

  static createSoftSkill(data: unknown) { return this.request('/soft-skills', 'POST', data); }
  static updateSoftSkill(id: string, data: unknown) { return this.request(`/soft-skills/${id}`, 'PUT', data); }
  static deleteSoftSkill(id: string) { return this.request(`/soft-skills/${id}`, 'DELETE'); }
}
