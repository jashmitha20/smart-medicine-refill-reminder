import React from 'react';

export type Profile = {
  id: string;
  name: string;
  color: string;
  shape: 'circle' | 'square' | 'hex';
  avatarEmoji?: string;
};

type Props = {
  profiles: Profile[];
  activeId: string;
  onSelect: (id: string) => void;
};

const FamilySwitcher: React.FC<Props> = ({ profiles, activeId, onSelect }) => {
  return (
    <div className="card">
      <h2>Family</h2>
      <div className="switcher" role="tablist" aria-label="Family profiles">
        {profiles.map((p) => {
          const active = p.id === activeId;
          const cls = `avatar avatar--${p.shape}`;
          return (
            <button
              key={p.id}
              role="tab"
              aria-selected={active}
              className={`switcher__item ${active ? 'switcher__item--active' : ''}`}
              onClick={() => onSelect(p.id)}
            >
              <div className={cls} style={{ background: p.color }} aria-hidden>
                {p.avatarEmoji ?? '👤'}
              </div>
              <div className="switcher__name">{p.name}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default FamilySwitcher;
