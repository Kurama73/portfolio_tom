import React, { useState, useEffect } from 'react';
import { AdminService } from '../../../domain/services/admin.service';
import { type Project, ProjectCategory, ProjectStatus } from '../../../domain/models';
import ImageUpload from '../ImageUpload';

const ProjectManager: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [editingProject, setEditingProject] = useState<Partial<Project> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/projects');
      setProjects(await res.json());
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;

    try {
      if ('id' in editingProject && editingProject.id) {
        await AdminService.updateProject(editingProject.id, editingProject);
      } else {
        await AdminService.createProject(editingProject);
      }
      setEditingProject(null);
      loadProjects();
    } catch (err) {
      alert("Erreur lors de la sauvegarde");
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Supprimer ce projet ?")) {
      try {
        await AdminService.deleteProject(id);
        loadProjects();
      } catch (err) {
        alert("Erreur lors de la suppression");
      }
    }
  };

  const toggleImage = (url: string) => {
    if (!editingProject) return;
    const currentImages = editingProject.images || [];
    const newImages = currentImages.includes(url)
      ? currentImages.filter(img => img !== url)
      : [...currentImages, url];
    setEditingProject({ ...editingProject, images: newImages });
  };

  if (loading) return <div className="dot">Chargement...</div>;

  return (
    <div className="entity-manager">
      <div className="admin-main-header">
        <h2 className="admin-main-title">Gestion des Projets</h2>
        <button className="primary-button" onClick={() => setEditingProject({
          title: '', category: ProjectCategory.Web, status: ProjectStatus.Development,
          description: '', longDescription: '', techStack: [], images: []
        })}>
          Nouveau Projet
        </button>
      </div>

      {editingProject && (
        <div className="admin-card animate-fade-in">
          <h3>{editingProject.id ? 'Modifier le projet' : 'Créer un projet'}</h3>
          <form onSubmit={handleSave} className="contact-form">
            <div className="form-group-row">
              <div className="form-group">
                <label>Titre</label>
                <input className="clean-input" value={editingProject.title || ''} onChange={e => setEditingProject({...editingProject, title: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>ID (Unique)</label>
                <input className="clean-input" value={editingProject.id || ''} onChange={e => setEditingProject({...editingProject, id: e.target.value})} placeholder="ex: mon-projet-super" disabled={!!(editingProject as any).id} required />
              </div>
            </div>

            <div className="form-group-row">
              <div className="form-group">
                <label>Catégorie</label>
                <select className="clean-input" value={editingProject.category} onChange={e => setEditingProject({...editingProject, category: e.target.value as ProjectCategory})}>
                  {Object.values(ProjectCategory).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Statut</label>
                <select className="clean-input" value={editingProject.status} onChange={e => setEditingProject({...editingProject, status: e.target.value as ProjectStatus})}>
                  {Object.values(ProjectStatus).map(stat => <option key={stat} value={stat}>{stat}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Date de début (Tri: YYYY-MM)</label>
                <input className="clean-input" type="month" value={editingProject.startDate || ''} onChange={e => setEditingProject({...editingProject, startDate: e.target.value})} />
              </div>
            </div>

            <div className="form-group">
              <label>Description Courte (Home Card)</label>
              <textarea className="clean-input" style={{height: '80px'}} value={editingProject.description || ''} onChange={e => setEditingProject({...editingProject, description: e.target.value})} required />
            </div>

            <div className="form-group">
              <label>Analyse Longue (Modal)</label>
              <textarea className="clean-input" style={{height: '150px'}} value={editingProject.longDescription || ''} onChange={e => setEditingProject({...editingProject, longDescription: e.target.value})} required />
            </div>

            <div className="form-group">
              <label>Images du Projet (Toutes)</label>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                {editingProject.images?.map(img => (
                  <div key={img} style={{ position: 'relative' }}>
                    <img src={img} alt="preview" style={{ width: '80px', height: '60px', borderRadius: '4px', objectFit: 'cover' }} />
                    <button type="button" onClick={() => toggleImage(img)} style={{ position: 'absolute', top: -5, right: -5, background: 'red', border: 'none', borderRadius: '50%', color: 'white', width: '18px', height: '18px', cursor: 'pointer', fontSize: '10px' }}>&times;</button>
                  </div>
                ))}
              </div>
              <ImageUpload onUploadSuccess={(url) => toggleImage(url)} label="Uploader une photo" />
              <input className="clean-input" style={{marginTop: '0.5rem'}} placeholder="Ou coller une URL d'image existante" onKeyDown={e => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  const target = e.target as HTMLInputElement;
                  if (target.value) { toggleImage(target.value); target.value = ''; }
                }
              }} />
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
              <button type="submit" className="primary-button">Enregistrer</button>
              <button type="button" className="secondary-button" onClick={() => setEditingProject(null)}>Annuler</button>
            </div>
          </form>
        </div>
      )}

      <table className="admin-table">
        <thead>
          <tr>
            <th>Titre</th>
            <th>Catégorie</th>
            <th>Statut</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {projects.map(p => (
            <tr key={p.id}>
              <td>{p.title}</td>
              <td>{p.category}</td>
              <td>{p.status}</td>
              <td>
                <button className="action-btn edit-btn" onClick={() => setEditingProject(p)}>Edit</button>
                <button className="action-btn delete-btn" onClick={() => handleDelete(p.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProjectManager;
