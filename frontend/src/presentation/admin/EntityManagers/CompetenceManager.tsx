import React, { useState, useEffect } from 'react';
import { AdminService } from '../../../domain/services/admin.service';
import type { IutCompetence } from '../../../domain/models';

const CompetenceManager: React.FC = () => {
  const [competences, setCompetences] = useState<IutCompetence[]>([]);
  const [editingComp, setEditingComp] = useState<Partial<IutCompetence> | null>(null);

  useEffect(() => { loadComps(); }, []);

  const loadComps = async () => {
    const res = await fetch('http://localhost:3001/api/iut-competences');
    setCompetences(await res.json());
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingComp) return;
    try {
      const isUpdate = competences.some(c => c.id === editingComp.id);
      if (isUpdate) {
        await AdminService.updateCompetence(editingComp.id!, editingComp);
      } else {
        await AdminService.createCompetence(editingComp);
      }
      setEditingComp(null);
      loadComps();
    } catch (err) { alert("Erreur lors de la sauvegarde"); }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Supprimer cette compétence IUT ?")) {
      try {
        await AdminService.deleteCompetence(id);
        loadComps();
      } catch (err) { alert("Erreur lors de la suppression"); }
    }
  };

  return (
    <div className="entity-manager">
      <div className="admin-main-header">
        <h2 className="admin-main-title">Compétences B.U.T</h2>
        <button className="primary-button" onClick={() => setEditingComp({ id: '', name: '', description: '', level: 1 })}>
          Nouvelle Compétence
        </button>
      </div>

      {editingComp && (
        <div className="admin-card animate-fade-in">
          <form onSubmit={handleSave} className="contact-form">
            <div className="form-group-row">
              <div className="form-group">
                <label>ID (ex: comp1)</label>
                <input className="clean-input" value={editingComp.id || ''} onChange={e => setEditingComp({...editingComp, id: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Nom court</label>
                <input className="clean-input" value={editingComp.name || ''} onChange={e => setEditingComp({...editingComp, name: e.target.value})} required />
              </div>
            </div>
            <div className="form-group">
              <label>Description Complète</label>
              <textarea className="clean-input" value={editingComp.description || ''} onChange={e => setEditingComp({...editingComp, description: e.target.value})} required />
            </div>
            <div className="form-group">
              <label>Niveau (1-3)</label>
              <input type="number" min="1" max="3" className="clean-input" value={editingComp.level || 1} onChange={e => setEditingComp({...editingComp, level: parseInt(e.target.value)})} required />
            </div>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
              <button type="submit" className="primary-button">Enregistrer</button>
              <button type="button" className="secondary-button" onClick={() => setEditingComp(null)}>Annuler</button>
            </div>
          </form>
        </div>
      )}

      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nom</th>
            <th>Niveau</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {competences.map(c => (
            <tr key={c.id}>
              <td>{c.id}</td>
              <td>{c.name}</td>
              <td>Niveau {c.level}</td>
              <td>
                <button className="action-btn edit-btn" onClick={() => setEditingComp(c)}>Edit</button>
                <button className="action-btn delete-btn" onClick={() => handleDelete(c.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CompetenceManager;
