import React, { useState, useRef } from 'react';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../lib/firebase';
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface ImageUploaderProps {
  onUpload: (url: string) => void;
  currentUrl?: string;
  label?: string;
}

export default function ImageUploader({ onUpload, currentUrl, label }: ImageUploaderProps) {
  const { t } = useTranslation();
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      console.log('No file selected');
      return;
    }

    console.log('Starting upload for:', file.name, 'size:', file.size, 'type:', file.type);

    // Basic validation
    if (!file.type.startsWith('image/')) {
      setError(t('admin.uploader.error.invalid_type', { defaultValue: 'Por favor, selecione uma imagem válida.' }));
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // Increase to 5MB
      setError(t('admin.uploader.error.size', { defaultValue: 'A imagem deve ter menos de 5MB.' }));
      return;
    }

    setUploading(true);
    setProgress(0);
    setError(null);

    try {
      console.log('Preparing storage reference...');
      const bucketName = storage.app.options.storageBucket;
      if (!bucketName) {
        throw new Error('Configuração storageBucket ausente no firebase-applet-config.json');
      }

      const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      const storageRef = ref(storage, `uploads/${fileName}`);
      
      const uploadTask = uploadBytesResumable(storageRef, file);

      // Add a safety timeout (30 seconds)
      const timeoutId = setTimeout(() => {
        uploadTask.cancel();
        setError('O upload demorou muito tempo (Timeout). Verifique se o Storage está ATIVADO no Console do Firebase e se o CORS está configurado.');
        setUploading(false);
      }, 30000);

      return new Promise<void>((resolve, reject) => {
        uploadTask.on('state_changed', 
          (snapshot) => {
            const p = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + p + '% done');
            setProgress(p);
          }, 
          (err: any) => {
            clearTimeout(timeoutId);
            console.error('Upload task error:', err);
            let message = t('admin.uploader.error.generic', { defaultValue: 'Erro ao fazer upload. Tente novamente.' });
            
            if (err.code === 'storage/unauthorized') {
              message = 'Erro de permissão no Firebase Storage. Certifique-se de que o Storage está ativado no Console do Firebase e as regras foram aplicadas.';
            } else if (err.code === 'storage/canceled') {
              message = 'Upload cancelado ou tempo expirado (Timeout).';
            } else if (err.code === 'storage/retry-limit-exceeded') {
              message = 'Falha recorrente (Retry Limit). Verifique se o Storage foi inicializado no Console.';
            } else if (err.code === 'storage/invalid-default-bucket') {
              message = 'O bucket padrão é inválido. Verifique o identificador no console do Firebase.';
            }
            
            setError(message);
            setUploading(false);
            reject(err);
          }, 
          async () => {
            clearTimeout(timeoutId);
            try {
              console.log('Upload successful, getting download URL...');
              const url = await getDownloadURL(uploadTask.snapshot.ref);
              console.log('Download URL obtained:', url);
              onUpload(url);
              setUploading(false);
              resolve();
            } catch (urlErr) {
              console.error('URL error:', urlErr);
              setError('Erro ao obter link da imagem.');
              setUploading(false);
              reject(urlErr);
            }
          }
        );
      });
    } catch (err: any) {
      console.error('Outer upload error:', err);
      setUploading(false);
    } finally {
      // Reset input
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="text-[10px] font-bold uppercase tracking-widest text-secondary block">
          {label}
        </label>
      )}
      
      <div className="flex flex-col space-y-4">
        {currentUrl ? (
          <div className="relative group w-full aspect-video bg-surface-container rounded-md overflow-hidden border border-surface-variant">
            <img src={currentUrl} alt="Preview" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2 bg-white text-primary rounded-full hover:scale-110 transition-transform"
                title={t('admin.uploader.change', { defaultValue: 'Trocar imagem' })}
              >
                <Upload size={18} />
              </button>
              <button
                type="button"
                onClick={() => onUpload('')}
                className="p-2 bg-white text-error rounded-full hover:scale-110 transition-transform"
                title={t('admin.uploader.remove', { defaultValue: 'Remover' })}
              >
                <X size={18} />
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="w-full aspect-video border-2 border-dashed border-surface-variant rounded-md flex flex-col items-center justify-center space-y-2 hover:border-secondary transition-colors group"
          >
            {uploading ? (
              <div className="flex flex-col items-center space-y-2">
                <Loader2 size={32} className="animate-spin text-secondary" />
                <span className="text-[10px] font-bold text-secondary">{Math.round(progress)}%</span>
              </div>
            ) : (
              <>
                <Upload size={32} className="text-surface-variant group-hover:text-secondary transition-colors" />
                <span className="text-xs font-bold uppercase tracking-widest text-on-surface/40 group-hover:text-secondary transition-colors">
                  {t('admin.uploader.upload_button', { defaultValue: 'Upload Imagem' })}
                </span>
              </>
            )}
          </button>
        )}

        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <input
              type="text"
              value={currentUrl || ''}
              onChange={(e) => onUpload(e.target.value)}
              placeholder={t('admin.uploader.placeholder', { defaultValue: 'Cole uma URL ou faça upload...' })}
              className="w-full bg-transparent border-b border-surface-variant py-2 focus:outline-none focus:border-secondary transition-all font-mono text-xs placeholder:opacity-30"
            />
          </div>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-2 text-on-surface-variant hover:text-secondary transition-colors"
            title={t('admin.uploader.upload_file', { defaultValue: 'Upload arquivo' })}
          >
            <ImageIcon size={20} />
          </button>
        </div>

        {error && (
          <p className="text-[10px] font-bold text-error uppercase tracking-widest">{error}</p>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleUpload}
        />
      </div>
    </div>
  );
}
