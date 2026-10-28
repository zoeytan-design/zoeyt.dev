import type { ContactLink } from '../types/content';

export function ContactList({ links }: { links: ContactLink[] }) {
  return (
    <ul className="contact-list">
      {links.map((link) => (
        <li key={link.href}>
          <a href={link.href}>{link.label}</a>
        </li>
      ))}
    </ul>
  );
}
