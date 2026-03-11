import React, { useState, useEffect, useCallback } from 'react';
import { AdminService } from '../../../domain/services/admin.service';
import { translateText } from '../../../domain/services/translation.service';

const slugify = (str: string) =>
  str.toLowerCase()
     .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
     .replace(/[^a-z0-9]+/g, '-')
     .replace(/^-+|-+$/g, '');

interface SoftSkill {
  id: string;
  name: string;
  nameEn?: string;
  name_en?: string;
}

const SoftSkillManager: React.FC = () => {
  const [skills, setSkills] = useState<SoftSkill[]>([]);
  const [editingSkill, setEditingSkill] = useState<Partial<SoftSkill> | null>(null);
  const [translating, setTranslating] = useState(false);

  const loadSkills = useCallback(async () => {
    const res = await fetch('http://localhost:3001/api/soft-skills');
    const data = await res.json();
    setSkills(data.map((s: SoftSkill) => ({ ...s, nameEn: s.nameEn || s.name_en || '' })));
  }, []);

  useEffect(() => {
    const init = async () => { await loadSkills(); };
    init();
  }, [loadSkills]);

  const isCreating = !skills.some(s => s.id === editingSkill?.id);

  const handleTranslate = async () => {
    if (!editingSkill?.name) return;
    setTranslating(true);
    try {
      const translated = await translateText(editingSkill.name);
      setEditingSkill({ ...editingSkill, nameEn: translated });
    } finally {
      setTranslating(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSkill) return;
    try {
      if (!isCreating) {
        await AdminService.updateSoftSkill(editingSkill.id!, editingSkill);
      } else {
        await AdminService.createSoftSkill(editingSkill);
      }
      setEditingSkill(null);
      loadSkills();
    } catch {
      alert('Erreur lors de la sauvegarde');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Supprimer ce soft skill ?')) {
      try {
        await AdminService.deleteSoftSkill(id);
        loadSkills();
      } catch {
        alert('Erreur lors de la suppression');
      }
    }
  };

  return (
    <div className="entity-manager">
      <div className="admin-main-header">
        <h2 className="admin-main-title">Soft Skills Transversaux</h2>
        <button className="primary-button" onClick={() => setEditingSkill({ id: '', name: '', nameEn: '' })}>
          Nouveau Soft Skill
        </button>
      </div>

      {editingSkill && (
        <div className="admin-card animate-fade-in">
          <h3>{editingSkill.name ? `Modifier "${editingSkill.name}"` : 'Nouveau Soft Skill'}</h3>
          <form onSubmit={handleSave} className="contact-form">
            <div className="translation-row">
              <div className="translation-field">
                <div className="translation-field-header">
                  <label>Nom (FR)</label>
                  <span className="lang-badge">FR</span>
                </div>
                <input
                  className="clean-input"
                  value={editingSkill.name || ''}
                  onChange={e => {
                    const name = e.target.value;
                    setEditingSkill({ ...editingSkill, name, id: isCreating ? slugify(name) : editingSkill.id });
                  }}
                  placeholder="ex: Rigueur"
                  required
                />
              </div>
              <div className="translation-field">
                <div className="translation-field-header">
                  <label>Name (EN)</label>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <button type="button" className="translate-btn" onClick={handleTranslate} disabled={translating}>
                      {translating ? '...' : 'Auto-Trad'}
                    </button>
                    <span className="lang-badge">EN</span>
                  </div>
                </div>
                <input
                  className="clean-input"
                  value={editingSkill.nameEn || ''}
                  onChange={e => setEditingSkill({ ...editingSkill, nameEn: e.target.value })}
                  placeholder="ex: Rigor"
                />
              </div>
            </div>

            {isCreating && (
              <div className="form-group" style={{ marginTop: 0 }}>
                <label style={{ opacity: 0.5, fontSize: '0.8rem' }}>ID auto-généré</label>
                <input
                  className="clean-input"
                  value={editingSkill.id || ''}
                  readOnly
                  style={{ opacity: 0.35, fontSize: '0.85rem', cursor: 'not-allowed' }}
                />
              </div>
            )}

            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', justifyContent: 'flex-end' }}>
              <button type="button" className="secondary-button" onClick={() => setEditingSkill(null)}>Annuler</button>
              <button type="submit" className="primary-button">Enregistrer</button>
            </div>
          </form>
        </div>
      )}

      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nom (FR)</th>
            <th>Name (EN)</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {skills.map(s => (
            <tr key={s.id}>
              <td><code style={{ opacity: 0.6, fontSize: '0.8rem' }}>{s.id}</code></td>
              <td>{s.name}</td>
              <td style={{ opacity: 0.7 }}>{s.nameEn || s.name_en || '—'}</td>
              <td>
                <button className="action-btn edit-btn" onClick={() => setEditingSkill({ ...s, nameEn: s.nameEn || s.name_en || '' })}>Edit</button>
                <button className="action-btn delete-btn" onClick={() => handleDelete(s.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SoftSkillManager;
