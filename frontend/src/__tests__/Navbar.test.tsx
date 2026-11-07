import { fireEvent, render, screen, within } from '@testing-library/react';
import { Navbar } from '../components/Navbar';

beforeAll(() => {
  window.matchMedia ??= ((query: string) => ({ matches: false, media: query, addEventListener() {}, removeEventListener() {} })) as unknown as typeof window.matchMedia;
});

function getMenu() {
  return document.getElementById('mobile-nav-menu')!;
}

describe('Navbar mobile menu', () => {
  it('starts closed', () => {
    render(<Navbar name="Test" />);
    const button = screen.getByRole('button', { name: 'Open menu' });
    expect(button).toHaveAttribute('aria-expanded', 'false');
    expect(button).toHaveAttribute('aria-controls', 'mobile-nav-menu');
    expect(getMenu()).not.toBeVisible();
  });

  it('opens and closes with the toggle button', () => {
    render(<Navbar name="Test" />);
    fireEvent.click(screen.getByRole('button', { name: 'Open menu' }));
    const close = screen.getByRole('button', { name: 'Close menu' });
    expect(close).toHaveAttribute('aria-expanded', 'true');
    expect(getMenu()).toBeVisible();
    expect(within(getMenu()).getAllByRole('link').map((a) => a.getAttribute('href'))).toEqual([
      '#about', '#skills', '#experience', '#projects', '#clients', '#contact',
    ]);

    fireEvent.click(close);
    expect(screen.getByRole('button', { name: 'Open menu' })).toHaveAttribute('aria-expanded', 'false');
    expect(getMenu()).not.toBeVisible();
  });

  it('closes when a link is chosen', () => {
    render(<Navbar name="Test" />);
    fireEvent.click(screen.getByRole('button', { name: 'Open menu' }));
    fireEvent.click(within(getMenu()).getByRole('link', { name: 'Projects' }));
    expect(getMenu()).not.toBeVisible();
  });

  it('closes on Escape', () => {
    render(<Navbar name="Test" />);
    fireEvent.click(screen.getByRole('button', { name: 'Open menu' }));
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(getMenu()).not.toBeVisible();
    expect(screen.getByRole('button', { name: 'Open menu' })).toBeInTheDocument();
  });
});
