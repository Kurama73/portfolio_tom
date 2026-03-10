import React, { useState, useEffect } from 'react';
import { AdminService } from '../../../domain/services/admin.service';
import { Passion } from '../../../domain/models';
import ImageUpload from '../ImageUpload';

const PassionManager: React.FC = () => {
  const [passions, setPassions] = useState<Passion[]>([]);
  const [editingPassion, setEditingPassion] = useState<Partial<Passion> | null>(null);

  useEffect(() => { loadPassions(); }, []);

  const loadPassions = async () => {
    const res = await fetch('http://localhost:3001/api/passions');
    setPassions(await res.json());
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPassion) return;
    try {
      const isUpdate = passions.some(p => p.id === editingPassion.id);
      if (isUpdate) {
        await AdminService.updatePassion(editingPassion.id!, editingPassion);
      } else {
        await AdminService.createPassion(editingPassion);
      }
      setEditingPassion(null);
      loadPassions();
    } catch (err) { alert("Erreur lors de la sauvegarde"); }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Supprimer cette passion ?")) {
      try {
        await AdminService.deletePassion(id);
        loadPassions();
      } catch (err) { alert("Erreur lors de la suppression"); }
    }
  };

  return (
    <div className="entity-manager">
      <div className="admin-main-header">
        <h2 className="admin-main-title">Gestion des Passions</h2>
        <button className="primary-button" onClick={() => setEditingPassion({ id: '', name: '', description: '', imageUrl: '' })}>
          Nouvelle Passion
        </button>
      </div>

      {editingPassion && (
        <div className="admin-card animate-fade-in">
          <form onSubmit={handleSave} className="contact-form">
            <div className="form-group-row">
              <div className="form-group">
                <label>ID Unique</label>
                <input className="clean-input" value={editingPassion.id || ''} onChange={e => setEditingPassion({...editingPassion, id: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Nom</label>
                <input className="clean-input" value={editingPassion.name || ''} onChange={e => setEditingPassion({...editingPassion, name: e.target.value})} required />
              </div>
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea className="clean-input" value={editingPassion.description || ''} onChange={e => setEditingPassion({...editingPassion, description: e.target.value})} required />
            </div>
            <div className="form-group">
              <label>Image</label>
              {editingPassion.imageUrl && <img src={editingPassion.imageUrl} alt="preview" style={{ width: '100px', marginBottom: '1rem', borderRadius: '8px' }} />}
              <ImageUpload onUploadSuccess={(url) => setEditingPassion({...editingPassion, imageUrl: url})} />
            </div>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
              <button type="submit" className="primary-button">Enregistrer</button>
              <button type="button" className="secondary-button" onClick={() => setEditingPassion(null)}>Annuler</button>
            </div>
          </form>
        </div>
      )}

      <table className="admin-table">
        <thead>
          <tr>
            <th>Nom</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {passions.map(p => (
            <tr key={p.id}>
              <td>{p.name}</td>
              <td style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.description}</td>
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
