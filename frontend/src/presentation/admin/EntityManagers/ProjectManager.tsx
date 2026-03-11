import React, { useState, useEffect, useCallback } from 'react';
import { AdminService } from '../../../domain/services/admin.service';
import { type Project, type IutCompetence, type Skill, ProjectCategory, ProjectStatus } from '../../../domain/models';
import { translateText } from '../../../domain/services/translation.service';
import ImageUpload from '../ImageUpload';
import { EntityPicker, type PickerOption } from '../EntityPicker';

const slugify = (str: string) =>
  str.toLowerCase()
     .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
     .replace(/[^a-z0-9]+/g, '-')
     .replace(/^-+|-+$/g, '');

const ProjectManager: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [allCompetences, setAllCompetences] = useState<IutCompetence[]>([]);
  const [allSkills, setAllSkills] = useState<Skill[]>([]);
  const [editingProject, setEditingProject] = useState<Partial<Project> | null>(null);
  const [loading, setLoading] = useState(true);
  const [translating, setTranslating] = useState(false);

  const loadProjects = useCallback(async () => {
    try {
      const [pRes, cRes, sRes] = await Promise.all([
        fetch('http://localhost:3001/api/projects'),
        fetch('http://localhost:3001/api/iut-competences'),
        fetch('http://localhost:3001/api/skills'),
      ]);
      setProjects(await pRes.json());
      setAllCompetences(await cRes.json());
      setAllSkills(await sRes.json());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadProjects(); }, [loadProjects]);

  const isCreating = !projects.some(p => p.id === editingProject?.id);

  // Build PickerOptions from BDD entities
  const skillOptions: PickerOption[] = allSkills.map(s => ({
    value: s.id,
    label: s.name,
    sub: s.category,
  }));

  const competenceOptions: PickerOption[] = allCompetences.map(c => ({
    value: c.id,
    label: c.name,
    label_en: c.name_en,
  }));

  const handleTranslate = async (field: keyof Project, targetField: keyof Project) => {
    if (!editingProject?.[field]) return;
    setTranslating(true);
    try {
      const translated = await translateText(editingProject[field] as string);
      setEditingProject({ ...editingProject, [targetField]: translated });
    } finally {
      setTranslating(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;
    try {
      if (!isCreating) {
        await AdminService.updateProject(editingProject.id!, editingProject);
      } else {
        await AdminService.createProject(editingProject);
      }
      setEditingProject(null);
      loadProjects();
    } catch (error) {
      console.error('Save error:', error);
      alert(`Erreur lors de la sauvegarde: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Supprimer ce projet ?')) {
      try {
        await AdminService.deleteProject(id);
        loadProjects();
      } catch {
        alert('Erreur lors de la suppression');
      }
    }
  };

  const toggleImage = (url: string) => {
    if (!editingProject) return;
    const imgs = editingProject.images || [];
    setEditingProject({
      ...editingProject,
      images: imgs.includes(url) ? imgs.filter(i => i !== url) : [...imgs, url],
      imageUrl: editingProject.imageUrl || url, // first image = cover
    });
  };


  const handleTechStackChange = (value: string) => {
    setEditingProject({
      ...editingProject!,
      techStack: value.split(',').map(t => t.trim()).filter(Boolean),
    });
  };

  if (loading) return <div className="dot">Chargement...</div>;

  return (
    <div className="entity-manager">
      <div className="admin-main-header">
        <h2 className="admin-main-title">Projets</h2>
        <button className="primary-button" onClick={() => setEditingProject({
          id: '', title: '', title_en: '', category: ProjectCategory.WEB, status: ProjectStatus.DEVELOPMENT,
          description: '', description_en: '', longDescription: '', longDescription_en: '',
          techStack: [], images: [], skillsIds: [], competencesIds: [], github: '', link: '', startDate: ''
        })}>
          Nouveau Projet
        </button>
      </div>

      {editingProject && (
        <div className="admin-card animate-fade-in">
          <h3>{isCreating ? 'Créer un projet' : `Modifier "${editingProject.title}"`}</h3>
          <form onSubmit={handleSave} className="contact-form">

            {/* META */}
            <div className="form-group-row">
              <div className="form-group">
                <label>Catégorie</label>
                <select className="clean-input" value={editingProject.category} onChange={e => setEditingProject({ ...editingProject, category: e.target.value as ProjectCategory })}>
                  {Object.entries(ProjectCategory).map(([k, v]) => <option key={k} value={v}>{k}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Statut</label>
                <select className="clean-input" value={editingProject.status} onChange={e => setEditingProject({ ...editingProject, status: e.target.value as ProjectStatus })}>
                  {Object.entries(ProjectStatus).map(([k, v]) => <option key={k} value={v}>{k}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Date de début (YYYY-MM)</label>
                <input type="month" className="clean-input" value={editingProject.startDate || ''} onChange={e => setEditingProject({ ...editingProject, startDate: e.target.value })} />
              </div>
            </div>

            {/* TITRE */}
            <div className="translation-row">
              <div className="translation-field">
                <div className="translation-field-header">
                  <label>Titre (FR)</label>
                  <span className="lang-badge">FR</span>
                </div>
                <input className="clean-input" value={editingProject.title || ''} onChange={e => {
                  const title = e.target.value;
                  setEditingProject({ ...editingProject, title, id: isCreating ? slugify(title) : editingProject.id });
                }} required />
              </div>
              <div className="translation-field">
                <div className="translation-field-header">
                  <label>Title (EN)</label>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <button type="button" className="translate-btn" onClick={() => handleTranslate('title', 'title_en')} disabled={translating}>{translating ? '...' : 'Auto-Trad'}</button>
                    <span className="lang-badge">EN</span>
                  </div>
                </div>
                <input className="clean-input" value={editingProject.title_en || ''} onChange={e => setEditingProject({ ...editingProject, title_en: e.target.value })} />
              </div>
            </div>

            {isCreating && (
              <div className="form-group" style={{ marginTop: 0 }}>
                <label style={{ opacity: 0.5, fontSize: '0.8rem' }}>ID auto-généré</label>
                <input className="clean-input" value={editingProject.id || ''} readOnly style={{ opacity: 0.35, fontSize: '0.85rem', cursor: 'not-allowed' }} />
              </div>
            )}

            {/* DESCRIPTION COURTE */}
            <div className="translation-row">
              <div className="translation-field">
                <div className="translation-field-header"><label>Description Courte (FR)</label><span className="lang-badge">FR</span></div>
                <textarea className="clean-input" value={editingProject.description || ''} onChange={e => setEditingProject({ ...editingProject, description: e.target.value })} required />
              </div>
              <div className="translation-field">
                <div className="translation-field-header">
                  <label>Short Description (EN)</label>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <button type="button" className="translate-btn" onClick={() => handleTranslate('description', 'description_en')} disabled={translating}>{translating ? '...' : 'Auto-Trad'}</button>
                    <span className="lang-badge">EN</span>
                  </div>
                </div>
                <textarea className="clean-input" value={editingProject.description_en || ''} onChange={e => setEditingProject({ ...editingProject, description_en: e.target.value })} />
              </div>
            </div>

            {/* ANALYSE LONGUE */}
            <div className="translation-row">
              <div className="translation-field">
                <div className="translation-field-header"><label>Analyse Longue (FR)</label><span className="lang-badge">FR</span></div>
                <textarea className="clean-input" style={{ height: '180px' }} value={editingProject.longDescription || ''} onChange={e => setEditingProject({ ...editingProject, longDescription: e.target.value })} required />
              </div>
              <div className="translation-field">
                <div className="translation-field-header">
                  <label>Long Analysis (EN)</label>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <button type="button" className="translate-btn" onClick={() => handleTranslate('longDescription', 'longDescription_en')} disabled={translating}>{translating ? '...' : 'Auto-Trad'}</button>
                    <span className="lang-badge">EN</span>
                  </div>
                </div>
                <textarea className="clean-input" style={{ height: '180px' }} value={editingProject.longDescription_en || ''} onChange={e => setEditingProject({ ...editingProject, longDescription_en: e.target.value })} />
              </div>
            </div>

            {/* TECH & LIENS */}
            <div className="form-group-row">
              <div className="form-group">
                <label>Stack Technique (séparé par virgules)</label>
                <input className="clean-input" value={(editingProject.techStack || []).join(', ')} onChange={e => handleTechStackChange(e.target.value)} placeholder="React, Node.js, PostgreSQL..." />
              </div>
              <div className="form-group">
                <label>GitHub URL</label>
                <input className="clean-input" value={editingProject.github || ''} onChange={e => setEditingProject({ ...editingProject, github: e.target.value })} placeholder="https://github.com/..." />
              </div>
              <div className="form-group">
                <label>Lien Live / Demo</label>
                <input className="clean-input" value={editingProject.link || ''} onChange={e => setEditingProject({ ...editingProject, link: e.target.value })} placeholder="https://..." />
              </div>
            </div>

            {/* GALERIE */}
            <div className="admin-card" style={{ background: 'rgba(255,255,255,0.01)', borderStyle: 'dashed' }}>
              <label style={{ display: 'block', marginBottom: '1rem', fontWeight: 700 }}>Galerie d'images</label>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                {(editingProject.images || []).map(img => (
                  <div key={img} style={{ position: 'relative', border: `2px solid ${editingProject.imageUrl === img ? 'var(--primary-color)' : 'rgba(255,255,255,0.1)'}`, padding: '4px', borderRadius: '8px' }}>
                    <img src={img} alt="preview" style={{ width: '100px', height: '80px', borderRadius: '4px', objectFit: 'cover' }} />
                    <button type="button" onClick={() => setEditingProject({ ...editingProject, imageUrl: img })} style={{ position: 'absolute', bottom: -8, left: '50%', transform: 'translateX(-50%)', background: '#333', border: 'none', borderRadius: '4px', color: 'white', fontSize: '0.6rem', padding: '2px 4px', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                      {editingProject.imageUrl === img ? '★ Cover' : 'Set Cover'}
                    </button>
                    <button type="button" onClick={() => toggleImage(img)} style={{ position: 'absolute', top: -8, right: -8, background: 'var(--primary-color)', border: 'none', borderRadius: '50%', color: 'white', width: '22px', height: '22px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>×</button>
                  </div>
                ))}
              </div>
              <div className="form-group-row">
                <ImageUpload onUploadSuccess={(url) => toggleImage(url)} label="Uploader une photo" />
                <input className="clean-input" placeholder="Ou coller une URL + Entrée" onKeyDown={e => {
                  if (e.key === 'Enter') { e.preventDefault(); const t = e.target as HTMLInputElement; if (t.value) { toggleImage(t.value); t.value = ''; } }
                }} />
              </div>
            </div>


            {/* SKILLS LIÉS */}
            <EntityPicker
              title="Skills Techniques Liés"
              icon="🔧"
              options={skillOptions}
              selected={editingProject.skillsIds || []}
              onChange={ids => setEditingProject({ ...editingProject, skillsIds: ids })}
              emptyMessage="Aucun skill — créez-en dans l'onglet Hard Skills."
            />

            {/* COMPÉTENCES IUT */}
            <EntityPicker
              title="Compétences B.U.T Liées"
              icon="🎓"
              options={competenceOptions}
              selected={editingProject.competencesIds || []}
              onChange={ids => setEditingProject({ ...editingProject, competencesIds: ids })}
            />


            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', justifyContent: 'flex-end' }}>
              <button type="button" className="secondary-button" onClick={() => setEditingProject(null)}>Annuler</button>
              <button type="submit" className="primary-button">Enregistrer le projet</button>
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
              <td><span style={{ fontSize: '0.75rem', opacity: 0.7 }}>{p.category}</span></td>
              <td><span style={{ fontSize: '0.75rem', opacity: 0.7 }}>{p.status}</span></td>
              <td>
                <button className="action-btn edit-btn" onClick={() => setEditingProject({ ...p, techStack: Array.isArray(p.techStack) ? p.techStack : [], images: Array.isArray(p.images) ? p.images : [], skillsIds: Array.isArray(p.skillsIds) ? p.skillsIds : [], competencesIds: Array.isArray(p.competencesIds) ? p.competencesIds : [] })}>Edit</button>
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
