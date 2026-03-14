import React, { useState, useEffect } from 'react';
import { AdminService } from '../../../domain/services/admin.service';
import { buildApiUrl, buildAssetUrl } from '../../../domain/services/api';
import { translateText } from '../../../domain/services/translation.service';
import type { Passion } from '../../../domain/models';
import ImageUpload from '../ImageUpload';

const slugify = (str: string) =>
  str.toLowerCase()
     .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
     .replace(/[^a-z0-9]+/g, '-')
     .replace(/^-+|-+$/g, '');

const PassionManager: React.FC = () => {
  const [passions, setPassions] = useState<Passion[]>([]);
  const [editingPassion, setEditingPassion] = useState<Partial<Passion> | null>(null);
  const [translating, setTranslating] = useState(false);

  const loadPassions = async () => {
    const res = await fetch(buildApiUrl('/passions'));
    setPassions(await res.json());
  };

  useEffect(() => { loadPassions(); }, []);

  const isCreating = !passions.some(p => p.id === editingPassion?.id);

  const handleTranslate = async (field: keyof Passion, targetField: keyof Passion) => {
    if (!editingPassion?.[field]) return;
    setTranslating(true);
    try {
      const translated = await translateText(editingPassion[field] as string);
      setEditingPassion({ ...editingPassion, [targetField]: translated });
    } finally {
      setTranslating(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPassion) return;
    try {
      if (!isCreating) {
        await AdminService.updatePassion(editingPassion.id!, editingPassion);
      } else {
        await AdminService.createPassion(editingPassion);
      }
      setEditingPassion(null);
      loadPassions();
    } catch { alert('Erreur lors de la sauvegarde'); }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Supprimer cette passion ?')) {
      try {
        await AdminService.deletePassion(id);
        loadPassions();
      } catch { alert('Erreur lors de la suppression'); }
    }
  };

  return (
    <div className="entity-manager">
      <div className="admin-main-header">
        <h2 className="admin-main-title">Passions</h2>
        <button className="primary-button" onClick={() => setEditingPassion({ id: '', name: '', nameEn: '', description: '', descriptionEn: '', imageUrl: '' })}>
          Nouvelle Passion
        </button>
      </div>

      {editingPassion && (
        <div className="admin-card animate-fade-in">
          <h3>{isCreating ? 'Nouvelle Passion' : `Modifier "${editingPassion.name}"`}</h3>
          <form onSubmit={handleSave} className="contact-form">

            {/* NOM */}
            <div className="translation-row">
              <div className="translation-field">
                <div className="translation-field-header"><label>Nom (FR)</label><span className="lang-badge">FR</span></div>
                <input
                  className="clean-input"
                  value={editingPassion.name || ''}
                  onChange={e => {
                    const name = e.target.value;
                    setEditingPassion({ ...editingPassion, name, id: isCreating ? slugify(name) : editingPassion.id });
                  }}
                  required
                />
              </div>
              <div className="translation-field">
                <div className="translation-field-header">
                  <label>Name (EN)</label>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <button type="button" className="translate-btn" onClick={() => handleTranslate('name', 'nameEn')} disabled={translating}>{translating ? '...' : 'Auto-Trad'}</button>
                    <span className="lang-badge">EN</span>
                  </div>
                </div>
                <input className="clean-input" value={editingPassion.nameEn || ''} onChange={e => setEditingPassion({ ...editingPassion, nameEn: e.target.value })} />
              </div>
            </div>

            {isCreating && (
              <div className="form-group" style={{ marginTop: 0 }}>
                <label style={{ opacity: 0.5, fontSize: '0.8rem' }}>ID auto-généré</label>
                <input className="clean-input" value={editingPassion.id || ''} readOnly style={{ opacity: 0.35, fontSize: '0.85rem', cursor: 'not-allowed' }} />
              </div>
            )}

            {/* DESCRIPTION */}
            <div className="translation-row">
              <div className="translation-field">
                <div className="translation-field-header"><label>Description (FR)</label><span className="lang-badge">FR</span></div>
                <textarea className="clean-input" value={editingPassion.description || ''} onChange={e => setEditingPassion({ ...editingPassion, description: e.target.value })} required />
              </div>
              <div className="translation-field">
                <div className="translation-field-header">
                  <label>Description (EN)</label>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <button type="button" className="translate-btn" onClick={() => handleTranslate('description', 'descriptionEn')} disabled={translating}>{translating ? '...' : 'Auto-Trad'}</button>
                    <span className="lang-badge">EN</span>
                  </div>
                </div>
                <textarea className="clean-input" value={editingPassion.descriptionEn || ''} onChange={e => setEditingPassion({ ...editingPassion, descriptionEn: e.target.value })} />
              </div>
            </div>

            {/* IMAGE */}
            <div className="admin-card" style={{ background: 'rgba(255,255,255,0.01)', borderStyle: 'dashed' }}>
              <label style={{ display: 'block', marginBottom: '1rem', fontWeight: 700 }}>Image illustrative</label>
              {editingPassion.imageUrl && (
                <img src={buildAssetUrl(editingPassion.imageUrl)} alt="preview" style={{ width: '150px', height: '100px', objectFit: 'cover', marginBottom: '1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }} />
              )}
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <ImageUpload onUploadSuccess={url => setEditingPassion({ ...editingPassion, imageUrl: url })} label="Uploader" />
                <input className="clean-input" value={editingPassion.imageUrl || ''} onChange={e => setEditingPassion({ ...editingPassion, imageUrl: e.target.value })} placeholder="ou URL directe" />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', justifyContent: 'flex-end' }}>
              <button type="button" className="secondary-button" onClick={() => setEditingPassion(null)}>Annuler</button>
              <button type="submit" className="primary-button">Enregistrer</button>
            </div>
          </form>
        </div>
      )}

      <table className="admin-table">
        <thead>
          <tr>
            <th>Nom (FR)</th>
            <th>Name (EN)</th>
            <th>Description (FR)</th>
            <th>Description (EN)</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {passions.map(p => (
            <tr key={p.id}>
              <td>{p.name}</td>
              <td>{p.nameEn}</td>
              <td style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', opacity: 0.7 }}>{p.description}</td>
              <td style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', opacity: 0.7 }}>{p.descriptionEn}</td>
              <td>
                <button className="action-btn edit-btn" onClick={() => setEditingPassion(p)}>Edit</button>
                <button className="action-btn delete-btn" onClick={() => handleDelete(p.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PassionManager;
