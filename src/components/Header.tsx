import { NavLink, Link } from 'react-router-dom';
import { useI18n } from '../i18n/I18nContext';
import LanguageSelector from './LanguageSelector';

export default function Header() {
  const { t } = useI18n();

  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="header-title-link">
          <h1>{t.app.title}</h1>
        </Link>
        <nav className="nav">
          <NavLink
            to="/"
            className={({ isActive }) => (isActive ? 'active' : '')}
          >
            {t.app.nav.calculator}
          </NavLink>
          <NavLink
            to="/documentation"
            className={({ isActive }) => (isActive ? 'active' : '')}
          >
            {t.app.nav.documentation}
          </NavLink>
          <NavLink
            to="/support"
            className={({ isActive }) => (isActive ? 'active' : '')}
          >
            {t.app.nav.support}
          </NavLink>
        </nav>
        <LanguageSelector />
      </div>
    </header>
  );
}
