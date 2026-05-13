import { useEffect } from 'react';
import { useMessages } from '../../hooks/useFirebase';
import { Mail, User, Clock, Trash2, RefreshCcw } from 'lucide-react';

export default function MessageCenter() {
  const { messages, loading, fetchMessages, deleteMessage } = useMessages();

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm('Deseja excluir esta mensagem permanentemente?')) {
      await deleteMessage(id);
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
    </div>
  );
}
