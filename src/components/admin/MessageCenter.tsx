import { useState, useEffect } from 'react';
import { useMessages } from '../../hooks/useFirebase';
import { Mail, Clock, Trash2, RefreshCcw, X } from 'lucide-react';

export default function MessageCenter() {
  const { messages, loading, fetchMessages, deleteMessage } = useMessages();
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleDelete = (id: string) => {
    setMessageToDelete(id);
    setIsDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (messageToDelete) {
      try {
        setError(null);
        await deleteMessage(messageToDelete);
        setIsDeleteConfirmOpen(false);
        setMessageToDelete(null);
      } catch (err: any) {
        setError("Não foi possível excluir a mensagem.");
        console.error(err);
      }
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex justify-between items-end">
        <div className="space-y-2">
          <h1 className="text-3xl font-serif font-bold text-primary">Message Center</h1>
          <p className="text-on-surface-variant font-medium opacity-70">Mensagens recebidas através do formulário de contato.</p>
        </div>
        <button 
          onClick={() => fetchMessages()}
          className="p-3 text-primary hover:bg-white rounded-full transition-all border border-transparent hover:border-surface-variant"
        >
          <RefreshCcw size={20} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {error && (
        <div className="bg-error/10 border border-error/20 text-error p-4 rounded-md text-sm flex justify-between items-center">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="hover:opacity-70"><X size={16} /></button>
        </div>
      )}

      <div className="space-y-4">
        {loading && messages.length === 0 ? (
          Array(3).fill(0).map((_, i) => <div key={i} className="h-32 bg-white animate-pulse rounded-md" />)
        ) : messages.length === 0 ? (
          <div className="text-center py-24 bg-white border border-dashed border-surface-variant rounded-md">
            <Mail size={48} className="mx-auto text-surface-variant mb-4" />
            <p className="font-serif text-xl italic text-on-surface-variant">Vazio por aqui...</p>
            <p className="text-sm opacity-50 font-medium">Você ainda não recebeu nenhuma mensagem.</p>
          </div>
        ) : (
          messages.map((message) => (
            <div key={message.id} className="bg-white border border-surface-variant rounded-md p-8 group relative hover:border-secondary/30 transition-all flex flex-col md:flex-row gap-8">
              <div className="md:w-64 space-y-4 pt-1">
                 <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary font-bold">
                      {message.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-serif font-bold text-primary truncate leading-none">{message.name}</h4>
                      <a href={`mailto:${message.email}`} className="text-xs text-secondary hover:underline truncate">{message.email}</a>
                    </div>
                 </div>
                 <div className="flex items-center space-x-2 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant opacity-40">
                    <Clock size={12} />
                    <span>{message.createdAt?.toDate ? message.createdAt.toDate().toLocaleString('pt-BR') : 'Agora'}</span>
                 </div>
              </div>

              <div className="flex-grow">
                <p className="text-on-surface-variant text-sm font-medium leading-relaxed opacity-80 whitespace-pre-line">
                  {message.message}
                </p>
              </div>

              <button 
                onClick={() => handleDelete(message.id)}
                className="absolute top-6 right-6 p-2 text-on-surface-variant hover:text-error opacity-0 group-hover:opacity-100 transition-all"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {isDeleteConfirmOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-primary/40 backdrop-blur-sm" onClick={() => setIsDeleteConfirmOpen(false)} />
          <div className="bg-white max-w-sm w-full rounded-lg shadow-2xl relative z-10 p-8 text-center space-y-6">
            <div className="w-16 h-16 bg-error/10 text-error rounded-full flex items-center justify-center mx-auto">
              <Trash2 size={32} />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-serif font-bold text-primary">Excluir Mensagem</h3>
              <p className="text-sm text-on-surface-variant font-medium opacity-70">
                Tem certeza que deseja remover esta mensagem permanentemente?
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button 
                onClick={() => setIsDeleteConfirmOpen(false)}
                className="flex-1 bg-surface-container text-primary py-3 rounded-sm font-bold tracking-widest uppercase hover:bg-surface-container-high transition-all"
              >
                Cancelar
              </button>
              <button 
                onClick={confirmDelete}
                className="flex-1 bg-[#ba1a1a] text-white py-3 rounded-sm font-bold tracking-widest uppercase hover:bg-[#a01515] transition-all shadow-md"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
