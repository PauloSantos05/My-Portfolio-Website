import { motion } from 'motion/react';
import { ArrowRight, Code, Palette, Zap, Mail, MapPin, Github, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useProjects, useContent } from '../hooks/useFirebase';
import { useTranslation } from 'react-i18next';

export default function Home() {
  const { projects, loading: projectsLoading } = useProjects();
  const { content } = useContent();
  const { t, i18n } = useTranslation();

  const currentLang = i18n.language.split('-')[0]; // Handle language variants like pt-BR

  // Try to get content based on current language if specified in key, else fallback
  const getTranslatableContent = (key: string, fallback: string) => {
    const langKey = `${key}_${currentLang}`;
    return content[langKey]?.value || content[key]?.value || fallback;
  };

  const heroTitle = getTranslatableContent('hero_title', t('home.hero.title', { defaultValue: "Crafting timeless digital experiences with purpose and precision." }));
  const heroSub = getTranslatableContent('hero_sub', t('home.hero.sub', { defaultValue: "I am a multidisciplinary creator rooted in the intersection of organic aesthetics and professional stability. My work prioritizes clarity, high-contrast typography, and meticulous attention to detail." }));
  const heroImage = content['hero_image']?.value || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800";

  const featuredProjects = projects.filter(p => p.featured).slice(0, 3);

  return (
    <div className="space-y-section pb-24">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-12 md:pt-24 flex flex-col md:flex-row items-center gap-16">
        <div className="flex-1 space-y-8">
          <motion.p 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-[10px] font-bold uppercase tracking-[0.2em] text-secondary"
          >
            {t('home.hero.subtitle')}
          </motion.p>
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-5xl md:text-7xl font-serif font-bold leading-[1.1] text-primary"
          >
            {heroTitle.split(' ').map((word, i) => (
              <span key={i} className={word.toLowerCase() === 'purpose' || word.toLowerCase() === 'precision.' ? 'italic font-serif font-medium' : ''}>
                {word}{' '}
              </span>
            ))}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-on-surface-variant max-w-lg leading-relaxed font-medium opacity-80"
          >
            {heroSub}
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap gap-4"
          >
            <a href="#projects" className="bg-primary text-white px-8 py-4 rounded-sm font-bold tracking-widest uppercase hover:bg-primary/95 transition-all card-hover">
              {t('nav.portfolio')}
            </a>
            <Link to="/sobre" className="bg-white border border-surface-variant text-primary px-8 py-4 rounded-sm font-bold tracking-widest uppercase hover:bg-surface transition-all">
              {t('nav.about')}
            </Link>
          </motion.div>
        </div>
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex-1 relative"
        >
          <div className="absolute -inset-4 border border-secondary/20 translate-x-4 translate-y-4" />
          {heroImage && !heroImage.includes('unsplash.com/photo-1507003211169') ? (
            <img 
              src={heroImage} 
              alt="Designer" 
              className="w-full aspect-[4/5] object-cover rounded-sm relative z-10 grayscale-[30%] contrast-[110%]"
            />
          ) : (
            <div className="w-full aspect-[4/5] bg-surface-container flex items-center justify-center rounded-sm relative z-10 grayscale-[30%] contrast-[110%] border border-surface-variant">
              <User size={80} className="text-secondary opacity-20" />
            </div>
          )}
          <div className="absolute bottom-6 left-6 z-20 bg-white/90 backdrop-blur px-6 py-4 border border-surface-variant shadow-sm">
            <p className="text-3xl font-serif font-bold text-primary">05+</p>
            <p className="text-[10px] font-bold uppercase tracking-widest text-secondary">{t('home.hero.experience')}</p>
          </div>
        </motion.div>
      </section>

      {/* Selected Projects */}
      <section id="projects" className="max-w-7xl mx-auto px-6 space-y-12">
        <div className="flex justify-between items-end">
          <div className="space-y-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-secondary">{t('home.projects.subtitle')}</p>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary italic">{t('home.projects.title')}</h2>
          </div>
          <Link to="/portfolio" className="hidden md:flex items-center space-x-2 text-sm font-bold uppercase tracking-widest text-on-surface-variant hover:text-secondary transition-colors underline decoration-secondary decoration-2 underline-offset-8">
            <span>{t('home.projects.viewAll')}</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projectsLoading ? (
            Array(3).fill(0).map((_, i) => (
              <div key={i} className="aspect-[4/3] bg-surface-container animate-pulse" />
            ))
          ) : (
            projects.map((project) => (
              <motion.div 
                key={project.id}
                whileHover={{ y: -8 }}
                className="group bg-white border border-surface-variant rounded-sm overflow-hidden"
              >
                <div className="aspect-[4/3] overflow-hidden relative">
                  <img 
                    src={project.imageUrl} 
                    alt={project.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-4">
                    {project.liveUrl && (
                       <a href={project.liveUrl} target="_blank" rel="noreferrer" className="bg-white p-3 rounded-full hover:bg-secondary hover:text-white transition-all">
                        <ArrowRight size={20} className="-rotate-45" />
                       </a>
                    )}
                     {project.githubUrl && (
                       <a href={project.githubUrl} target="_blank" rel="noreferrer" className="bg-white p-3 rounded-full hover:bg-secondary hover:text-white transition-all">
                        <Github size={20} />
                       </a>
                    )}
                  </div>
                </div>
                <div className="p-8 space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {project.category && (
                      <span className="text-[10px] font-bold uppercase tracking-widest bg-surface p-2 rounded-sm text-secondary">
                        {project.category}
                      </span>
                    )}
                  </div>
                  <h3 className="text-2xl font-serif font-bold text-primary">{project.title}</h3>
                  <p className="text-on-surface-variant text-sm font-medium leading-relaxed opacity-80">
                    {project.description}
                  </p>
                  <button className="text-sm font-bold uppercase tracking-widest text-primary hover:text-secondary transition-colors inline-flex items-center space-x-2 underline decoration-secondary/30 decoration-1 underline-offset-4">
                    <span>{t('home.projects.readMore')}</span>
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </section>

      {/* Pillars Section */}
      <section className="bg-surface-container py-24 px-6 mt-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-16">
          <div className="space-y-6">
            <div className="w-12 h-12 flex items-center justify-center text-secondary border border-secondary/30">
              <Palette size={24} />
            </div>
            <h3 className="text-2xl font-serif font-bold text-primary">{t('home.pillars.design.title')}</h3>
            <div className="flex flex-wrap gap-2">
              {['Art Direction', 'UI/UX Systems', 'Typography', 'Identity'].map(tag => (
                 <span key={tag} className="text-[10px] font-bold uppercase tracking-widest bg-white/50 px-3 py-1 border border-surface-variant">
                   {t(`home.pillars.design.tag.${tag.toLowerCase().replace(/ /g, '_')}`, { defaultValue: tag })}
                 </span>
              ))}
            </div>
          </div>
          
          <div className="space-y-6">
             <div className="w-12 h-12 flex items-center justify-center text-secondary border border-secondary/30">
              <Code size={24} />
            </div>
            <h3 className="text-2xl font-serif font-bold text-primary">{t('home.pillars.tech.title')}</h3>
            <div className="flex flex-wrap gap-2">
              {['React', 'TypeScript', 'Node.js', 'Firebase'].map(tag => (
                <span key={tag} className="text-[10px] font-bold uppercase tracking-widest bg-white/50 px-3 py-1 border border-surface-variant">{tag}</span>
              ))}
            </div>
          </div>

          <div className="space-y-6">
             <div className="w-12 h-12 flex items-center justify-center text-secondary border border-secondary/30">
              <Zap size={24} />
            </div>
            <h3 className="text-2xl font-serif font-bold text-primary">{t('home.pillars.strategy.title')}</h3>
            <div className="flex flex-wrap gap-2">
              {['Product Strategy', 'User Research', 'Workshop Facilitation'].map(tag => (
                <span key={tag} className="text-[10px] font-bold uppercase tracking-widest bg-white/50 px-3 py-1 border border-surface-variant">
                  {t(`home.pillars.strategy.tag.${tag.toLowerCase().replace(/ /g, '_')}`, { defaultValue: tag })}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="bg-primary text-white p-12 md:p-24 rounded-sm flex flex-col md:flex-row justify-between items-center gap-12 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 -translate-y-1/2 translate-x-1/2 rounded-full blur-3xl" />
          
          <div className="space-y-8 z-10 w-full md:max-w-xl">
            <h2 className="text-4xl md:text-6xl font-serif font-bold italic leading-tight">
              {t('home.cta.title')}
            </h2>
            <p className="text-lg opacity-70 font-medium leading-relaxed">
              {t('home.cta.sub')}
            </p>
            <div className="space-y-4 pt-4">
              <div className="flex items-center space-x-4">
                 <Mail className="text-secondary" />
                 <span className="font-medium">pauloribeirosantos1606@gmail.com</span>
              </div>
               <div className="flex items-center space-x-4">
                 <MapPin className="text-secondary" />
                 <span className="font-medium">{t('contact.location.city')}</span>
              </div>
            </div>
          </div>

          <div className="w-full md:w-[400px] bg-white p-8 md:p-12 shadow-2xl z-10">
            <Link to="/contato" className="w-full bg-secondary text-white py-4 px-6 text-center font-bold tracking-widest uppercase flex items-center justify-center space-x-2 hover:bg-secondary/90 transition-all">
              <span>{t('home.cta.button')}</span>
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
