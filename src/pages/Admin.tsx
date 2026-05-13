import { useAuth } from '../contexts/AuthContext';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, FileCode, MessageSquare, Settings, LogOut, ArrowLeft, RefreshCcw } from 'lucide-react';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

// Admin Views
import ProjectManager from '../components/admin/ProjectManager';
import ContentManager from '../components/admin/ContentManager';
import MessageCenter from '../components/admin/MessageCenter';

const Dashboard = () => {
  const { t } = useTranslation();
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-serif font-bold text-primary italic">Welcome back, Admin.</h1>
        <p className="text-on-surface-variant font-medium opacity-70">{t('admin.welcome_msg', { defaultValue: 'O sistema está operacional e pronto para novos conteúdos.' })}</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Link to="/admin/projetos" className="bg-white p-8 rounded-lg border border-surface-variant shadow-sm hover:border-secondary transition-all group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-surface-container rounded-md group-hover:bg-primary group-hover:text-white transition-all text-primary">
              <FileCode size={24} />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-secondary group-hover:translate-x-1 transition-transform">{t('admin.manage', { defaultValue: 'Gerenciar' })}</span>
          </div>
          <h3 className="text-lg font-serif font-bold text-primary">{t('admin.projects')}</h3>
          <p className="text-xs text-on-surface-variant opacity-50 mt-2 font-medium">{t('admin.projects_desc', { defaultValue: 'Controle seu portfólio público.' })}</p>
        </Link>
  
        <Link to="/admin/mensagens" className="bg-white p-8 rounded-lg border border-surface-variant shadow-sm hover:border-secondary transition-all group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-surface-container rounded-md group-hover:bg-primary group-hover:text-white transition-all text-primary">
              <MessageSquare size={24} />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-secondary group-hover:translate-x-1 transition-transform">{t('admin.view', { defaultValue: 'Visualizar' })}</span>
          </div>
          <h3 className="text-lg font-serif font-bold text-primary">{t('admin.messages')}</h3>
          <p className="text-xs text-on-surface-variant opacity-50 mt-2 font-medium">{t('admin.messages_desc', { defaultValue: 'Recrutadores em contato.' })}</p>
        </Link>
  
        <Link to="/admin/config" className="bg-white p-8 rounded-lg border border-surface-variant shadow-sm hover:border-secondary transition-all group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-surface-container rounded-md group-hover:bg-primary group-hover:text-white transition-all text-primary">
              <Settings size={24} />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-secondary group-hover:translate-x-1 transition-transform">{t('admin.adjust', { defaultValue: 'Ajustar' })}</span>
          </div>
          <h3 className="text-lg font-serif font-bold text-primary">{t('admin.settings')}</h3>
          <p className="text-xs text-on-surface-variant opacity-50 mt-2 font-medium">{t('admin.settings_desc', { defaultValue: 'Altere textos e mídias.' })}</p>
        </Link>
      </div>
    </div>
  )
};

export default function Admin() {
  const { user, isAdmin, loading, login, logout } = useAuth();
  const location = useLocation();
  const { t } = useTranslation();

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center space-y-4 bg-surface">
      <RefreshCcw size={40} className="text-secondary animate-spin" />
      <p className="font-serif italic text-primary">Sincronizando sistemas...</p>
    </div>
  );

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-surface-container flex flex-col items-center justify-center px-6 py-20">
        <div className="max-w-md w-full bg-white p-12 rounded-lg shadow-xl border border-surface-variant text-center space-y-8">
          <div className="space-y-2">
            <h1 className="text-4xl font-serif font-bold text-primary">Admin Access</h1>
            <p className="text-on-surface-variant font-medium">Terminal seguro para gestão do portfólio.</p>
          </div>
          
          <div className="space-y-4">
            {user ? (
              <div className="p-4 bg-error/10 text-error rounded-md text-sm font-medium">
                Sua conta ({user.email}) não tem privilégios de administrador.
              </div>
            ) : (
              <p className="text-sm text-on-surface-variant opacity-70 italic">Identifique-se para continuar.</p>
            )}
            
            <button
              onClick={login}
              className="w-full bg-primary text-white py-4 rounded-sm font-bold tracking-widest uppercase hover:bg-primary/90 transition-all card-hover"
            >
              INITIALIZE LINK
            </button>
          </div>

          <Link to="/" className="inline-flex items-center space-x-2 text-sm font-medium text-on-surface-variant hover:text-primary transition-colors">
            <ArrowLeft size={16} />
            <span>Voltar para o Portfólio Público</span>
          </Link>
          
          <div className="pt-8 border-t border-surface-variant flex items-center justify-center space-x-2 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/40">
            <Settings size={12} />
            <span>Conexão Encriptada End-to-End</span>
          </div>
        </div>
      </div>
    );
  }

  const sidebarLinks = [
    { name: t('admin.dashboard'), icon: <LayoutDashboard size={20} />, path: '/admin' },
    { name: t('admin.projects'), icon: <FileCode size={20} />, path: '/admin/projetos' },
    { name: t('admin.messages'), icon: <MessageSquare size={20} />, path: '/admin/mensagens' },
    { name: t('admin.settings'), icon: <Settings size={20} />, path: '/admin/config' },
  ];

  return (
    <div className="min-h-screen flex bg-surface-container-low">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-surface-variant hidden md:flex flex-col p-6 sticky top-0 h-screen">
        <div className="mb-12">
          <h2 className="text-xl font-serif font-bold text-primary leading-tight">Admin Console</h2>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-secondary">Managing Content</p>
        </div>

        <nav className="flex-grow space-y-2">
          {sidebarLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center space-x-3 p-3 rounded-md transition-all font-medium text-sm ${
                location.pathname === link.path 
                  ? 'bg-secondary-container text-primary font-bold shadow-sm' 
                  : 'text-on-surface-variant hover:bg-surface-container hover:text-primary'
              }`}
            >
              {link.icon}
              <span>{link.name}</span>
            </Link>
          ))}
        </nav>

        <button 
          onClick={logout}
          className="mt-auto flex items-center space-x-3 p-3 text-sm font-medium text-error hover:bg-error/5 rounded-md transition-all"
        >
          <LogOut size={20} />
          <span>{t('admin.logout')}</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-6 md:p-12 overflow-y-auto pt-24 md:pt-12">
        <div className="max-w-5xl mx-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/projetos" element={<ProjectManager />} />
            <Route path="/mensagens" element={<MessageCenter />} />
            <Route path="/config" element={<ContentManager />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}
