import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Send, CheckCircle, Github, Linkedin, MessageCircle } from 'lucide-react';
import { useMessages } from '../hooks/useFirebase';
import { useTranslation } from 'react-i18next';

export default function Contact() {
  const { sendMessage } = useMessages();
  const { t } = useTranslation();
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    try {
      await sendMessage(formData.name, formData.email, formData.message);
      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setStatus('idle'), 5000);
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 md:py-24 pb-32">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-24 items-start">
        {/* Left Side: Info */}
        <div className="space-y-12">
          <div className="space-y-6">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-secondary">{t('contact.get_in_touch')}</p>
            <h1 className="text-5xl md:text-6xl font-serif font-bold text-primary leading-tight">
              {t('contact.title', { defaultValue: "Let's create something extraordinary together." })}
            </h1>
            <p className="text-lg text-on-surface-variant font-medium opacity-80 leading-relaxed max-w-md">
              {t('contact.sub')}
            </p>
          </div>

          <div className="space-y-8">
            <div className="flex items-center space-x-6 group">
              <div className="w-12 h-12 flex items-center justify-center bg-surface-container border border-surface-variant group-hover:bg-primary group-hover:text-white transition-all duration-300">
                <Mail size={20} />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-secondary">Email</p>
                <p className="text-lg font-serif font-bold text-primary">pauloribeirosantos1606@gmail.com</p>
              </div>
            </div>

            <div className="flex items-center space-x-6 group">
              <div className="w-12 h-12 flex items-center justify-center bg-surface-container border border-surface-variant group-hover:bg-primary group-hover:text-white transition-all duration-300">
                <MessageCircle size={20} />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-secondary">WhatsApp</p>
                <a href="https://wa.me/5500000000000" target="_blank" rel="noreferrer" className="text-lg font-serif font-bold text-primary hover:text-secondary transition-colors">+55 (00) 00000-0000</a>
              </div>
            </div>

            <div className="flex items-center space-x-6 group">
              <div className="w-12 h-12 flex items-center justify-center bg-surface-container border border-surface-variant group-hover:bg-primary group-hover:text-white transition-all duration-300">
                <MapPin size={20} />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-secondary">{t('contact.location')}</p>
                <p className="text-lg font-serif font-bold text-primary">{t('contact.location.city')}</p>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-surface-variant flex space-x-6">
            <a href="https://github.com" target="_blank" rel="noreferrer" className="text-on-surface-variant hover:text-primary transition-colors flex items-center space-x-2 font-bold uppercase tracking-widest text-xs">
              <Github size={18} />
              <span>Github</span>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="text-on-surface-variant hover:text-primary transition-colors flex items-center space-x-2 font-bold uppercase tracking-widest text-xs">
              <Linkedin size={18} />
              <span>LinkedIn</span>
            </a>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="bg-surface p-8 md:p-16 border border-surface-variant shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 -translate-y-1/2 translate-x-1/2 rounded-full blur-2xl" />
          
          <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
            <div className="space-y-2">
              <label htmlFor="name" className="text-[10px] font-bold uppercase tracking-widest text-secondary">{t('contact.form.name')}</label>
              <input
                id="name"
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder={t('contact.form.placeholder.name')}
                className="w-full bg-transparent border-b border-surface-variant py-3 focus:outline-none focus:border-primary transition-all font-serif text-lg placeholder:opacity-30"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-[10px] font-bold uppercase tracking-widest text-secondary">{t('contact.form.email')}</label>
              <input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder={t('contact.form.placeholder.email')}
                className="w-full bg-transparent border-b border-surface-variant py-3 focus:outline-none focus:border-primary transition-all font-serif text-lg placeholder:opacity-30"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="message" className="text-[10px] font-bold uppercase tracking-widest text-secondary">{t('contact.form.message')}</label>
              <textarea
                id="message"
                required
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                placeholder={t('contact.form.messagePlaceholder', { defaultValue: 'Como posso te ajudar?' })}
                className="w-full bg-transparent border-b border-surface-variant py-3 focus:outline-none focus:border-primary transition-all font-serif text-lg placeholder:opacity-30 resize-none"
              />
            </div>

            <button
              disabled={status === 'sending' || status === 'success'}
              type="submit"
              className={`w-full py-5 rounded-sm font-bold tracking-[0.2em] uppercase transition-all flex items-center justify-center space-x-3 group ${
                status === 'success' 
                  ? 'bg-secondary text-white' 
                  : status === 'error'
                    ? 'bg-error text-white'
                    : 'bg-primary text-white hover:bg-primary/95 card-hover'
              }`}
            >
              {status === 'sending' ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : status === 'success' ? (
                <>
                  <CheckCircle size={20} />
                  <span>{t('contact.form.success')}</span>
                </>
              ) : status === 'error' ? (
                <span>{t('contact.form.error')}</span>
              ) : (
                <>
                  <span>{t('contact.form.send')}</span>
                  <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
