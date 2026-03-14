import React, { useState, useEffect, useCallback } from 'react';
import { AdminService } from '../../../domain/services/admin.service';
import { buildApiUrl, buildAssetUrl } from '../../../domain/services/api';
import { translateText } from '../../../domain/services/translation.service';
import { ExperienceType, type IutCompetence, type Skill, type SoftSkill } from '../../../domain/models';
import ImageUpload from '../ImageUpload';
import { EntityPicker, type PickerOption } from '../EntityPicker';

const slugify = (str: string) =>
  str.toLowerCase()
     .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
     .replace(/[^a-z0-9]+/g, '-')
     .replace(/^-+|-+$/g, '');

const toArr = (v: unknown): string[] => Array.isArray(v) ? v as string[] : [];

const ExperienceManager: React.FC<{ type: 'pro' | 'formation' }> = ({ type }) => {
  const [items, setItems] = useState<Record<string, unknown>[]>([]);
  const [allCompetences, setAllCompetences] = useState<IutCompetence[]>([]);
  const [allHardSkills, setAllHardSkills] = useState<Skill[]>([]);
  const [allSoftSkills, setAllSoftSkills] = useState<SoftSkill[]>([]);
  const [editingItem, setEditingItem] = useState<Record<string, unknown> | null>(null);
  const [translating, setTranslating] = useState<string | null>(null);

  const loadItems = useCallback(async () => {
    const endpoint = type === 'pro' ? '/professional_experiences' : '/formations';
    const [itemsRes, compRes, skillsRes, softRes] = await Promise.all([
      fetch(buildApiUrl(endpoint)),
      fetch(buildApiUrl('/iut-competences')),
      fetch(buildApiUrl('/skills')),
      fetch(buildApiUrl('/soft-skills')),
    ]);
    setItems(await itemsRes.json());
    setAllCompetences(await compRes.json());
    setAllHardSkills(await skillsRes.json());
    setAllSoftSkills(await softRes.json());
  }, [type]);

  useEffect(() => { loadItems(); }, [loadItems]);

  const isCreating = !items.some(i => i.id === editingItem?.id);

  // Convert BDD entities → PickerOptions (value = FR name, for backward compat with stored arrays)
  const hardSkillOptions: PickerOption[] = allHardSkills.map(s => ({
    value: s.name,
    label: s.name,
    label_en: s.name, // Hard skills usually keep same name in EN
    sub: s.category,
  }));

  const softSkillOptions: PickerOption[] = allSoftSkills.map(s => ({
    value: s.name,
    label: s.name,
    label_en: s.nameEn ?? s.name,
  }));

  const competenceOptions: PickerOption[] = allCompetences.map(c => ({
    value: c.id,
    label: c.name,
    label_en: c.name_en,
  }));

  const handleTranslate = async (field: string, target: string) => {
    if (!editingItem?.[field]) return;
    setTranslating(target);
    try {
      const translated = await translateText(editingItem[field] as string);
      setEditingItem({ ...editingItem, [target]: translated });
    } finally {
      setTranslating(null);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    const clean = { ...editingItem };
    // missions are free-text (one per line)
    for (const f of ['missions', 'missions_en']) {
      if (typeof clean[f] === 'string') {
        clean[f] = (clean[f] as string).split('\n').filter((l: string) => l.trim());
      }
    }
    try {
      if (type === 'pro') {
        if (!isCreating) await AdminService.updateExperience(clean.id as string, clean);
        else await AdminService.createExperience(clean);
      } else {
        if (!isCreating) await AdminService.updateFormation(clean.id as string, clean);
        else await AdminService.createFormation(clean);
      }
      setEditingItem(null);
      loadItems();
    } catch { alert('Erreur lors de la sauvegarde'); }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Supprimer cet élément ?')) {
      try {
        if (type === 'pro') await AdminService.deleteExperience(id);
        else await AdminService.deleteFormation(id);
        loadItems();
      } catch { alert('Erreur lors de la suppression'); }
    }
  };

  const startEdit = (item: Record<string, unknown>) => {
    setEditingItem({
      ...item,
      missions: Array.isArray(item.missions) ? (item.missions as string[]).join('\n') : String(item.missions ?? ''),
      missions_en: Array.isArray(item.missions_en ?? item.missionsEn)
        ? ((item.missions_en ?? item.missionsEn) as string[]).join('\n')
        : String(item.missions_en ?? item.missionsEn ?? ''),
      hardSkills: toArr(item.hardSkills),
      hardSkills_en: toArr(item.hardSkills_en ?? item.hardSkillsEn),
      softSkills: toArr(item.softSkills),
      softSkills_en: toArr(item.softSkills_en ?? item.softSkillsEn),
      competencesIds: toArr(item.competencesIds),
    });
  };

  const newItem = () => setEditingItem({
    id: '', title: '', title_en: '', period: '', period_en: '',
    description: '', description_en: '', longDescription: '', longDescription_en: '',
    company: '', company_en: '', institution: '', institution_en: '',
    missions: '', missions_en: '', hardSkills: [], hardSkills_en: [],
    softSkills: [], softSkills_en: [], imageUrl: '',
    type: type === 'pro' ? ExperienceType.INTERNSHIP : ExperienceType.EDUCATION,
    competencesIds: [],
  });

  // Bilingual translation row (reusable inline component)
  const TField = ({
    label, field, target, as: As = 'input', height, required = false,
  }: { label: string; field: string; target: string; as?: 'input' | 'textarea'; height?: string; required?: boolean }) => (
    <div className="translation-row">
      <div className="translation-field">
        <div className="translation-field-header"><label>{label} (FR)</label><span className="lang-badge">FR</span></div>
        {As === 'textarea'
          ? <textarea className="clean-input" style={height ? { height } : {}} value={(editingItem?.[field] as string) ?? ''} onChange={e => setEditingItem({ ...editingItem!, [field]: e.target.value })} required={required} />
          : <input className="clean-input" value={(editingItem?.[field] as string) ?? ''} onChange={e => setEditingItem({ ...editingItem!, [field]: e.target.value })} required={required} />
        }
      </div>
      <div className="translation-field">
        <div className="translation-field-header">
          <label>{label} (EN)</label>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button type="button" className="translate-btn" onClick={() => handleTranslate(field, target)} disabled={translating !== null}>
              {translating === target ? '...' : 'Auto-Trad'}
            </button>
            <span className="lang-badge">EN</span>
          </div>
        </div>
        {As === 'textarea'
          ? <textarea className="clean-input" style={height ? { height } : {}} value={(editingItem?.[target] as string) ?? ''} onChange={e => setEditingItem({ ...editingItem!, [target]: e.target.value })} />
          : <input className="clean-input" value={(editingItem?.[target] as string) ?? ''} onChange={e => setEditingItem({ ...editingItem!, [target]: e.target.value })} />
        }
      </div>
    </div>
  );

  return (
    <div className="entity-manager">
      <div className="admin-main-header">
        <h2 className="admin-main-title">{type === 'pro' ? 'Expériences Professionnelles' : 'Formations'}</h2>
        <button className="primary-button" onClick={newItem}>Ajouter</button>
      </div>

      {editingItem && (
        <div className="admin-card animate-fade-in">
          <h3>{isCreating ? (type === 'pro' ? 'Nouvelle expérience' : 'Nouvelle formation') : `Modifier "${editingItem.title as string}"`}</h3>
          <form onSubmit={handleSave} className="contact-form">

            {/* META */}
            <div className="form-group-row">
              <div className="form-group">
                <label>Date de début (YYYY-MM)</label>
                <input type="month" className="clean-input" value={(editingItem.startDate as string) ?? ''} onChange={e => setEditingItem({ ...editingItem, startDate: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Type</label>
                <select className="clean-input" value={editingItem.type as string} onChange={e => setEditingItem({ ...editingItem, type: e.target.value })}>
                  {Object.entries(ExperienceType).map(([k, v]) => <option key={k} value={v}>{k}</option>)}
                </select>
              </div>
            </div>

            <TField label="Période / Durée" field="period" target="period_en" required />

            {/* TITRE — génère l'ID auto */}
            <div className="translation-row">
              <div className="translation-field">
                <div className="translation-field-header"><label>Titre (FR)</label><span className="lang-badge">FR</span></div>
                <input className="clean-input" value={(editingItem.title as string) ?? ''} required
                  onChange={e => {
                    const title = e.target.value;
                    setEditingItem({ ...editingItem, title, id: isCreating ? slugify(title) : editingItem.id });
                  }}
                />
              </div>
              <div className="translation-field">
                <div className="translation-field-header">
                  <label>Title (EN)</label>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <button type="button" className="translate-btn" onClick={() => handleTranslate('title', 'title_en')} disabled={translating !== null}>{translating === 'title_en' ? '...' : 'Auto-Trad'}</button>
                    <span className="lang-badge">EN</span>
                  </div>
                </div>
                <input className="clean-input" value={(editingItem.title_en as string) ?? ''} onChange={e => setEditingItem({ ...editingItem, title_en: e.target.value })} />
              </div>
            </div>

            {isCreating && (
              <div className="form-group" style={{ marginTop: 0 }}>
                <label style={{ opacity: 0.5, fontSize: '0.8rem' }}>ID auto-généré</label>
                <input className="clean-input" value={(editingItem.id as string) ?? ''} readOnly style={{ opacity: 0.35, fontSize: '0.85rem', cursor: 'not-allowed' }} />
              </div>
            )}

            {type === 'pro'
              ? <TField label="Entreprise" field="company" target="company_en" required />
              : <TField label="Institution" field="institution" target="institution_en" required />
            }

            <TField label="Description Courte" field="description" target="description_en" as="textarea" required />
            <TField label="Analyse Longue" field="longDescription" target="longDescription_en" as="textarea" height="150px" />

            {type === 'pro' && (
              <TField label="Missions (un par ligne)" field="missions" target="missions_en" as="textarea" height="110px" />
            )}

            {/* HARD SKILLS via EntityPicker */}
            <EntityPicker
              title="Hard Skills"
              icon="🔧"
              options={hardSkillOptions}
              selected={toArr(editingItem.hardSkills)}
              onChange={fr => {
                // Sync EN: find matching option's label_en
                const en = fr.map(name => hardSkillOptions.find(o => o.value === name)?.label_en ?? name);
                setEditingItem({ ...editingItem, hardSkills: fr, hardSkills_en: en });
              }}
              emptyMessage="Aucun hard skill — créez-en dans l'onglet Hard Skills."
            />

            {/* SOFT SKILLS via EntityPicker */}
            <EntityPicker
              title="Soft Skills"
              icon="🤝"
              options={softSkillOptions}
              selected={toArr(editingItem.softSkills)}
              onChange={fr => {
                const en = fr.map(name => softSkillOptions.find(o => o.value === name)?.label_en ?? name);
                setEditingItem({ ...editingItem, softSkills: fr, softSkills_en: en });
              }}
              emptyMessage="Aucun soft skill — créez-en dans l'onglet Soft Skills."
            />

            {/* IMAGE */}
            <div className="form-group" style={{ marginTop: '0.75rem' }}>
              <label>Image / Illustration</label>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                {!!editingItem.imageUrl && (
                  <img src={buildAssetUrl(String(editingItem.imageUrl))} alt="preview" style={{ height: '60px', borderRadius: '8px', objectFit: 'cover' }} />
                )}
                <ImageUpload onUploadSuccess={url => setEditingItem({ ...editingItem, imageUrl: url })} label="Uploader" />
                <input className="clean-input" value={String(editingItem.imageUrl ?? '')} onChange={e => setEditingItem({ ...editingItem, imageUrl: e.target.value })} placeholder="ou URL directe" />
              </div>
            </div>

            {/* COMPÉTENCES IUT via EntityPicker */}
            <EntityPicker
              title="Compétences B.U.T Liées"
              icon="🎓"
              options={competenceOptions}
              selected={toArr(editingItem.competencesIds)}
              onChange={ids => setEditingItem({ ...editingItem, competencesIds: ids })}
            />

            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', justifyContent: 'flex-end' }}>
              <button type="button" className="secondary-button" onClick={() => setEditingItem(null)}>Annuler</button>
              <button type="submit" className="primary-button">Enregistrer {type === 'pro' ? "l'expérience" : 'la formation'}</button>
            </div>
          </form>
        </div>
      )}

      <table className="admin-table">
        <thead>
          <tr>
            <th>Titre</th>
            <th>{type === 'pro' ? 'Entreprise' : 'Institution'}</th>
            <th>Type</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item.id as string}>
              <td>{item.title as string}</td>
              <td style={{ opacity: 0.7, fontSize: '0.85rem' }}>{(type === 'pro' ? item.company : item.institution) as string}</td>
              <td><span style={{ fontSize: '0.7rem', opacity: 0.6 }}>{item.type as string}</span></td>
              <td>
                <button className="action-btn edit-btn" onClick={() => startEdit(item)}>Edit</button>
                <button className="action-btn delete-btn" onClick={() => handleDelete(item.id as string)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ExperienceManager;
