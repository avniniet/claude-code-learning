import { useState } from 'react';
import { SectionHeader } from '../components/SectionHeader';
import { TagList } from '../components/TagList';
import type { Skills as SkillsData } from '../types/portfolio';

type Tab = 'technical' | 'functional';
const TABS: { key: Tab; label: string }[] = [
  { key: 'technical', label: 'Technical' },
  { key: 'functional', label: 'Functional' },
];

export function Skills({ skills }: { skills: SkillsData }) {
  const [tab, setTab] = useState<Tab>('technical');
  return (
    <section className="section" aria-labelledby="skills">
      <div className="container">
        <SectionHeader
          id="skills"
          eyebrow="Skills"
          title="Technical depth and delivery leadership"
          subtitle="The stack I build with, and the practices I use to lead teams and deliver."
        />
        <div className="tabs" role="tablist" aria-label="Skill type">
          {TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              role="tab"
              id={`tab-${t.key}`}
              aria-selected={tab === t.key}
              aria-controls="skills-panel"
              className="tab"
              onClick={() => setTab(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div id="skills-panel" role="tabpanel" aria-labelledby={`tab-${tab}`} className="skills-grid">
          {skills[tab].map((group) => (
            <div key={group.category} className="card">
              <h3>{group.category}</h3>
              <TagList items={group.items} label={group.category} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
