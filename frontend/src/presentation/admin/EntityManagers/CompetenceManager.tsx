import React, { useState, useEffect } from 'react';
import { AdminService } from '../../../domain/services/admin.service';
import { translateText } from '../../../domain/services/translation.service';
import type { IutCompetence } from '../../../domain/models';

const slugify = (str: string) =>
  str.toLowerCase()
     .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
     .replace(/[^a-z0-9]+/g, '-')
     .replace(/^-+|-+$/g, '');

const CompetenceManager: React.FC = () => {
  const [competences, setCompetences] = useState<IutCompetence[]>([]);
  const [editingComp, setEditingComp] = useState<Partial<IutCompetence> | null>(null);
  const [translating, setTranslating] = useState(false);

  const loadComps = async () => {
    const res = await fetch(import.meta.env.VITE_API_URL || 'http://localhost:3001/api/iut-competences');
    setCompetences(await res.json());
  };

  useEffect(() => { loadComps(); }, []);

  const isCreating = !competences.some(c => c.id === editingComp?.id);

  const handleTranslate = async (field: keyof IutCompetence, targetField: keyof IutCompetence) => {
    if (!editingComp?.[field]) return;
    setTranslating(true);
    try {
      const translated = await translateText(editingComp[field] as string);
      setEditingComp({ ...editingComp, [targetField]: translated });
    } finally {
      setTranslating(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingComp) return;
    try {
      if (!isCreating) {
        await AdminService.updateCompetence(editingComp.id!, editingComp);
      } else {
        await AdminService.createCompetence(editingComp);
      }
      setEditingComp(null);
      loadComps();
    } catch { alert('Erreur lors de la sauvegarde'); }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Supprimer cette compétence IUT ?')) {
      try {
        await AdminService.deleteCompetence(id);
        loadComps();
      } catch { alert('Erreur lors de la suppression'); }
    }
  };

  return (
    <div className="entity-manager">
      <div className="admin-main-header">
        <h2 className="admin-main-title">Compétences B.U.T</h2>
        <button className="primary-button" onClick={() => setEditingComp({ id: '', name: '', name_en: '', description: '', description_en: '', percentage: 85 })}>
          Nouvelle Compétence
        </button>
      </div>

      {editingComp && (
        <div className="admin-card animate-fade-in">
          <h3>{isCreating ? 'Nouvelle Compétence' : `Modifier "${editingComp.name}"`}</h3>
          <form onSubmit={handleSave} className="contact-form">

            <div className="form-group-row">
              <div className="form-group">
                <label>Nom court (FR)</label>
                <input
                  className="clean-input"
                  value={editingComp.name || ''}
                  onChange={e => {
                    const name = e.target.value;
                    setEditingComp({ ...editingComp, name, id: isCreating ? slugify(name) : editingComp.id });
                  }}
                  required
                />
              </div>
              <div className="form-group">
                <label>Pourcentage (0–100)</label>
                <input type="number" min="0" max="100" className="clean-input" value={editingComp.percentage || 85} onChange={e => setEditingComp({ ...editingComp, percentage: parseInt(e.target.value) })} required />
              </div>
            </div>

            {isCreating && (
              <div className="form-group" style={{ marginTop: 0 }}>
                <label style={{ opacity: 0.5, fontSize: '0.8rem' }}>ID auto-généré</label>
                <input className="clean-input" value={editingComp.id || ''} readOnly style={{ opacity: 0.35, fontSize: '0.85rem', cursor: 'not-allowed' }} />
              </div>
            )}

            <div className="translation-row">
              <div className="translation-field">
                <div className="translation-field-header"><label>Nom court</label><span className="lang-badge">FR</span></div>
                <input className="clean-input" value={editingComp.name || ''} onChange={e => setEditingComp({ ...editingComp, name: e.target.value })} required />
              </div>
              <div className="translation-field">
                <div className="translation-field-header">
                  <label>Short Name</label>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <button type="button" className="translate-btn" onClick={() => handleTranslate('name', 'name_en')} disabled={translating}>{translating ? '...' : 'Auto-Trad'}</button>
                    <span className="lang-badge">EN</span>
                  </div>
                </div>
                <input className="clean-input" value={editingComp.name_en || ''} onChange={e => setEditingComp({ ...editingComp, name_en: e.target.value })} />
              </div>
            </div>

            <div className="translation-row">
              <div className="translation-field">
                <div className="translation-field-header"><label>Description</label><span className="lang-badge">FR</span></div>
                <textarea className="clean-input" value={editingComp.description || ''} onChange={e => setEditingComp({ ...editingComp, description: e.target.value })} required />
              </div>
              <div className="translation-field">
                <div className="translation-field-header">
                  <label>Description</label>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <button type="button" className="translate-btn" onClick={() => handleTranslate('description', 'description_en')} disabled={translating}>{translating ? '...' : 'Auto-Trad'}</button>
                    <span className="lang-badge">EN</span>
                  </div>
                </div>
                <textarea className="clean-input" value={editingComp.description_en || ''} onChange={e => setEditingComp({ ...editingComp, description_en: e.target.value })} />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', justifyContent: 'flex-end' }}>
              <button type="button" className="secondary-button" onClick={() => setEditingComp(null)}>Annuler</button>
              <button type="submit" className="primary-button">Enregistrer</button>
            </div>
          </form>
        </div>
      )}

      <table className="admin-table">
        <thead>
          <tr>
            <th>Nom (FR)</th>
            <th>Nom (EN)</th>
            <th>Pourcentage</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {competences.map(c => (
            <tr key={c.id}>
              <td>{c.name}</td>
              <td>{c.name_en || 'N/A'}</td>
              <td>{c.percentage}%</td>
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
