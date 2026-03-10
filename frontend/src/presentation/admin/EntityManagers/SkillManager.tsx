import React, { useState, useEffect } from 'react';
import { AdminService } from '../../../domain/services/admin.service';
import type { Skill } from '../../../domain/models';

const SkillManager: React.FC = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [editingSkill, setEditingSkill] = useState<Partial<Skill> | null>(null);

  useEffect(() => { loadSkills(); }, []);

  const loadSkills = async () => {
    const res = await fetch('http://localhost:3001/api/skills');
    setSkills(await res.json());
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSkill) return;
    try {
      const isUpdate = skills.some(s => s.id === editingSkill.id);
      if (isUpdate) {
        await AdminService.updateSkill(editingSkill.id!, editingSkill);
      } else {
        await AdminService.createSkill(editingSkill);
      }
      setEditingSkill(null);
      loadSkills();
    } catch (err) { alert("Erreur lors de la sauvegarde"); }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Supprimer ce skill ?")) {
      try {
        await AdminService.deleteSkill(id);
        loadSkills();
      } catch (err) { alert("Erreur lors de la suppression"); }
    }
  };

  return (
    <div className="entity-manager">
      <div className="admin-main-header">
        <h2 className="admin-main-title">Gestion des Skills</h2>
        <button className="primary-button" onClick={() => setEditingSkill({ id: '', name: '', mastery: 80, category: 'Logiciel' })}>
          Nouveau Skill
        </button>
      </div>

      {editingSkill && (
        <div className="admin-card animate-fade-in">
          <form onSubmit={handleSave} className="contact-form">
            <div className="form-group-row">
              <div className="form-group">
                <label>ID Unique</label>
                <input className="clean-input" value={editingSkill.id || ''} onChange={e => setEditingSkill({...editingSkill, id: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Nom</label>
                <input className="clean-input" value={editingSkill.name || ''} onChange={e => setEditingSkill({...editingSkill, name: e.target.value})} required />
              </div>
            </div>
            <div className="form-group-row">
              <div className="form-group">
                <label>Maîtrise (%)</label>
                <input type="number" className="clean-input" value={editingSkill.mastery || 0} onChange={e => setEditingSkill({...editingSkill, mastery: parseInt(e.target.value)})} required />
              </div>
              <div className="form-group">
                <label>Catégorie</label>
                <input className="clean-input" value={editingSkill.category || ''} onChange={e => setEditingSkill({...editingSkill, category: e.target.value})} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
              <button type="submit" className="primary-button">Enregistrer</button>
              <button type="button" className="secondary-button" onClick={() => setEditingSkill(null)}>Annuler</button>
            </div>
          </form>
        </div>
      )}

      <table className="admin-table">
        <thead>
          <tr>
            <th>Nom</th>
            <th>Niveau</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {skills.map(s => (
            <tr key={s.id}>
              <td>{s.name}</td>
              <td>{s.mastery}%</td>
              <td>
                <button className="action-btn edit-btn" onClick={() => setEditingSkill(s)}>Edit</button>
                <button className="action-btn delete-btn" onClick={() => handleDelete(s.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SkillManager;
