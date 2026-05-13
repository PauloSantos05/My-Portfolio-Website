import React, { useState, useRef } from 'react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
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
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Basic validation
    if (!file.type.startsWith('image/')) {
      setError(t('admin.uploader.error.invalid_type', { defaultValue: 'Por favor, selecione uma imagem válida.' }));
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setError(t('admin.uploader.error.size', { defaultValue: 'A imagem deve ter menos de 2MB.' }));
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const storageRef = ref(storage, `uploads/${Date.now()}-${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      onUpload(url);
    } catch (err) {
      console.error('Upload error:', err);
      setError(t('admin.uploader.error.generic', { defaultValue: 'Erro ao fazer upload. Tente novamente.' }));
    } finally {
      setUploading(false);
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
              <Loader2 size={32} className="animate-spin text-secondary" />
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
