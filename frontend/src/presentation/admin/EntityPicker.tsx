import React, { useState, useMemo } from 'react';

export interface PickerOption {
  /** Stored value (name string for skills, id string for competences) */
  value: string;
  /** Display label (FR) */
  label: string;
  /** Display label (EN) — optional */
  labelEn?: string;
  /** Sub-label shown in small text below (e.g. category) */
  sub?: string;
}

interface EntityPickerProps {
  title: string;
  icon?: string;
  options: PickerOption[];
  selected: string[];
  onChange: (newSelected: string[]) => void;
  /** Also manage a parallel EN array (keeps FR+EN in sync) */
  selectedEn?: string[];
  onChangeEn?: (newSelected: string[]) => void;
  /** Placeholder for the empty state */
  emptyMessage?: string;
}

export const EntityPicker: React.FC<EntityPickerProps> = ({
  title, icon = '🔗', options, selected, onChange,
  selectedEn, onChangeEn, emptyMessage
}) => {
  const [search, setSearch] = useState('');
  const [collapsed, setCollapsed] = useState(false);

  const filtered = useMemo(() =>
    options.filter(o =>
      o.label.toLowerCase().includes(search.toLowerCase()) ||
      (o.labelEn ?? '').toLowerCase().includes(search.toLowerCase()) ||
      (o.sub ?? '').toLowerCase().includes(search.toLowerCase())
    ), [options, search]);

  const toggle = (opt: PickerOption) => {
    const isSelected = selected.includes(opt.value);
    const newSel = isSelected ? selected.filter(v => v !== opt.value) : [...selected, opt.value];
    onChange(newSel);
    if (onChangeEn && selectedEn !== undefined) {
      const enVal = opt.labelEn ?? opt.value;
      const newEnSel = isSelected
        ? selectedEn.filter(v => v !== enVal)
        : [...selectedEn, enVal];
      onChangeEn(newEnSel);
    }
  };

  const removeSelected = (value: string) => {
    const opt = options.find(o => o.value === value);
    if (opt) toggle(opt);
  };

  return (
    <div style={{
      border: '1px dashed rgba(255,255,255,0.12)',
      borderRadius: '12px',
      padding: '1rem',
      background: 'rgba(255,255,255,0.01)',
      marginTop: '0.75rem',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.8rem' }}>
        <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{icon} {title}</span>
        <button
          type="button"
          onClick={() => setCollapsed(c => !c)}
          style={{ background: 'none', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: 'inherit', cursor: 'pointer', padding: '2px 10px', fontSize: '0.75rem', opacity: 0.6 }}
        >
          {collapsed ? 'Ouvrir' : 'Réduire'}
        </button>
      </div>

      {/* Selected tags — always visible */}
      {selected.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: collapsed ? 0 : '0.8rem' }}>
          {selected.map(val => {
            const opt = options.find(o => o.value === val);
            return (
              <span key={val} style={{
                display: 'inline-flex', alignItems: 'center', gap: '5px',
                background: 'rgba(99,102,241,0.25)', border: '1px solid rgba(99,102,241,0.4)',
                borderRadius: '20px', padding: '2px 10px', fontSize: '0.78rem', fontWeight: 500,
              }}>
                {opt?.label ?? val}
                <button
                  type="button"
                  onClick={() => removeSelected(val)}
                  style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding: 0, fontSize: '1rem', lineHeight: 1, opacity: 0.7 }}
                >×</button>
              </span>
            );
          })}
        </div>
      )}

      {!collapsed && (
        <>
          {options.length === 0 ? (
            <p style={{ opacity: 0.45, fontSize: '0.82rem', margin: 0 }}>
              {emptyMessage ?? 'Aucune entité disponible — créez-en dans l\'onglet dédié.'}
            </p>
          ) : (
            <>
              {/* Search bar — only shown if > 6 options */}
              {options.length > 6 && (
                <input
                  className="clean-input"
                  placeholder="Rechercher..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  style={{ marginBottom: '0.6rem', fontSize: '0.85rem', padding: '0.4rem 0.7rem' }}
                />
              )}

              {/* Options grid — scrollable max-height if many */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))',
                gap: '0.45rem',
                maxHeight: filtered.length > 12 ? '240px' : 'none',
                overflowY: filtered.length > 12 ? 'auto' : 'visible',
                paddingRight: filtered.length > 12 ? '4px' : 0,
              }}>
                {filtered.length === 0 && (
                  <p style={{ opacity: 0.4, fontSize: '0.8rem', gridColumn: '1/-1', margin: 0 }}>Aucun résultat</p>
                )}
                {filtered.map(opt => {
                  const checked = selected.includes(opt.value);
                  return (
                    <label key={opt.value} style={{
                      display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem',
                      cursor: 'pointer',
                      background: checked ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.03)',
                      border: `1px solid ${checked ? 'rgba(99,102,241,0.4)' : 'rgba(255,255,255,0.06)'}`,
                      padding: '0.45rem 0.6rem', borderRadius: '6px',
                      transition: 'background 0.12s, border-color 0.12s',
                    }}>
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggle(opt)}
                        style={{ flexShrink: 0 }}
                      />
                      <span style={{ lineHeight: 1.3 }}>
                        {opt.label}
                        {opt.sub && <span style={{ display: 'block', fontSize: '0.7rem', opacity: 0.5 }}>{opt.sub}</span>}
                      </span>
                    </label>
                  );
                })}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};
