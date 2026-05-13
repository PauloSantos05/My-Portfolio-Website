import { Link } from 'react-router-dom';
import { Github, Linkedin, Mail, MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { t } = useTranslation();

  return (
    <footer className="bg-primary text-on-primary py-16 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center space-y-8 md:space-y-0 text-center md:text-left">
        <div className="space-y-4">
          <Link to="/" className="text-2xl font-serif font-bold italic">
            Rooted Portfolio
          </Link>
          <div className="flex flex-col space-y-2 text-sm opacity-80">
            <div className="flex items-center justify-center md:justify-start space-x-2">
              <Mail size={16} />
              <span>pauloribeirosantos1606@gmail.com</span>
            </div>
            <div className="flex items-center justify-center md:justify-start space-x-2">
              <MapPin size={16} />
              <span>Sua Cidade, BR (Hibrido/Remoto)</span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-6">
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-secondary transition-colors">
            <Github size={24} />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-secondary transition-colors">
            <Linkedin size={24} />
          </a>
        </div>

        <div className="text-sm opacity-60 font-medium">
          © {currentYear} Paulo dos Santos Ribeiro. {t('footer.rights')}
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-on-primary/10 flex flex-wrap justify-center gap-6 text-xs uppercase tracking-widest font-bold opacity-50">
        <Link to="/" className="hover:text-secondary transition-colors">{t('nav.portfolio')}</Link>
        <Link to="/sobre" className="hover:text-secondary transition-colors">{t('nav.about')}</Link>
        <Link to="/contato" className="hover:text-secondary transition-colors">{t('nav.contact')}</Link>
        <Link to="/admin" className="hover:text-secondary transition-colors">{t('nav.admin')}</Link>
      </div>
    </footer>
  );
}
