import { Link, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { LogIn, Menu, X, Globe, Moon, Sun } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useContent } from '../../hooks/useFirebase';
import { useTheme } from '../../contexts/ThemeContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const { content } = useContent();
  const { isDarkMode, toggleDarkMode } = useTheme();

  const getTranslatableContent = (key: string, defaultValue: string) => {
    const langSuffix = i18n.language.startsWith('pt') ? '' : i18n.language.includes('en') ? '_en' : i18n.language.includes('es') ? '_es' : '';
    return content[`${key}${langSuffix}`]?.value || content[key]?.value || defaultValue;
  };

  const logoText = getTranslatableContent('site_logo', 'Paulo dos Santos Ribeiro');

  const navLinks = [
    { name: t('nav.portfolio'), path: '/' },
    { name: t('nav.about'), path: '/sobre' },
    { name: t('nav.contact'), path: '/contato' },
  ];

  const languages = [
    { code: 'pt', name: 'PT' },
    { code: 'en', name: 'EN' },
    { code: 'es', name: 'ES' },
  ];

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-surface-variant">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {logoText && (
          <Link to="/" className="text-xl md:text-2xl font-serif font-bold text-primary">
            {logoText}
          </Link>
        )}
        {!logoText && <div className="flex-1" />}

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-8">
          <div className="flex items-center space-x-6 border-r border-surface-variant pr-8">
            <button
              onClick={toggleDarkMode}
              className="p-2 text-on-surface hover:text-secondary transition-colors"
              aria-label="Toggle Theme"
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <div className="flex items-center space-x-2 text-on-surface">
              <Globe size={14} className="opacity-50" />
              <div className="flex space-x-3">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => changeLanguage(lang.code)}
                    className={`text-[10px] font-bold tracking-widest transition-colors hover:text-secondary ${
                      i18n.language.includes(lang.code) ? 'text-secondary' : 'opacity-40'
                    }`}
                  >
                    {lang.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-sm font-medium tracking-wide transition-colors hover:text-secondary ${
                location.pathname === link.path ? 'text-secondary gold-underline' : 'text-on-surface'
              }`}
            >
              {link.name}
            </Link>
          ))}
          <Link
            to="/admin"
            className="flex items-center space-x-2 bg-primary text-white px-5 py-2 rounded-sm text-sm font-medium hover:bg-primary/90 transition-all card-hover"
          >
            <LogIn size={16} />
            <span>Login</span>
          </Link>
        </div>

        {/* Mobile Toggle */}
        <div className="flex items-center space-x-4 md:hidden">
          <button
            onClick={toggleDarkMode}
            className="p-2 text-primary"
            aria-label="Toggle Theme"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button className="text-primary" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="md:hidden bg-surface border-t border-surface-variant px-6 py-8 flex flex-col space-y-6"
        >
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className="text-lg font-serif font-medium text-on-surface"
            >
              {link.name}
            </Link>
          ))}
          
          <div className="pt-4 border-t border-surface-variant">
            <p className="text-[10px] font-bold tracking-widest text-on-surface/40 uppercase mb-4">Escolher Idioma / Language</p>
            <div className="flex space-x-6">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    changeLanguage(lang.code);
                    setIsOpen(false);
                  }}
                  className={`text-sm font-bold tracking-widest transition-colors ${
                    i18n.language.includes(lang.code) ? 'text-secondary' : 'text-on-surface/40'
                  }`}
                >
                  {lang.name}
                </button>
              ))}
            </div>
          </div>

          <Link
            to="/admin"
            onClick={() => setIsOpen(false)}
            className="flex items-center justify-center space-x-2 bg-primary text-white p-3 rounded-sm font-medium"
          >
            <LogIn size={20} />
            <span>Admin</span>
          </Link>
        </motion.div>
      )}
    </nav>
  );
}
