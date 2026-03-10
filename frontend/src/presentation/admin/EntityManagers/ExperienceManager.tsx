import React, { useState, useEffect } from 'react';
import { AdminService } from '../../../domain/services/admin.service';

const ExperienceManager: React.FC<{ type: 'pro' | 'formation' }> = ({ type }) => {
  const [items, setItems] = useState<any[]>([]);
  const [allCompetences, setAllCompetences] = useState<any[]>([]);
  const [editingItem, setEditingItem] = useState<any | null>(null);

  useEffect(() => { loadItems(); }, [type]);

  const loadItems = async () => {
    const endpoint = type === 'pro' ? '/professional_experiences' : '/formations';
    const [itemsRes, compRes] = await Promise.all([
      fetch(`http://localhost:3001/api${endpoint}`),
      fetch(`http://localhost:3001/api/iut-competences`)
    ]);
    setItems(await itemsRes.json());
    setAllCompetences(await compRes.json());
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    const cleanedItem = { ...editingItem };
    if (typeof cleanedItem.missions === 'string') cleanedItem.missions = cleanedItem.missions.split('\n').filter((m: string) => m.trim());
    if (typeof cleanedItem.hardSkills === 'string') cleanedItem.hardSkills = cleanedItem.hardSkills.split('\n').filter((m: string) => m.trim());
    if (typeof cleanedItem.softSkills === 'string') cleanedItem.softSkills = cleanedItem.softSkills.split('\n').filter((m: string) => m.trim());

    try {
      if (type === 'pro') {
        if (cleanedItem.id) await AdminService.updateExperience(cleanedItem.id, cleanedItem);
        else await AdminService.createExperience(cleanedItem);
      } else {
        if (cleanedItem.id) await AdminService.updateFormation(cleanedItem.id, cleanedItem);
        else await AdminService.createFormation(cleanedItem);
      }
      setEditingItem(null);
      loadItems();
    } catch (err) { alert("Erreur lors de la sauvegarde"); }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Supprimer cet élément ?")) {
      try {
        if (type === 'pro') await AdminService.deleteExperience(id);
        else await AdminService.deleteFormation(id);
        loadItems();
      } catch (err) { alert("Erreur lors de la suppression"); }
    }
  };

  return (
    <div className="entity-manager">
      <div className="admin-main-header">
        <h2 className="admin-main-title">{type === 'pro' ? 'Expériences Prof.' : 'Formations'}</h2>
        <button className="primary-button" onClick={() => setEditingItem({
          id: `new-${Date.now()}`, title: '', period: '', description: '', longDescription: '',
          company: '', institution: '', missions: [],
          hardSkills: [], softSkills: [], type: '', competencesIds: []
        })}>
          Ajouter
        </button>
      </div>

      {editingItem && (
        <div className="admin-card animate-fade-in">
          <form onSubmit={handleSave} className="contact-form">
            <div className="form-group">
              <label>Compétences IUT Liées</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
                {allCompetences.map(comp => (
                  <label key={comp.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={(editingItem.competencesIds || []).includes(comp.id)}
                      onChange={e => {
                        const current = editingItem.competencesIds || [];
                        const next = e.target.checked
                          ? [...current, comp.id]
                          : current.filter((id: string) => id !== comp.id);
                        setEditingItem({ ...editingItem, competencesIds: next });
                      }}
                    />
                    {comp.name}
                  </label>
                ))}
              </div>
            </div>
            <div className="form-group-row">
              <div className="form-group">
                <label>Titre</label>
                <input className="clean-input" value={editingItem.title || ''} onChange={e => setEditingItem({...editingItem, title: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>{type === 'pro' ? 'Entreprise' : 'Institution'}</label>
                <input className="clean-input" value={type === 'pro' ? (editingItem.company || '') : (editingItem.institution || '')} onChange={e => setEditingItem({...editingItem, [type === 'pro' ? 'company' : 'institution']: e.target.value})} required />
              </div>
            </div>

            <div className="form-group-row">
              <div className="form-group">
                <label>Période (Texte affiché)</label>
                <input className="clean-input" value={editingItem.period || ''} onChange={e => setEditingItem({...editingItem, period: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Date de début (Tri: YYYY-MM)</label>
                <input className="clean-input" type="month" value={editingItem.startDate || ''} onChange={e => setEditingItem({...editingItem, startDate: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Type (ex: Stage, Alternance, Diplôme)</label>
                <input className="clean-input" value={editingItem.type || ''} onChange={e => setEditingItem({...editingItem, type: e.target.value})} />
              </div>
            </div>

            <div className="form-group">
              <label>Description Courte (Home)</label>
              <input className="clean-input" value={editingItem.description || ''} onChange={e => setEditingItem({...editingItem, description: e.target.value})} required />
            </div>

            <div className="form-group">
              <label>Description Longue (Modal)</label>
              <textarea className="clean-input" style={{height: '100px'}} value={editingItem.longDescription || ''} onChange={e => setEditingItem({...editingItem, longDescription: e.target.value})} />
            </div>

            <div className="form-group-row">
              <div className="form-group">
                <label>Hard Skills (Un par ligne)</label>
                <textarea
                  className="clean-input"
                  style={{height: '100px'}}
                  value={Array.isArray(editingItem.hardSkills) ? editingItem.hardSkills.join('\n') : editingItem.hardSkills}
                  onChange={e => setEditingItem({...editingItem, hardSkills: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Soft Skills (Un par ligne)</label>
                <textarea
                  className="clean-input"
                  style={{height: '100px'}}
                  value={Array.isArray(editingItem.softSkills) ? editingItem.softSkills.join('\n') : editingItem.softSkills}
                  onChange={e => setEditingItem({...editingItem, softSkills: e.target.value})}
                />
              </div>
            </div>

            {type === 'pro' && (
              <div className="form-group">
                <label>Missions (Un par ligne)</label>
                <textarea
                  className="clean-input"
                  style={{height: '120px'}}
                  value={Array.isArray(editingItem.missions) ? editingItem.missions.join('\n') : editingItem.missions}
                  onChange={e => setEditingItem({...editingItem, missions: e.target.value})}
                />
              </div>
            )}

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
              <button type="submit" className="primary-button">Enregistrer</button>
              <button type="button" className="secondary-button" onClick={() => setEditingItem(null)}>Annuler</button>
            </div>
          </form>
        </div>
      )}

      <table className="admin-table">
        <thead>
          <tr>
            <th>Titre</th>
            <th>{type === 'pro' ? 'Entreprise' : 'Institution'}</th>
            <th>Période</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item.id}>
              <td>{item.title}</td>
              <td>{type === 'pro' ? item.company : item.institution}</td>
              <td>{item.period}</td>
              <td>
                <button className="action-btn edit-btn" onClick={() => setEditingItem({
                  ...item,
                  missions: Array.isArray(item.missions) ? item.missions : JSON.parse(item.missions || '[]'),
                  hardSkills: Array.isArray(item.hardSkills) ? item.hardSkills : JSON.parse(item.hardSkills || '[]'),
                  softSkills: Array.isArray(item.softSkills) ? item.softSkills : JSON.parse(item.softSkills || '[]'),
                  competencesIds: Array.isArray(item.competencesIds) ? item.competencesIds : JSON.parse(item.competencesIds || '[]')
                })}>Edit</button>
                <button className="action-btn delete-btn" onClick={() => handleDelete(item.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ExperienceManager;
