import React, { useState } from 'react';
import { useProjects } from '../../hooks/useFirebase';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import ImageUploader from '../ImageUploader';

export default function ProjectManager() {
  const { projects, addProject, editProject, removeProject, loading } = useProjects();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    category: '',
    tags: '',
    githubUrl: '',
    liveUrl: '',
    featured: false,
    order: 0
  });

  const handleOpenModal = (p?: any) => {
    if (p) {
      setEditingId(p.id);
      setFormData({
        title: p.title,
        description: p.description,
        imageUrl: p.imageUrl,
        category: p.category || '',
        tags: p.tags?.join(', ') || '',
        githubUrl: p.githubUrl || '',
        liveUrl: p.liveUrl || '',
        featured: p.featured || false,
        order: p.order || 0
      });
    } else {
      setEditingId(null);
      setFormData({
        title: '',
        description: '',
        imageUrl: '',
        category: '',
        tags: '',
        githubUrl: '',
        liveUrl: '',
        featured: false,
        order: projects.length
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      ...formData,
      tags: formData.tags.split(',').map(t => t.trim()).filter(t => t !== '')
    };

    if (editingId) {
      await editProject(editingId, data);
    } else {
      await addProject(data);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este projeto?')) {
      removeProject(id);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div className="space-y-2">
          <h1 className="text-3xl font-serif font-bold text-primary">Portfolio Archive</h1>
          <p className="text-on-surface-variant font-medium opacity-70">Gerencie seus projetos e trabalhos exibidos.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center space-x-2 bg-primary text-white px-6 py-3 rounded-sm font-bold tracking-widest uppercase hover:bg-primary/90 transition-all shadow-lg"
        >
          <Plus size={18} />
          <span>Novo Projeto</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          Array(3).fill(0).map((_, i) => <div key={i} className="aspect-[4/3] bg-white animate-pulse rounded-md" />)
        ) : (
          projects.map((project) => (
            <div key={project.id} className="bg-white border border-surface-variant rounded-md overflow-hidden flex flex-col group">
              <div className="aspect-video relative overflow-hidden bg-surface-container">
                <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover" />
                <div className="absolute top-2 right-2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleOpenModal(project)} className="p-2 bg-white text-primary hover:bg-secondary hover:text-white rounded shadow-sm">
                    <Edit2 size={16} />
                  </button>
                  <button onClick={() => handleDelete(project.id)} className="p-2 bg-white text-error hover:bg-error hover:text-white rounded shadow-sm">
                    <Trash2 size={16} />
                  </button>
                </div>
                {project.featured && (
                  <div className="absolute top-2 left-2 bg-secondary text-white text-[8px] font-bold uppercase tracking-widest px-2 py-1 rounded">
                    Destaque
                  </div>
                )}
              </div>
              <div className="p-4 space-y-2">
                <h3 className="font-serif font-bold text-primary">{project.title}</h3>
                <p className="text-xs text-on-surface-variant line-clamp-2">{project.description}</p>
                <div className="flex justify-between items-center pt-2 border-t border-surface-variant">
                   <span className="text-[10px] font-bold uppercase tracking-widest text-secondary">{project.category || 'Sem Categoria'}</span>
                   <span className="text-xs font-mono text-on-surface-variant opacity-50">Ordem: {project.order}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-primary/20 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="bg-white max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-lg shadow-2xl relative z-10 p-8 md:p-12 space-y-8">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-serif font-bold text-primary">{editingId ? 'Editar Projeto' : 'Adicionar Projeto'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-on-surface-variant hover:text-primary"><X size={24} /></button>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-secondary">Título do Projeto</label>
                <input 
                  required
                  value={formData.title} 
                  onChange={e => setFormData({...formData, title: e.target.value})}
                  className="w-full border-b border-surface-variant focus:border-primary py-2 outline-none font-serif text-lg" 
                />
              </div>

              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-secondary">Descrição Curta</label>
                <textarea 
                  required
                  rows={3}
                  value={formData.description} 
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  className="w-full border-b border-surface-variant focus:border-primary py-2 outline-none text-sm resize-none" 
                />
              </div>

              <div className="md:col-span-2">
                <ImageUploader 
                  label="Imagem do Projeto"
                  currentUrl={formData.imageUrl}
                  onUpload={(url) => setFormData({...formData, imageUrl: url})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-secondary">Categoria</label>
                <input 
                  value={formData.category} 
                  onChange={e => setFormData({...formData, category: e.target.value})}
                  className="w-full border-b border-surface-variant focus:border-primary py-2 outline-none text-sm" 
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-secondary">Tags (separadas por vírgula)</label>
                <input 
                  value={formData.tags} 
                  onChange={e => setFormData({...formData, tags: e.target.value})}
                  className="w-full border-b border-surface-variant focus:border-primary py-2 outline-none text-sm" 
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-secondary">Github Link</label>
                <input 
                  value={formData.githubUrl} 
                  onChange={e => setFormData({...formData, githubUrl: e.target.value})}
                  className="w-full border-b border-surface-variant focus:border-primary py-2 outline-none text-sm" 
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-secondary">Live Link</label>
                <input 
                  value={formData.liveUrl} 
                  onChange={e => setFormData({...formData, liveUrl: e.target.value})}
                  className="w-full border-b border-surface-variant focus:border-primary py-2 outline-none text-sm" 
                />
              </div>

              <div className="flex items-center space-x-12">
                 <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-secondary">Ordem</label>
                  <input 
                    type="number"
                    value={formData.order} 
                    onChange={e => setFormData({...formData, order: parseInt(e.target.value)})}
                    className="w-16 border-b border-surface-variant focus:border-primary py-2 outline-none text-sm" 
                  />
                </div>
                 <div className="flex items-center space-x-2 pt-6">
                  <input 
                    type="checkbox"
                    id="featured"
                    checked={formData.featured} 
                    onChange={e => setFormData({...formData, featured: e.target.checked})}
                    className="w-4 h-4 accent-primary" 
                  />
                  <label htmlFor="featured" className="text-sm font-bold text-primary">Destaque</label>
                </div>
              </div>

              <div className="md:col-span-2 pt-8">
                <button 
                  type="submit"
                  className="w-full bg-primary text-white py-4 rounded-sm font-bold tracking-[0.2em] uppercase hover:bg-primary/95 transition-all shadow-xl"
                >
                  {editingId ? 'Salvar Alterações' : 'Criar Projeto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
