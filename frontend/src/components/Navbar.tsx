import { useEffect, useState } from 'react';
import { ThemeToggle } from './ThemeToggle';

const LINKS = [
  { href: '#about', label: 'About' },
  { href: '#skills', label: 'Skills' },
  { href: '#experience', label: 'Experience' },
  { href: '#projects', label: 'Projects' },
  { href: '#clients', label: 'Clients' },
  { href: '#contact', label: 'Contact' },
];

const MENU_ID = 'mobile-nav-menu';

export function Navbar({ name }: { name: string }) {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);
  const menuLabel = menuOpen ? 'Close menu' : 'Open menu';

  return (
    <nav className="nav" aria-label="Primary">
      <div className="container nav__inner">
        <a href="#top" className="nav__brand">{name}</a>
        <ul className="nav__links">
          {LINKS.map((l) => (
            <li key={l.href}><a href={l.href}>{l.label}</a></li>
          ))}
        </ul>
        <div className="nav__actions">
          <ThemeToggle />
          <button
            type="button"
            className="icon-btn nav__menu-btn"
            aria-expanded={menuOpen}
            aria-controls={MENU_ID}
            aria-label={menuLabel}
            title={menuLabel}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              {menuOpen ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </div>
      <div id={MENU_ID} className="nav__menu" hidden={!menuOpen}>
        <ul className="container nav__menu-links">
          {LINKS.map((l) => (
            <li key={l.href}><a href={l.href} onClick={closeMenu}>{l.label}</a></li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
