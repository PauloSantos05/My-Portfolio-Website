import { useState } from 'react';
import { useContent } from '../../hooks/useFirebase';
import { Save, RefreshCcw, Type, Image as ImageIcon } from 'lucide-react';
import ImageUploader from '../ImageUploader';

export default function ContentManager() {
  const { content, updateContent, loading } = useContent();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  const baseKeys = [
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
      <div className="space-y-2">
        <h1 className="text-3xl font-serif font-bold text-primary">Gestão de Conteúdo</h1>
        <p className="text-on-surface-variant font-medium opacity-70">Modifique textos e imagens do site em tempo real.</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {keys.map((key) => {
          const isEditing = editingId === key.id;
          const currentData = content[key.id];
          const currentValue = currentData?.value || '';

          return (
            <div key={key.id} className="bg-white p-8 border border-surface-variant rounded-md shadow-sm space-y-4 transition-all hover:border-secondary/20">
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
                      className="w-full bg-surface-container-low p-4 rounded-sm border border-surface-variant outline-none focus:border-secondary transition-all font-medium text-sm leading-relaxed"
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
    </div>
  );
}
