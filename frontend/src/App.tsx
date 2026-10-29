import { Navbar } from './components/Navbar';
import { ErrorState, Loader } from './components/StatusViews';
import { usePortfolio } from './hooks/usePortfolio';
import { About } from './sections/About';
import { Clients } from './sections/Clients';
import { Contact } from './sections/Contact';
import { ExperienceTimeline } from './sections/ExperienceTimeline';
import { Hero } from './sections/Hero';
import { Projects } from './sections/Projects';
import { Skills } from './sections/Skills';

export default function App() {
  const portfolio = usePortfolio();

  if (portfolio.status === 'loading') return <Loader />;
  if (portfolio.status === 'error') return <ErrorState message={portfolio.error.message} onRetry={portfolio.retry} />;

  const { profile, skills, experience, projects } = portfolio.data;
  return (
    <>
      <a href="#main" className="skip-link">Skip to content</a>
      <Navbar name={profile.name} />
      <main id="main">
        <span id="top" />
        <Hero profile={profile} />
        <About profile={profile} />
        <Skills skills={skills} />
        <ExperienceTimeline experience={experience} />
        <Projects projects={projects} />
        <Clients experience={experience} projects={projects} />
        <Contact profile={profile} />
      </main>
      <footer className="footer">
        <div className="container">© {new Date().getFullYear()} {profile.name}</div>
      </footer>
    </>
  );
}
