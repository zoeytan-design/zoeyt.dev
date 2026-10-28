import { about, contact, sections, site, work } from './content';
import { ContactList } from './components/ContactList';
import { Hero } from './components/Hero';
import { Nav } from './components/Nav';
import { Section } from './components/Section';
import { WorkList } from './components/WorkList';
import type { SectionCopy } from './types/content';

function renderSection(copy: SectionCopy) {
  switch (copy.id) {
    case 'work':
      return (
        <Section key={copy.id} copy={copy} isEmpty={work.length === 0}>
          <WorkList items={work} />
        </Section>
      );
    case 'about':
      return (
        <Section key={copy.id} copy={copy} isEmpty={about.length === 0}>
          {about.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </Section>
      );
    case 'contact':
      return (
        <Section key={copy.id} copy={copy} isEmpty={contact.length === 0}>
          <ContactList links={contact} />
        </Section>
      );
  }
}

export default function App() {
  return (
    <div className="page">
      <Nav sections={sections} />
      <main>
        <Hero site={site} />
        {sections.map(renderSection)}
      </main>
      <footer className="footer">
        <p>
          © {new Date().getFullYear()} {site.name}
        </p>
      </footer>
    </div>
  );
}
