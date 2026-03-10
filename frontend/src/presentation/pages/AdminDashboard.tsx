import React, { useState, useEffect } from 'react';
import { ProjectCategory, ProjectStatus } from '../../domain/models';
import './AdminDashboard.css';

const API_URL = 'http://localhost:3001/api';

const AdminDashboard: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState<string | null>(localStorage.getItem('admin_token'));

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [projects, setProjects] = useState<any[]>([]);
  const [allCompetences, setAllCompetences] = useState<any[]>([]); // Pour stocker les 6 compétences B.U.T

  const [newTitle, setNewTitle] = useState('');
  const [newShortDesc, setNewShortDesc] = useState('');
  const [newCategory, setNewCategory] = useState<ProjectCategory>(ProjectCategory.Web);
  const [newStatus, setNewStatus] = useState<ProjectStatus>(ProjectStatus.Development);
  const [selectedCompetences, setSelectedCompetences] = useState<number[]>([]);

  useEffect(() => {
    if (token) {
      setIsAuthenticated(true);
      fetchProjects();
      fetchCompetences();
    }
  }, [token]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (data.token) {
        localStorage.setItem('admin_token', data.token);
        setToken(data.token);
      } else {
        alert("Accès refusé.");
      }
    } catch (e) {
      alert("Erreur serveur.");
    }
  };

  const fetchProjects = async () => {
    const res = await fetch(`${API_URL}/projects`);
    setProjects(await res.json());
  };

  const fetchCompetences = async () => {
    const res = await fetch(`${API_URL}/iut-competences`);
    setAllCompetences(await res.json());
  };

  const toggleCompetence = (id: number) => {
    setSelectedCompetences(prev =>
      prev.includes(id) ? prev.filter(cId => cId !== id) : [...prev, id]
    );
  };

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch(`${API_URL}/projects`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        title: newTitle,
        category: newCategory,
        status: newStatus,
        shortDescription: newShortDesc || "Projet ajouté via Terminal",
        competencesIds: selectedCompetences // Les vraies compétences sélectionnées !
      })
    });

    // Reset du formulaire après ajout
    setNewTitle('');
    setNewShortDesc('');
    setSelectedCompetences([]);
    fetchProjects();
  };

  if (!isAuthenticated) {
    return (
      <div className="admin-dashboard" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div className="mac-card contact-form-card static-card" style={{ width: '400px' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', color: 'var(--primary-color)', marginBottom: '1.5rem', textAlign: 'center' }}>
            ACCÈS RESTREINT
          </h2>
          <form className="contact-form" onSubmit={handleLogin}>
            <input className="clean-input" type="text" placeholder="Identifiant" value={username} onChange={e => setUsername(e.target.value)} />
            <input className="clean-input" type="password" placeholder="Mot de passe" value={password} onChange={e => setPassword(e.target.value)} />
            <button type="submit" className="primary-button submit-btn" style={{ width: '100%', marginTop: '1rem' }}>Initialiser Connexion</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h2 className="section-title">Terminal <span className="dot">Admin</span></h2>
        <button className="primary-button secondary-button" onClick={() => { localStorage.removeItem('admin_token'); window.location.reload(); }}>Déconnexion</button>
      </div>

      <div className="mac-card contact-form-card static-card" style={{ marginBottom: '2rem' }}>
        <h3 style={{ marginBottom: '1.5rem', color: 'white' }}>Créer une entité (Projet)</h3>
        <form className="contact-form" onSubmit={handleAddProject}>
          <div className="form-group-row">
            <div className="form-group">
              <label>Titre</label>
              <input className="clean-input" value={newTitle} onChange={e => setNewTitle(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Catégorie</label>
              <select className="clean-input" value={newCategory} onChange={e => setNewCategory(e.target.value as ProjectCategory)}>
                {Object.values(ProjectCategory).map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
          </div>

          <div className="form-group-row">
            <div className="form-group">
              <label>Description Courte</label>
              <input className="clean-input" value={newShortDesc} onChange={e => setNewShortDesc(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Statut</label>
              <select className="clean-input" value={newStatus} onChange={e => setNewStatus(e.target.value as ProjectStatus)}>
                {Object.values(ProjectStatus).map(stat => <option key={stat} value={stat}>{stat}</option>)}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Liaison : Compétences B.U.T</label>
            <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
              {allCompetences.map(comp => {
                const isSelected = selectedCompetences.includes(comp.id);
                return (
                  <button
                    type="button"
                    key={comp.id}
                    onClick={() => toggleCompetence(comp.id)}
                    style={{
                      background: isSelected ? 'rgba(0, 255, 204, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                      border: `1px solid ${isSelected ? 'var(--accent-color)' : 'rgba(255,255,255,0.1)'}`,
                      color: isSelected ? 'var(--accent-color)' : '#aaa',
                      padding: '0.5rem 1rem',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      fontFamily: 'var(--font-sans)',
                      fontSize: '0.9rem'
                    }}
                  >
                    {comp.name}
                  </button>
                )
              })}
            </div>
          </div>

          <button type="submit" className="primary-button" style={{ marginTop: '1rem' }}>Enregistrer le Projet</button>
        </form>
      </div>
    </div>
  );
};

export default AdminDashboard;