import { useState } from 'react';
import { useContent } from '../../hooks/useFirebase';
import { Save, RefreshCcw, Type, Image as ImageIcon, Palette, RefreshCw } from 'lucide-react';
import ImageUploader from '../ImageUploader';
import { useTheme } from '../../contexts/ThemeContext';

export default function ContentManager() {
  const { content, updateContent, loading } = useContent();
  const { colors, updateColor } = useTheme();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  const baseKeys = [
    { id: 'site_logo', label: 'Site: Logo / Título', type: 'text' as const },
    { id: 'hero_title', label: 'Home: Título Principal', type: 'text' as const },
    { id: 'hero_badge', label: 'Home: Badge/Subtítulo (Topo)', type: 'text' as const },
    { id: 'hero_sub', label: 'Home: Bio Curta (Subtítulo)', type: 'text' as const },
    { id: 'hero_image', label: 'Home: Imagem de Destaque (URL)', type: 'image' as const },
    { id: 'hero_exp_years', label: 'Home: Experiência (Valor)', type: 'text' as const },
    { id: 'hero_exp_text', label: 'Home: Experiência (Rótulo)', type: 'text' as const },
    { id: 'about_title', label: 'Sobre: Título de Introdução', type: 'text' as const },
    { id: 'about_bio', label: 'Sobre: Biografia Completa', type: 'text' as const },
    { id: 'about_image', label: 'Sobre: Foto de Perfil (URL)', type: 'image' as const },
  ];

  const [activeTab, setActiveTab] = useState<'text' | 'colors'>('text');

  const lightThemeConfig = [
    { id: 'theme_primary', label: 'Primária (Luz)', key: 'primary' },
    { id: 'theme_on-primary', label: 'Texto sobre Primária (Luz)', key: 'on-primary' },
    { id: 'theme_secondary', label: 'Secundária (Luz)', key: 'secondary' },
    { id: 'theme_surface', label: 'Fundo (Luz)', key: 'surface' },
    { id: 'theme_on-surface', label: 'Texto (Luz)', key: 'on-surface' },
    { id: 'theme_admin-sidebar', label: 'Barra Lateral (Luz)', key: 'admin-sidebar' },
    { id: 'theme-surface-variant', label: 'Bordas (Luz)', key: 'surface-variant' }
  ];

  const darkThemeConfig = [
    { id: 'theme_dark-primary', label: 'Primária (Escuro)', key: 'dark-primary' },
    { id: 'theme_dark-on-primary', label: 'Texto sobre Primária (Escuro)', key: 'dark-on-primary' },
    { id: 'theme_dark-secondary', label: 'Secundária (Escuro)', key: 'dark-secondary' },
    { id: 'theme_dark-surface', label: 'Fundo (Escuro)', key: 'dark-surface' },
    { id: 'theme_dark-on-surface', label: 'Texto (Escuro)', key: 'dark-on-surface' },
    { id: 'theme_dark-admin-sidebar', label: 'Barra Lateral (Escuro)', key: 'dark-admin-sidebar' },
    { id: 'theme-dark-surface-variant', label: 'Bordas (Escuro)', key: 'dark-surface-variant' }
  ];

  const handleColorChange = async (id: string, key: string, value: string) => {
    updateColor(key, value);
    try {
      await updateContent(id, value, 'text');
    } catch (err) {
      console.error('Error saving color:', err);
    }
  };

  const resetColors = async () => {
    const defaults: Record<string, string> = {
      'primary': '#154212',
      'on-primary': '#ffffff',
      'secondary': '#c5a059',
      'surface': '#f9faf2',
      'on-surface': '#191c18',
      'admin-sidebar': '#ffffff',
      'surface-variant': '#e2e3dc',
      'dark-primary': '#154212',
      'dark-on-primary': '#ffffff',
      'dark-secondary': '#ffbe0c',
      'dark-surface': '#11140e',
      'dark-on-surface': '#e2e3dc',
      'dark-admin-sidebar': '#1a1c18',
      'dark-surface-variant': '#42493f'
    };

    try {
      setEditingId('resetting');
      const promises = Object.entries(defaults).map(([key, value]) => {
        updateColor(key, value);
        return updateContent(`theme_${key}`, value, 'text');
      });
      await Promise.all(promises);
    } catch (err) {
      console.error('Error resetting colors:', err);
    } finally {
      setEditingId(null);
    }
  };

  const langs = [
    { code: '', label: '(Padrão / PT)' },
    { code: '_en', label: '(English)' },
    { code: '_es', label: '(Español)' },
  ];

  const keys: { id: string; label: string; type: 'text' | 'image' }[] = baseKeys.flatMap((base): { id: string; label: string; type: 'text' | 'image' }[] => 
    base.type === 'text' 
      ? langs.map(lang => ({
          id: `${base.id}${lang.code}`,
          label: `${base.label} ${lang.label}`,
          type: 'text' as const
        }))
      : [base]
  );

  const handleStartEdit = (id: string, current: string) => {
    setEditingId(id);
    setEditValue(current);
  };

  const handleSave = async (id: string, type: 'text' | 'image') => {
    await updateContent(id, editValue, type);
    setEditingId(null);
  };

  return (
    <div className="space-y-8">
      <div className="border-b border-surface-variant pb-8">
        <div className="space-y-2 mb-8">
          <h1 className="text-3xl font-serif font-bold text-primary">Gestão de Ajustes</h1>
          <p className="text-on-surface-variant font-medium opacity-70">Modifique textos, imagens e a paleta de cores global.</p>
        </div>

        <div className="flex space-x-8">
          <button
            onClick={() => setActiveTab('text')}
            className={`pb-2 text-sm font-bold uppercase tracking-[0.2em] transition-all border-b-2 ${
              activeTab === 'text' 
                ? 'text-primary border-primary' 
                : 'text-on-surface-variant opacity-40 border-transparent hover:opacity-100'
            }`}
          >
            Edição de Texto
          </button>
          <button
            onClick={() => setActiveTab('colors')}
            className={`pb-2 text-sm font-bold uppercase tracking-[0.2em] transition-all border-b-2 ${
              activeTab === 'colors' 
                ? 'text-primary border-primary' 
                : 'text-on-surface-variant opacity-40 border-transparent hover:opacity-100'
            }`}
          >
            Edição de Cores
          </button>
        </div>
      </div>

      {activeTab === 'colors' ? (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-primary">
                <Palette size={16} />
              </div>
              <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-secondary">Paleta de Cores (Customizada)</h3>
            </div>
            <button 
              onClick={resetColors}
              className="flex items-center space-x-2 text-[10px] font-bold uppercase tracking-widest text-secondary hover:text-primary transition-colors"
            >
              <RefreshCw size={12} />
              <span>Resetar para Padrão</span>
            </button>
          </div>
          
          <div className="space-y-6">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary opacity-50 px-1">Modo Claro</h4>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {lightThemeConfig.map((config) => {
                const currentValue = content[config.id]?.value || colors[config.key] || '#000000';
                return (
                  <div key={config.id} className="bg-admin-sidebar p-4 border border-surface-variant rounded-md shadow-sm space-y-3">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/60">{config.label}</p>
                    <div className="flex gap-2">
                      <input 
                        type="color"
                        value={currentValue}
                        onChange={(e) => handleColorChange(config.id, config.key, e.target.value)}
                        className="w-10 h-10 p-1 bg-surface-container border border-surface-variant rounded cursor-pointer"
                      />
                      <input 
                        type="text"
                        value={currentValue}
                        onChange={(e) => handleColorChange(config.id, config.key, e.target.value)}
                        className="flex-1 min-w-0 bg-surface-container px-2 py-1 rounded-sm border border-surface-variant outline-none focus:border-secondary transition-all font-mono text-[10px] text-on-surface"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary opacity-50 px-1">Modo Escuro</h4>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {darkThemeConfig.map((config) => {
                const currentValue = content[config.id]?.value || colors[config.key] || '#000000';
                return (
                  <div key={config.id} className="bg-admin-sidebar p-4 border border-surface-variant rounded-md shadow-sm space-y-3">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/60">{config.label}</p>
                    <div className="flex gap-2">
                      <input 
                        type="color"
                        value={currentValue}
                        onChange={(e) => handleColorChange(config.id, config.key, e.target.value)}
                        className="w-10 h-10 p-1 bg-surface-container border border-surface-variant rounded cursor-pointer"
                      />
                      <input 
                        type="text"
                        value={currentValue}
                        onChange={(e) => handleColorChange(config.id, config.key, e.target.value)}
                        className="flex-1 min-w-0 bg-surface-container px-2 py-1 rounded-sm border border-surface-variant outline-none focus:border-secondary transition-all font-mono text-[10px] text-on-surface"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {keys.map((key) => {
            const isEditing = editingId === key.id;
            const currentData = content[key.id];
            const currentValue = currentData?.value || '';

            return (
              <div key={key.id} className="bg-admin-sidebar p-8 border border-surface-variant rounded-md shadow-sm space-y-4 transition-all hover:border-secondary/20">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-primary">
                      {key.type === 'text' ? <Type size={16} /> : <ImageIcon size={16} />}
                    </div>
                    <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-secondary">{key.label}</h3>
                  </div>
                  {!isEditing && (
                    <button 
                      onClick={() => handleStartEdit(key.id, currentValue)}
                      className="text-xs font-bold uppercase tracking-widest text-primary hover:text-secondary opacity-50 hover:opacity-100 transition-all flex items-center space-x-2"
                    >
                      <RefreshCcw size={12} />
                      <span>Editar</span>
                    </button>
                  )}
                </div>

                {isEditing ? (
                  <div className="space-y-4">
                    {key.type === 'image' ? (
                      <ImageUploader 
                        currentUrl={editValue}
                        onUpload={(url) => setEditValue(url)}
                      />
                    ) : key.id.includes('bio') ? (
                      <textarea 
                        autoFocus
                        rows={6}
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="w-full bg-surface-container-low p-4 rounded-sm border border-surface-variant outline-none focus:border-secondary transition-all font-medium text-sm leading-relaxed text-on-surface"
                      />
                    ) : (
                      <input 
                        autoFocus
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="w-full bg-surface-container-low p-4 rounded-sm border border-surface-variant outline-none focus:border-secondary transition-all font-serif text-lg text-primary"
                      />
                    )}
                    <div className="flex space-x-3">
                      <button 
                        onClick={() => handleSave(key.id, key.type)}
                        className="flex items-center space-x-2 bg-primary text-white px-6 py-2 rounded-sm text-sm font-bold tracking-widest uppercase hover:bg-primary/90 shadow-md"
                      >
                        <Save size={14} />
                        <span>Salvar</span>
                      </button>
                      <button 
                        onClick={() => setEditingId(null)}
                        className="px-6 py-2 text-sm font-bold tracking-widest uppercase text-on-surface-variant hover:text-primary transition-colors"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="relative group">
                     {key.type === 'image' && currentValue ? (
                       <div className="aspect-video w-full max-w-md overflow-hidden rounded border border-surface-variant mb-2">
                          <img src={currentValue} alt="Preview" className="w-full h-full object-cover grayscale-[30%]" />
                       </div>
                     ) : null}
                    <p className={`text-on-surface-variant ${key.type === 'text' ? 'font-serif text-xl italic text-primary' : 'font-mono text-xs break-all'} opacity-80 leading-relaxed max-w-3xl whitespace-pre-line`}>
                      {currentValue || `Clique em editar para adicionar ${key.type === 'text' ? 'um texto' : 'uma imagem'}.`}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
