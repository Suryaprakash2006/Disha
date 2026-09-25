import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, X, LandPlot, LogOut, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import LanguageSwitcher from './LanguageSwitcher';

const links = [
  { to: '/', key: 'home' },
  { to: '/schemes', key: 'findSchemes' },
  { to: '/matches', key: 'myMatches' },
  { to: '/calculator', key: 'calculator' },
  { to: '/documents', key: 'documents' },
  { to: '/partners', key: 'partners' },
  { to: '/applications', key: 'applications' },
];

export default function Navbar() {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 font-bold text-brand-700 text-lg">
            <LandPlot className="text-saffron" size={24} />
            {t('appName')}
          </Link>

          {user?.role === 'USER' && (
            <nav className="hidden lg:flex items-center gap-1">
              {links.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  className={({ isActive }) =>
                    `px-3 py-2 text-sm font-medium rounded-lg transition-colors ${isActive
                      ? 'bg-brand-50 text-brand-700'
                      : 'text-slate-600 hover:bg-slate-100'
                    }`
                  }
                >
                  {t(`nav.${l.key}`)}
                </NavLink>
              ))}
            </nav>
          )}

          <div className="hidden lg:flex items-center gap-3">
            <LanguageSwitcher />
            {user ? (
              <>
                {user.role === 'ADMIN' && (
                  <Link to="/admin" className="btn-ghost text-sm !px-3 !py-2">
                    <ShieldCheck size={16} /> {t('nav.admin')}
                  </Link>
                )}
                <Link to="/profile" className="btn-ghost text-sm !px-3 !py-2">
                  {user.name?.split(' ')[0]}
                </Link>
                <button
                  onClick={() => { logout(); navigate('/'); }}
                  className="btn-secondary text-sm !px-3 !py-2"
                >
                  <LogOut size={16} /> {t('nav.logout')}
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-ghost text-sm !px-3 !py-2">
                  {t('nav.login')}
                </Link>
                <Link to="/register" className="btn-primary text-sm !px-3 !py-2">
                  {t('nav.register')}
                </Link>
              </>
            )}
          </div>

          <button
            className="lg:hidden text-slate-600"
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-1">

          {/* USER navigation - mobile */}
          {user?.role === 'USER' && (
            <>
              {links.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `block px-3 py-2 text-sm font-medium rounded-lg ${isActive ? 'bg-brand-50 text-brand-700' : 'text-slate-600'}`
                  }
                >
                  {t(`nav.${l.key}`)}
                </NavLink>
              ))}
            </>
          )}

          {/* ADMIN navigation - mobile */}
          {user?.role === 'ADMIN' && (
            <Link
              to="/admin"
              onClick={() => setOpen(false)}
              className="block px-3 py-2 text-sm font-medium rounded-lg text-slate-600"
            >
              <span className="flex items-center gap-2">
                <ShieldCheck size={16} />
                {t('nav.admin')}
              </span>
            </Link>
          )}

          <div className="flex items-center justify-between pt-2">
            <LanguageSwitcher />

            {user ? (
              <button
                onClick={() => {
                  logout();
                  navigate('/');
                  setOpen(false);
                }}
                className="btn-secondary text-sm !px-3 !py-2"
              >
                {t('nav.logout')}
              </button>
            ) : (
              <div className="flex gap-2">
                <Link
                  to="/login"
                  onClick={() => setOpen(false)}
                  className="btn-ghost text-sm !px-3 !py-2"
                >
                  {t('nav.login')}
                </Link>
                <Link
                  to="/register"
                  onClick={() => setOpen(false)}
                  className="btn-primary text-sm !px-3 !py-2"
                >
                  {t('nav.register')}
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}