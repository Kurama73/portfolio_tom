import React, { useState } from 'react';
import { AdminService } from '../../domain/services/admin.service';
import ProjectManager from '../admin/EntityManagers/ProjectManager';
import ExperienceManager from '../admin/EntityManagers/ExperienceManager';
import SkillManager from '../admin/EntityManagers/SkillManager';
import CompetenceManager from '../admin/EntityManagers/CompetenceManager';
import PassionManager from '../admin/EntityManagers/PassionManager';
import SoftSkillManager from '../admin/EntityManagers/SoftSkillManager';
import './AdminDashboard.css';

const AdminDashboard: React.FC = () => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('admin_token'));
  const [activeTab, setActiveTab] = useState('projects');
  const [isLoading, setIsLoading] = useState(false);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      const newToken = await AdminService.login(username, password);
      setToken(newToken);
      localStorage.setItem('admin_token', newToken);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Identifiants incorrects. Accès refusé.');
    } finally {
      setIsLoading(false);
    }
  };

  // Écran de connexion amélioré
  if (!token) {
    return (
      <div className="admin-login-wrapper animate-fade-in">
        <div className="admin-login-card">
          <div className="login-header">
            {/* <Lock size={32} color="var(--primary-color)" /> */}
            <h2>TERMINAL <span className="dot">ADMIN</span></h2>
            <p>Authentification requise pour l'accès au portfolio</p>
          </div>

          <form className="admin-form" onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="username">Identifiant</label>
              <input
                id="username"
                className="clean-input"
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="admin..."
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Mot de passe</label>
              <input
                id="password"
                className="clean-input"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            {error && <div className="error-banner">{error}</div>}

            <button type="submit" className="primary-button submit-btn" disabled={isLoading}>
              {isLoading ? 'Authentification...' : 'Déverrouiller le système'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Configuration des onglets pour faciliter la maintenance
  const TABS = [
    { id: 'projects', label: 'Projets' },
    { id: 'experiences', label: 'Expériences' },
    { id: 'formations', label: 'Formations' },
    { id: 'skills', label: 'Hard Skills' },
    { id: 'softskills', label: 'Soft Skills' },
    { id: 'competences', label: 'Compétences IUT' },
    { id: 'passions', label: 'Passions' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'projects': return <ProjectManager />;
      case 'experiences': return <ExperienceManager type="pro" />;
      case 'formations': return <ExperienceManager type="formation" />;
      case 'skills': return <SkillManager />;
      case 'softskills': return <SoftSkillManager />;
      case 'competences': return <CompetenceManager />;
      case 'passions': return <PassionManager />;
      default: return <ProjectManager />;
    }
  };

  return (
    <div className="admin-dashboard-layout">
      {/* Sidebar de navigation */}
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <h2>TERMINAL <span>ADMIN</span></h2>
        </div>
        <nav className="admin-nav">
          {TABS.map(tab => (
            <button
              key={tab.id}
              className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </nav>
        <div className="sidebar-footer">
          <button className="logout-btn" onClick={() => {
            setToken(null);
            localStorage.removeItem('admin_token');
          }}>
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Contenu principal */}
      <main className="admin-main-content animate-fade-in">
        {renderContent()}
      </main>
    </div>
  );
};

export default AdminDashboard;