import React, { useState, useEffect } from 'react';
import { AdminService } from '../../domain/services/admin.service';
import AdminLayout from '../admin/AdminLayout';
import ProjectManager from '../admin/EntityManagers/ProjectManager';
import ExperienceManager from '../admin/EntityManagers/ExperienceManager';
import SkillManager from '../admin/EntityManagers/SkillManager';
import CompetenceManager from '../admin/EntityManagers/CompetenceManager';
import PassionManager from '../admin/EntityManagers/PassionManager';
import './AdminDashboard.css';

const AdminDashboard: React.FC = () => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('admin_token'));
  const [activeTab, setActiveTab] = useState('projects');

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const newToken = await AdminService.login(username, password);
      setToken(newToken);
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (!token) {
    return (
      <div className="admin-dashboard-login animate-fade-in" style={{
        display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'var(--bg-color)'
      }}>
        <div className="mac-card contact-form-card static-card" style={{ width: '400px' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', color: 'var(--primary-color)', marginBottom: '1.5rem', textAlign: 'center' }}>
            TERMINAL <span className="dot">LOGIN</span>
          </h2>
          <form className="contact-form" onSubmit={handleLogin}>
            <div className="form-group">
              <label>Identifiant</label>
              <input className="clean-input" type="text" value={username} onChange={e => setUsername(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Mot de passe</label>
              <input className="clean-input" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>
            {error && <p style={{ color: 'var(--primary-color)', fontSize: '0.8rem', marginTop: '1rem', textAlign: 'center' }}>{error}</p>}
            <button type="submit" className="primary-button submit-btn" style={{ width: '100%', marginTop: '1.5rem' }}>Dévérouiller</button>
          </form>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'projects': return <ProjectManager />;
      case 'experiences': return <ExperienceManager type="pro" />;
      case 'formations': return <ExperienceManager type="formation" />;
      case 'skills': return <SkillManager />;
      case 'competences': return <CompetenceManager />;
      case 'passions': return <PassionManager />;
      default: return <ProjectManager />;
    }
  };

  return (
    <AdminLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      <div className="animate-fade-in">
        {renderContent()}
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;