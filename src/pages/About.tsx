import { motion } from 'motion/react';
import { useContent } from '../hooks/useFirebase';
import { useTranslation } from 'react-i18next';
import { User } from 'lucide-react';

export default function About() {
  const { content } = useContent();
  const { t, i18n } = useTranslation();

  const currentLang = i18n.language.split('-')[0];

  const getTranslatableContent = (key: string, fallback: string) => {
    const langKey = `${key}_${currentLang}`;
    return content[langKey]?.value || content[key]?.value || fallback;
  };

  const aboutTitle = getTranslatableContent('about_title', t('about.title', { defaultValue: "Multidisciplinary designer based in Brazil, focused on building digital products." }));
  const aboutBio = getTranslatableContent('about_bio', t('about.bio', { defaultValue: "My journey started with a fascination for how design can influence behavior. Over the years, I've had the privilege of working with startups and established brands, helping them find their voice in the digital space.\n\nI believe that the best design is invisible—it should guide the user without them even noticing. This philosophy drives my approach to every project, from complex web applications to minimalist branding identities." }));
  const aboutImage = content['about_image']?.value || "https://images.unsplash.com/photo-1544717297-fa95b3ee9bc6?auto=format&fit=crop&q=80&w=800";

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 md:py-24 space-y-24 pb-32">
       {/* Hero Section */}
       <section className="flex flex-col md:flex-row gap-16 items-start">
        <div className="flex-1 space-y-8">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-secondary">{t('about.title')}</p>
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-primary leading-tight">
            {aboutTitle}
          </h1>
          <div className="prose prose-lg prose-slate text-on-surface-variant font-medium opacity-80 leading-relaxed whitespace-pre-line">
            {aboutBio}
          </div>
        </div>
        <div className="flex-1 w-full flex justify-end">
          <div className="relative group max-w-lg w-full">
            <div className="absolute -inset-2 border-2 border-secondary/20 translate-x-4 translate-y-4 transition-transform group-hover:translate-x-6 group-hover:translate-y-6" />
            {aboutImage && !aboutImage.includes('unsplash.com/photo-1544717297-fa95b3ee9bc6') ? (
              <img 
                src={aboutImage} 
                alt="Paulo" 
                className="w-full aspect-[3/4] object-cover rounded-sm relative z-10 shadow-lg"
              />
            ) : (
              <div className="w-full aspect-[3/4] bg-surface-container flex items-center justify-center rounded-sm relative z-10 shadow-lg border border-surface-variant">
                <User size={80} className="text-secondary opacity-20" />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section className="space-y-12">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-secondary text-center">{t('about.career.title')}</p>
        <h2 className="text-4xl font-serif font-bold text-primary text-center italic">{t('about.experience.title')}</h2>
        
        <div className="max-w-4xl mx-auto mt-16 space-y-12 relative before:content-[''] before:absolute before:left-0 md:before:left-1/2 before:w-px before:h-full before:bg-surface-variant before:-translate-x-1/2">
          {[
            { role: 'Senior Design Lead', company: 'Innovation Studio', period: '2022 — Present', desc: 'Leading a team of designers to build scalable design systems and high-fidelity prototypes for enterprise clients.' },
            { role: 'UI/UX Designer', company: 'Creative Agency', period: '2019 — 2022', desc: 'Specialized in mobile-first web applications and interactive marketing experiences for global brands.' },
            { role: 'Product Designer', company: 'Tech Startup', period: '2017 — 2019', desc: 'Responsible for end-to-end product design, from user research and wireframing to final hand-off.' },
          ].map((exp, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className={`flex flex-col md:flex-row items-start md:items-center gap-8 relative ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
            >
              <div className="absolute left-0 md:left-1/2 w-4 h-4 bg-secondary rounded-full -translate-x-1/2 z-10 border-4 border-white shadow-sm" />
              <div className={`md:flex-1 space-y-2 p-8 bg-white border border-surface-variant rounded-sm shadow-sm hover:border-secondary transition-all ${i % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                <p className="text-[10px] font-bold uppercase tracking-widest text-secondary">{exp.period}</p>
                <h3 className="text-xl font-serif font-bold text-primary">{t(`about.experience.${i}.role`, { defaultValue: exp.role })}</h3>
                <p className="text-sm font-bold text-on-surface-variant">{exp.company}</p>
                <p className={`text-sm text-on-surface-variant opacity-70 leading-relaxed max-w-sm ${i % 2 === 0 ? 'ml-auto mr-0' : 'mr-auto ml-0'}`}>
                  {t(`about.experience.${i}.desc`, { defaultValue: exp.desc })}
                </p>
              </div>
              <div className="md:flex-1" />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Skills Grid */}
      <section className="bg-surface-container -mx-6 px-6 py-24">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-secondary">{t('about.capabilities.title')}</p>
            <h2 className="text-4xl font-serif font-bold text-primary italic">{t('about.capabilities.subtitle')}</h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { id: 'brand', title: 'Brand Identity', skills: ['Logo Design', 'Visual Strategy', 'Style Guides'] },
              { id: 'uxui', title: 'UX/UI Design', skills: ['Wireframing', 'Prototyping', 'User Flows'] },
              { id: 'dev', title: 'Development', skills: ['React', 'Tailwind CSS', 'Node.js'] },
              { id: 'strat', title: 'Strategy', skills: ['User Research', 'Content Strategy', 'Product Roadmap'] },
            ].map((skill) => (
              <div key={skill.id} className="space-y-4 p-8 border border-surface-variant bg-white rounded-sm">
                <h3 className="text-lg font-serif font-bold text-primary">{t(`about.skills.${skill.id}.title`, { defaultValue: skill.title })}</h3>
                <ul className="space-y-2">
                  {skill.skills.map((s, index) => (
                    <li key={index} className="text-xs font-medium text-on-surface-variant opacity-70 flex items-center space-x-2">
                      <span className="w-1.5 h-1.5 bg-secondary/50 rounded-full" />
                      <span>{t(`about.skills.${skill.id}.item.${index}`, { defaultValue: s })}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
