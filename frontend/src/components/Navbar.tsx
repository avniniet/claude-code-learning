import { ThemeToggle } from './ThemeToggle';

const LINKS = [
  { href: '#about', label: 'About' },
  { href: '#skills', label: 'Skills' },
  { href: '#experience', label: 'Experience' },
  { href: '#projects', label: 'Projects' },
  { href: '#clients', label: 'Clients' },
  { href: '#contact', label: 'Contact' },
];

export function Navbar({ name }: { name: string }) {
  return (
    <nav className="nav" aria-label="Primary">
      <div className="container nav__inner">
        <a href="#top" className="nav__brand">{name}</a>
        <ul className="nav__links">
          {LINKS.map((l) => (
            <li key={l.href}><a href={l.href}>{l.label}</a></li>
          ))}
        </ul>
        <ThemeToggle />
      </div>
    </nav>
  );
}
