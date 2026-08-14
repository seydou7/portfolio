import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Mail, Phone, Link2, Monitor, Globe, Code, Palette, MapPin } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import './AccueilV2.css'

/* ============================================================
   ANIMATION VARIANTS
   ============================================================ */
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.4, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] },
  }),
}

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

/* ============================================================
   MAIN PAGE
   ============================================================ */
export default function AccueilV2() {
  const { t } = useTranslation()

  const projets = [
    {
      id: 'ndymbel',
      org: 'CETUD',
      nom: 'Ndimbël — Tarifs Sociaux',
      description: 'Conception d’une plateforme multi-profils destinée à gérer les demandes, l’évaluation des bénéficiaires et la production des cartes de transport social.',
      tags: ['UX Design', 'UI Design', 'Dashboard', 'Design system'],
      infos: 'Plateforme institutionnelle · Parcours multi-rôles',
      key: 'cetud'
    },
    {
      id: 'etpe',
      org: 'Trésor Public',
      nom: 'eTPE — Gestion des pièces comptables',
      description: 'Conception d’un outil métier permettant de centraliser, contrôler et transmettre les pièces comptables des postes diplomatiques et consulaires.',
      tags: ['Product Design', 'UX Architecture', 'Data tables', 'Prototypage'],
      infos: 'Produit métier · Processus administratifs complexes',
      key: 'etpe'
    },
    {
      id: 'livelearn',
      org: 'LiveLearn',
      nom: 'LiveLearn — Plateforme e-learning',
      description: 'Refonte de l’expérience et des interfaces d’une plateforme de formation en ligne, avec adaptation responsive et accompagnement de l’intégration front-end.',
      tags: ['UX/UI', 'Responsive', 'E-learning', 'Front-end'],
      infos: 'Plateforme web · Refonte d’expérience',
      key: 'livelearn'
    }
  ]

  // Méthode de travail
  const methodes = [
    { num: '01', titre: 'Comprendre', texte: 'Identifier les utilisateurs, le contexte métier, les objectifs et les contraintes du projet.' },
    { num: '02', titre: 'Structurer', texte: 'Organiser l’information, définir les parcours et prioriser les fonctionnalités importantes.' },
    { num: '03', titre: 'Concevoir', texte: 'Explorer les solutions, produire les wireframes, les prototypes et les interfaces haute fidélité.' },
    { num: '04', titre: 'Accompagner', texte: 'Préparer le handoff, collaborer avec les développeurs et vérifier la qualité de l’intégration.' }
  ]

  // Parcours
  const parcours = [
    { periode: 'Depuis 2018', role: 'UX/UI Designer & Front-end', org: 'Freelance / Remote', desc: 'Accompagnement de startups et d\'institutions sur des produits web complexes (Fintech, Edtech, Secteur public).' },
    { periode: '2021 - 2023', role: 'Product Designer', org: 'YUX Design', desc: 'Recherche utilisateur, prototypage et développement de plateformes web pour l\'Afrique.' },
    { periode: '2019 - 2021', role: 'Web Designer & Intégrateur', org: 'Agences Digitales', desc: 'Conception et intégration de sites vitrines et corporate.' }
  ]

  return (
    <div className="v2-page">
      
      {/* ===== 1. HERO ===== */}
      <section className="v2-hero" id="v2-hero">
        <div className="container v2-hero__grid">
          
          <motion.div 
            className="v2-hero__content"
            initial="hidden" animate="visible" variants={staggerContainer}
          >
            <motion.div className="v2-hero__status" variants={fadeUp}>
              <span className="status-dot"></span>
              Disponible pour de nouvelles opportunités
            </motion.div>
            
            <motion.div className="v2-hero__label" variants={fadeUp}>
              UX/UI DESIGNER · DAKAR · REMOTE & PRÉSENTIEL
            </motion.div>
            
            <motion.h1 className="v2-hero__title" variants={fadeUp}>
              Je conçois des interfaces claires pour des produits web complexes.
            </motion.h1>
            
            <motion.p className="v2-hero__desc-main" variants={fadeUp}>
              UX/UI Designer depuis 2018, j’accompagne les équipes dans la conception de parcours, de tableaux de bord et de plateformes métier, de la compréhension du besoin jusqu’aux maquettes haute fidélité.
            </motion.p>
            
            <motion.p className="v2-hero__desc-sub" variants={fadeUp}>
              Ma maîtrise du front-end me permet de proposer des interfaces réalistes, cohérentes et plus simples à intégrer.
            </motion.p>
            
            <motion.div className="v2-hero__actions" variants={fadeUp}>
              <Link to="/realisations" className="btn btn-primary">Voir mes projets</Link>
              <a href="/cv-seydou-diallo.pdf" download="CV_Seydou_DIALLO_FR.pdf" target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
                Télécharger mon CV
              </a>
            </motion.div>
            
            <motion.div className="v2-hero__location" variants={fadeUp}>
              Basé à Dakar · Disponible en remote & présentiel
            </motion.div>
          </motion.div>
          
          <motion.div 
            className="v2-hero__visual"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="v2-hero__visual-frame">
              <img src="/portfolio_project_mockup.png" alt="Exemple d'interface de tableau de bord" loading="eager" />
            </div>
          </motion.div>
          
        </div>
      </section>

      {/* ===== 2. BANDE DE CRÉDIBILITÉ ===== */}
      <section className="v2-credibility">
        <div className="container">
          <div className="v2-credibility__grid">
            <div className="v2-credibility__item">
              <h3 className="v2-credibility__title">Depuis 2018</h3>
              <p className="v2-credibility__desc">Expérience en UX/UI Design</p>
            </div>
            <div className="v2-credibility__item">
              <h3 className="v2-credibility__title">Produits métier</h3>
              <p className="v2-credibility__desc">SaaS, dashboards et plateformes web</p>
            </div>
            <div className="v2-credibility__item">
              <h3 className="v2-credibility__title">Design systems</h3>
              <p className="v2-credibility__desc">Interfaces cohérentes et évolutives</p>
            </div>
            <div className="v2-credibility__item">
              <h3 className="v2-credibility__title">Front-end</h3>
              <p className="v2-credibility__desc">Angular, React et intégration responsive</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 3. PROJETS SÉLECTIONNÉS ===== */}
      <section className="section v2-projects" id="projects">
        <div className="container">
          <div className="v2-section-header">
            <span className="section-label">PROJETS SÉLECTIONNÉS</span>
            <h2>Des interfaces conçues pour résoudre des problèmes réels</h2>
            <p className="v2-section-intro">Une sélection de plateformes métier et de produits web sur lesquels j’ai travaillé en UX, UI Design, prototypage et collaboration front-end.</p>
          </div>

          <div className="v2-projects__list">
            {projets.map((projet) => (
              <motion.div 
                className="v2-project-card"
                key={projet.id}
                initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} variants={fadeUp}
              >
                <Link to={`/projet/${projet.id}`} className="v2-project-card__visual">
                  <div className={`v2-project-card__placeholder v2-project-card__placeholder--${projet.key}`}>
                    {projet.nom.split(' — ')[0]}
                  </div>
                </Link>
                
                <div className="v2-project-card__content">
                  <span className="v2-project-card__org">{projet.org}</span>
                  <h3 className="v2-project-card__title">{projet.nom}</h3>
                  <p className="v2-project-card__desc">{projet.description}</p>
                  
                  <div className="v2-project-card__tags">
                    {projet.tags.map(tag => <span key={tag} className="v2-project-card__tag">{tag}</span>)}
                  </div>
                  
                  <p className="v2-project-card__infos">{projet.infos}</p>
                  
                  <div className="v2-project-card__cta">
                    <Link to={`/projet/${projet.id}`} className="text-link">
                      Voir l’étude de cas <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="v2-projects__more">
            <Link to="/realisations" className="btn btn-secondary">Voir tous mes projets</Link>
          </div>
        </div>
      </section>

      {/* ===== 4. EXPERTISES ===== */}
      <section className="section v2-expertise" id="expertise">
        <div className="container">
          <div className="v2-section-header text-center">
            <span className="section-label">EXPERTISES</span>
            <h2>Une pratique centrée sur l’expérience, renforcée par la technique</h2>
            <p className="v2-section-intro" style={{ margin: '0 auto' }}>Mon travail combine compréhension des usages, structuration des parcours et conception d’interfaces prêtes à être développées.</p>
          </div>

          <motion.div 
            className="v2-expertise__grid"
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} variants={staggerContainer}
          >
            <motion.div className="v2-expertise-card" variants={fadeUp}>
              <h3>UX Design et architecture</h3>
              <p>Analyse des besoins, parcours utilisateurs, architecture de l’information, wireframes et prototypage de solutions adaptées aux contraintes métier.</p>
              <ul>
                <li>Parcours utilisateurs</li>
                <li>Architecture de l’information</li>
                <li>Wireframes</li>
                <li>Prototypes interactifs</li>
              </ul>
            </motion.div>
            
            <motion.div className="v2-expertise-card" variants={fadeUp}>
              <h3>UI Design et design systems</h3>
              <p>Création d’interfaces lisibles, cohérentes et accessibles, accompagnées de composants réutilisables et de règles visuelles structurées.</p>
              <ul>
                <li>Interfaces web et dashboards</li>
                <li>Design systems</li>
                <li>Responsive design</li>
                <li>Accessibilité</li>
              </ul>
            </motion.div>
            
            <motion.div className="v2-expertise-card v2-expertise-card--minor" variants={fadeUp}>
              <h3>Collaboration front-end</h3>
              <p>Ma compréhension d’Angular, React, HTML et CSS facilite les échanges avec les développeurs et la conception d’interfaces réalistes.</p>
              <ul>
                <li>Angular</li>
                <li>React</li>
                <li>HTML et CSS</li>
                <li>Handoff et contrôle qualité</li>
              </ul>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ===== 5. MÉTHODE DE TRAVAIL ===== */}
      <section className="section v2-method">
        <div className="container">
          <div className="v2-section-header">
            <span className="section-label">MA MÉTHODE</span>
            <h2>Une approche structurée, du besoin à l’interface</h2>
          </div>

          <motion.div 
            className="v2-method__grid"
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} variants={staggerContainer}
          >
            {methodes.map((m) => (
              <motion.div className="v2-method-step" key={m.num} variants={fadeUp}>
                <span className="v2-method-step__num">{m.num}</span>
                <h3 className="v2-method-step__title">{m.titre}</h3>
                <p className="v2-method-step__text">{m.texte}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===== 6. PARCOURS ET COLLABORATIONS ===== */}
      <section className="section v2-parcours" id="parcours">
        <div className="container">
          <div className="v2-section-header">
            <span className="section-label">PARCOURS</span>
            <h2>Des expériences au croisement du design et des produits métier</h2>
            <p className="v2-section-intro">Depuis 2018, j’interviens sur des plateformes institutionnelles, des applications métier, des produits éducatifs et des services web.</p>
          </div>

          <div className="v2-parcours__list">
            {parcours.map((p, index) => (
              <motion.div 
                className="v2-parcours-item" key={index}
                initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} variants={fadeUp}
              >
                <div className="v2-parcours-item__period">{p.periode}</div>
                <div className="v2-parcours-item__content">
                  <h3 className="v2-parcours-item__role">{p.role}</h3>
                  <span className="v2-parcours-item__org">{p.org}</span>
                  <p className="v2-parcours-item__desc">{p.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="v2-parcours__more">
            <Link to="/parcours" className="btn btn-secondary">Découvrir mon parcours</Link>
          </div>

          <div className="v2-logos">
            <h3 className="v2-logos__title">Organisations et équipes avec lesquelles j’ai collaboré</h3>
            <div className="v2-logos__grid">
              {/* Using text for logos to avoid broken images if not available, as per strict instruction: "Réutiliser uniquement les logos existants et vérifiables." */}
              <span className="v2-logo-placeholder">CORAF</span>
              <span className="v2-logo-placeholder">CETUD</span>
              <span className="v2-logo-placeholder">LiveLearn</span>
              <span className="v2-logo-placeholder">Trésor Public</span>
              <span className="v2-logo-placeholder">YUX Design</span>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 7. À PROPOS ===== */}
      <section className="section v2-about" id="about">
        <div className="container">
          <div className="v2-about__grid">
            <motion.div 
              className="v2-about__content"
              initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} variants={fadeUp}
            >
              <span className="section-label">À PROPOS</span>
              <h2>Concevoir avec clarté, réalisme et attention aux détails</h2>
              
              <div className="v2-about__text">
                <p>Je suis Seydou Diallo, UX/UI Designer basé à Dakar. Depuis 2018, je conçois des interfaces et des parcours pour des plateformes web, des produits métier et des services numériques.</p>
                <p>J’accorde une attention particulière à la compréhension du contexte, à la lisibilité des informations et à la cohérence des composants. Ma pratique du front-end m’aide également à anticiper les contraintes techniques et à faciliter l’intégration des interfaces.</p>
                <p>Je travaille avec des équipes locales et internationales, principalement à distance.</p>
              </div>

              <ul className="v2-about__list">
                <li>UX/UI Design</li>
                <li>Produits web et plateformes métier</li>
                <li>Design systems</li>
                <li>Prototypage</li>
                <li>Collaboration front-end</li>
                <li>Travail en remote & présentiel</li>
              </ul>
              
              <div className="v2-about__actions">
                <Link to="/parcours" className="btn btn-primary">Voir mon parcours</Link>
                <a href="/cv-seydou-diallo.pdf" download="CV_Seydou_DIALLO_FR.pdf" target="_blank" rel="noopener noreferrer" className="btn btn-secondary">Télécharger mon CV</a>
              </div>
            </motion.div>
            
            <motion.div 
              className="v2-about__visual"
              initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} variants={fadeUp}
            >
              <img src="/designer_workspace.png" alt="Espace de travail de Seydou Diallo" loading="lazy" className="v2-about__img" style={{ borderRadius: 'var(--radius-lg)', width: '100%', objectFit: 'cover', aspectRatio: '4/3', border: '1px solid var(--color-border)' }} />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== 8. CONTACT ===== */}
      <section className="section v2-contact" id="contact">
        <div className="container">
          <motion.div 
            className="v2-contact__card"
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} variants={fadeUp}
          >
            <h2>Vous recherchez un UX/UI Designer capable de comprendre les enjeux produit et techniques ?</h2>
            <p>Je suis disponible pour échanger autour d’une opportunité, d’une mission ou d’un produit nécessitant une expérience utilisateur claire et une interface soignée.</p>
            
            <div className="v2-contact__actions">
              <Link to="/contact" className="btn btn-primary">Me contacter</Link>
            </div>
            
            <div className="v2-contact__infos">
              <span className="v2-contact__info-item"><Mail size={16} /> seydoukellel@gmail.com</span>
              <span className="v2-contact__info-item"><MapPin size={16} /> Basé à Dakar · Disponible en remote & présentiel</span>
            </div>
          </motion.div>
        </div>
      </section>
      
    </div>
  )
}
