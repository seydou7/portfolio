import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  MapPin, 
  Sparkles, 
  Layout, 
  Layers, 
  Code2, 
  CheckCircle2, 
  GitBranch, 
  Palette, 
  FileText,
  Briefcase
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import './APropos.css'

export default function APropos() {
  const { t, i18n } = useTranslation()
  const location = useLocation()

  // SEO & Document Title
  useEffect(() => {
    document.title = t('aPropos.seoTitle', 'À propos — Seydou Diallo | UX/UI Designer')
    const metaDesc = document.querySelector('meta[name="description"]')
    if (metaDesc) {
      metaDesc.setAttribute(
        'content',
        t('aPropos.seoDesc', 'Découvrez le parcours, les expertises et l’approche de Seydou Diallo, UX/UI Designer basé à Dakar spécialisé dans les produits web et interfaces métier.')
      )
    }
  }, [t, i18n.language])

  // Support du hash navigation (ex: /a-propos#expertise)
  useEffect(() => {
    if (location.hash) {
      const el = document.querySelector(location.hash)
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }, 100)
      }
    } else {
      window.scrollTo(0, 0)
    }
  }, [location])

  const uxSkills = t('aPropos.expertise.ux.skills', { returnObjects: true }) || [
    'Analyse des besoins', 'Parcours utilisateurs', 'Architecture de l’information', 
    'User flows', 'Wireframes', 'Prototypage', 'Hiérarchisation des informations', 'Simplification des processus'
  ]

  const uiSkills = t('aPropos.expertise.ui.skills', { returnObjects: true }) || [
    'Interfaces web', 'Dashboards', 'Applications métier', 'Responsive design', 
    'Design systems', 'Components', 'États d’interface', 'Data tables', 'Accessibilité', 'Prototypes haute fidélité'
  ]

  const frontendSkills = t('aPropos.expertise.frontend.skills', { returnObjects: true }) || [
    'HTML', 'CSS', 'JavaScript / TypeScript', 'Angular', 'React', 'Intégration responsive', 'Git'
  ]

  return (
    <div className="page-apropos">
      
      {/* ===== 1. HERO À PROPOS ===== */}
      <section className="apropos-hero" aria-labelledby="apropos-h1">
        <div className="container">
          <div className="apropos-hero__grid">
            
            {/* Colonne texte */}
            <div className="apropos-hero__content">
              
              <div className="apropos-hero__status-badge">
                <span className="status-dot-green" aria-hidden="true" />
                <span>{t('aPropos.hero.status', 'Disponible pour de nouvelles opportunités')}</span>
              </div>

              <span className="section-label">{t('aPropos.hero.label', 'À PROPOS')}</span>

              <h1 id="apropos-h1" className="apropos-hero__title">
                {t('aPropos.hero.title', 'Je conçois des expériences numériques en cherchant d’abord à comprendre ce qui doit réellement être simplifié.')}
              </h1>

              <div className="apropos-hero__paragraphs">
                <p className="apropos-hero__intro-main">
                  {t('aPropos.hero.intro1', 'Je suis Seydou Diallo, UX/UI Designer basé à Dakar. Depuis 2018, je travaille sur des plateformes web, des produits métier, des dashboards et des expériences numériques destinées à des contextes parfois complexes.')}
                </p>
                <p className="apropos-hero__intro-sub">
                  {t('aPropos.hero.intro2', 'Mon rôle consiste à transformer les besoins utilisateurs et les contraintes métier en parcours compréhensibles, puis en interfaces cohérentes, accessibles et réalistes à développer.')}
                </p>
              </div>

              <div className="apropos-hero__meta">
                <span className="apropos-hero__meta-item">
                  <MapPin size={15} className="apropos-hero__meta-icon" aria-hidden="true" />
                  {t('aPropos.hero.location', 'Basé à Dakar · Disponible en full remote')}
                </span>
              </div>

              <div className="apropos-hero__actions">
                <Link to="/contact" className="btn btn-primary">
                  {t('aPropos.cta.primary', 'Me contacter')}
                </Link>
                <a 
                  href="/cv-seydou-diallo.pdf" 
                  download="CV_Seydou_DIALLO_FR.pdf"
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="btn btn-secondary"
                >
                  <FileText size={16} aria-hidden="true" />
                  {t('aPropos.cta.secondary', 'Télécharger mon CV')}
                </a>
              </div>
            </div>

            {/* Colonne visuel réel */}
            <div className="apropos-hero__visual-col">
              <div className="apropos-hero__visual-card">
                <img 
                  src="/designer_workspace.png" 
                  alt="Espace de travail et conception de Seydou Diallo" 
                  className="apropos-hero__img"
                  loading="eager"
                />
                <div className="apropos-hero__visual-caption">
                  <span className="caption-dot" aria-hidden="true" />
                  <span>Seydou Diallo — UX/UI Design & Prototypage</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ===== 2. MA FAÇON D'ABORDER LE DESIGN (VISION) ===== */}
      <section className="section apropos-vision" aria-labelledby="vision-heading">
        <div className="container">
          <div className="apropos-vision__grid">
            
            {/* Texte philosophie */}
            <div className="apropos-vision__text-col">
              <span className="section-label">{t('aPropos.vision.label', 'MA VISION')}</span>
              <h2 id="vision-heading" className="apropos-vision__title">
                {t('aPropos.vision.title', 'Concevoir avec clarté plutôt qu’ajouter de la complexité')}
              </h2>
              <div className="apropos-vision__paragraphs">
                <p>
                  {t('aPropos.vision.p1', 'Un bon design ne consiste pas uniquement à produire une belle interface. Il doit permettre à l’utilisateur de comprendre rapidement où il se trouve, ce qu’il peut faire et ce qui est attendu de lui.')}
                </p>
                <p>
                  {t('aPropos.vision.p2', 'Sur les produits métier, je porte une attention particulière à la hiérarchie de l’information, aux états, aux rôles utilisateurs et à la cohérence des composants.')}
                </p>
                <p>
                  {t('aPropos.vision.p3', 'Je préfère une interface simple et compréhensible à une interface spectaculaire qui complique l’usage.')}
                </p>
              </div>
            </div>

            {/* 3 Principes */}
            <div className="apropos-vision__principles-col">
              
              <div className="principle-card">
                <div className="principle-card__header">
                  <div className="principle-card__icon principle-card__icon--blue" aria-hidden="true">
                    <Sparkles size={18} />
                  </div>
                  <h3 className="principle-card__title">
                    {t('aPropos.vision.principles.clarityTitle', 'Clarté')}
                  </h3>
                </div>
                <p className="principle-card__desc">
                  {t('aPropos.vision.principles.clarityDesc', 'Rendre les informations et actions immédiatement compréhensibles.')}
                </p>
              </div>

              <div className="principle-card">
                <div className="principle-card__header">
                  <div className="principle-card__icon principle-card__icon--orange" aria-hidden="true">
                    <Layers size={18} />
                  </div>
                  <h3 className="principle-card__title">
                    {t('aPropos.vision.principles.coherenceTitle', 'Cohérence')}
                  </h3>
                </div>
                <p className="principle-card__desc">
                  {t('aPropos.vision.principles.coherenceDesc', 'Créer des règles et composants qui restent fiables à l’échelle du produit.')}
                </p>
              </div>

              <div className="principle-card">
                <div className="principle-card__header">
                  <div className="principle-card__icon principle-card__icon--green" aria-hidden="true">
                    <CheckCircle2 size={18} />
                  </div>
                  <h3 className="principle-card__title">
                    {t('aPropos.vision.principles.realismTitle', 'Réalisme')}
                  </h3>
                </div>
                <p className="principle-card__desc">
                  {t('aPropos.vision.principles.realismDesc', 'Concevoir des solutions compatibles avec les contraintes techniques et métier.')}
                </p>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* ===== 3. EXPERTISE PRINCIPALE (ID="EXPERTISE") ===== */}
      <section className="section apropos-expertise" id="expertise" aria-labelledby="expertise-heading">
        <div className="container">
          
          <div className="apropos-section-header">
            <span className="section-label">{t('aPropos.expertise.label', 'EXPERTISE')}</span>
            <h2 id="expertise-heading" className="apropos-section-header__title">
              {t('aPropos.expertise.title', 'Une expertise centrée sur l’expérience utilisateur et les interfaces complexes')}
            </h2>
            <p className="apropos-section-header__intro">
              {t('aPropos.expertise.intro', 'Mon travail couvre les principales étapes nécessaires pour passer d’un besoin métier à une expérience structurée et une interface prête à être développée.')}
            </p>
          </div>

          <div className="apropos-expertise__list">
            
            {/* Bloc 1 — UX Design */}
            <article className="expertise-row">
              <div className="expertise-row__text">
                <div className="expertise-row__badge">
                  <Layout size={15} aria-hidden="true" />
                  <span>01 · UX DESIGN</span>
                </div>
                <h3 className="expertise-row__title">
                  {t('aPropos.expertise.ux.title', 'UX Design et architecture de l’information')}
                </h3>
                <p className="expertise-row__desc">
                  {t('aPropos.expertise.ux.intro', 'Avant de dessiner une interface, je cherche à comprendre les utilisateurs, leurs objectifs, les règles métier et les informations nécessaires à chaque étape du parcours.')}
                </p>
              </div>

              <div className="expertise-row__skills-box">
                <h4 className="skills-box__heading">Compétences & Livrables</h4>
                <div className="skills-box__tags">
                  {Array.isArray(uxSkills) && uxSkills.map((skill) => (
                    <span key={skill} className="skill-pill">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </article>

            {/* Bloc 2 — UI Design */}
            <article className="expertise-row expertise-row--reversed">
              <div className="expertise-row__skills-box">
                <h4 className="skills-box__heading">Compétences & Composants</h4>
                <div className="skills-box__tags">
                  {Array.isArray(uiSkills) && uiSkills.map((skill) => (
                    <span key={skill} className="skill-pill">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="expertise-row__text">
                <div className="expertise-row__badge">
                  <Palette size={15} aria-hidden="true" />
                  <span>02 · UI DESIGN</span>
                </div>
                <h3 className="expertise-row__title">
                  {t('aPropos.expertise.ui.title', 'UI Design et systèmes d’interfaces')}
                </h3>
                <p className="expertise-row__desc">
                  {t('aPropos.expertise.ui.intro', 'Je transforme les parcours en interfaces lisibles et cohérentes, en accordant une attention particulière aux composants, aux états, aux tableaux de données et à l’adaptation responsive.')}
                </p>
              </div>
            </article>

            {/* Bloc 3 — Front-end au service du design */}
            <article className="expertise-row">
              <div className="expertise-row__text">
                <div className="expertise-row__badge">
                  <Code2 size={15} aria-hidden="true" />
                  <span>03 · COLLABORATION FRONT-END</span>
                </div>
                <h3 className="expertise-row__title">
                  {t('aPropos.expertise.frontend.title', 'Une compréhension du front-end au service du design')}
                </h3>
                <p className="expertise-row__desc">
                  {t('aPropos.expertise.frontend.intro', 'Ma pratique du front-end me permet de mieux anticiper les contraintes techniques, de dialoguer efficacement avec les développeurs et de concevoir des interfaces plus réalistes à intégrer.')}
                </p>
                <p className="expertise-row__desc-sub">
                  {t('aPropos.expertise.frontend.p2', 'Je peux également intervenir sur l’intégration d’interfaces lorsque le contexte du projet le nécessite, tout en conservant l’UX/UI Design comme cœur de mon métier.')}
                </p>
              </div>

              <div className="expertise-row__skills-box">
                <h4 className="skills-box__heading">Technologies & Intégration</h4>
                <div className="skills-box__tags">
                  {Array.isArray(frontendSkills) && frontendSkills.map((skill) => (
                    <span key={skill} className="skill-pill skill-pill--code">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </article>

          </div>

        </div>
      </section>

      {/* ===== 4. OUTILS ET ENVIRONNEMENT ===== */}
      <section className="section apropos-tools" aria-labelledby="tools-heading">
        <div className="container">
          
          <div className="apropos-section-header text-center">
            <span className="section-label">{t('aPropos.tools.label', 'OUTILS')}</span>
            <h2 id="tools-heading" className="apropos-section-header__title" style={{ margin: '0 auto 12px' }}>
              {t('aPropos.tools.title', 'Les outils que j’utilise au quotidien')}
            </h2>
          </div>

          <div className="apropos-tools__grid">
            
            <div className="tool-card">
              <div className="tool-card__header">
                <div className="tool-card__icon" aria-hidden="true">
                  <Palette size={18} />
                </div>
                <h3 className="tool-card__title">
                  {t('aPropos.tools.designTitle', 'Design')}
                </h3>
              </div>
              <ul className="tool-card__list">
                <li>Figma & FigJam</li>
                <li>Prototypage interactif</li>
                <li>Design systems & Variables</li>
              </ul>
            </div>

            <div className="tool-card">
              <div className="tool-card__header">
                <div className="tool-card__icon" aria-hidden="true">
                  <Code2 size={18} />
                </div>
                <h3 className="tool-card__title">
                  {t('aPropos.tools.frontendTitle', 'Front-end')}
                </h3>
              </div>
              <ul className="tool-card__list">
                <li>HTML5 & CSS3 / Sass</li>
                <li>TypeScript & JavaScript</li>
                <li>Angular & React</li>
              </ul>
            </div>

            <div className="tool-card">
              <div className="tool-card__header">
                <div className="tool-card__icon" aria-hidden="true">
                  <GitBranch size={18} />
                </div>
                <h3 className="tool-card__title">
                  {t('aPropos.tools.collabTitle', 'Collaboration')}
                </h3>
              </div>
              <ul className="tool-card__list">
                <li>Git, GitHub & GitLab</li>
                <li>Handoff & Spécifications</li>
                <li>Méthodes Agiles / Scrum</li>
              </ul>
            </div>

          </div>

        </div>
      </section>

      {/* ===== 5. COLLABORATION DESIGN + DÉVELOPPEMENT ===== */}
      <section className="section apropos-collab" aria-labelledby="collab-heading">
        <div className="container">
          
          <div className="apropos-section-header">
            <span className="section-label">{t('aPropos.collaboration.label', 'COLLABORATION')}</span>
            <h2 id="collab-heading" className="apropos-section-header__title">
              {t('aPropos.collaboration.title', 'Un meilleur dialogue entre design et développement')}
            </h2>
            <p className="apropos-section-header__intro">
              {t('aPropos.collaboration.intro', 'Comprendre la logique d’un composant, les contraintes responsive ou les limites techniques permet de prendre de meilleures décisions dès la conception.')}
            </p>
          </div>

          <div className="apropos-collab__grid">
            
            <div className="collab-step-card">
              <span className="collab-step-card__num">01</span>
              <h3 className="collab-step-card__title">
                {t('aPropos.collaboration.anticipateTitle', 'Anticiper')}
              </h3>
              <p className="collab-step-card__desc">
                {t('aPropos.collaboration.anticipateDesc', 'Identifier les contraintes techniques avant qu’elles deviennent des problèmes pendant l’intégration.')}
              </p>
            </div>

            <div className="collab-step-card">
              <span className="collab-step-card__num">02</span>
              <h3 className="collab-step-card__title">
                {t('aPropos.collaboration.communicateTitle', 'Communiquer')}
              </h3>
              <p className="collab-step-card__desc">
                {t('aPropos.collaboration.communicateDesc', 'Préparer des composants, états et comportements suffisamment précis pour faciliter le handoff.')}
              </p>
            </div>

            <div className="collab-step-card">
              <span className="collab-step-card__num">03</span>
              <h3 className="collab-step-card__title">
                {t('aPropos.collaboration.verifyTitle', 'Vérifier')}
              </h3>
              <p className="collab-step-card__desc">
                {t('aPropos.collaboration.verifyDesc', 'Comparer l’interface développée avec les maquettes et corriger les écarts importants lorsque cela est nécessaire.')}
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* ===== 6. PROFIL & TRANSITION PARCOURS ===== */}
      <section className="section apropos-profile" aria-labelledby="profile-heading">
        <div className="container">
          
          <div className="apropos-profile__card">
            
            <div className="apropos-profile__header">
              <span className="section-label">{t('aPropos.profile.label', 'PROFIL')}</span>
              <h2 id="profile-heading" className="apropos-profile__title">
                {t('aPropos.profile.title', 'En quelques mots')}
              </h2>
            </div>

            <div className="apropos-profile__grid">
              
              <div className="profile-item">
                <span className="profile-item__label">{t('aPropos.profile.locationLabel', 'Localisation')}</span>
                <span className="profile-item__value">{t('aPropos.profile.locationValue', 'Dakar, Sénégal')}</span>
              </div>

              <div className="profile-item">
                <span className="profile-item__label">{t('aPropos.profile.expLabel', 'Expérience')}</span>
                <span className="profile-item__value">{t('aPropos.profile.expValue', 'UX/UI Design depuis 2018')}</span>
              </div>

              <div className="profile-item">
                <span className="profile-item__label">{t('aPropos.profile.modeLabel', 'Mode de travail')}</span>
                <span className="profile-item__value">{t('aPropos.profile.modeValue', 'Full Remote & Présentiel')}</span>
              </div>

              <div className="profile-item">
                <span className="profile-item__label">{t('aPropos.profile.domainsLabel', 'Domaines')}</span>
                <span className="profile-item__value">{t('aPropos.profile.domainsValue', 'Plateformes métier · SaaS · E-learning · Services numériques')}</span>
              </div>

              <div className="profile-item profile-item--full">
                <span className="profile-item__label">{t('aPropos.profile.availabilityLabel', 'Disponibilité')}</span>
                <span className="profile-item__value profile-item__value--highlight">
                  <span className="status-dot-green" aria-hidden="true" />
                  {t('aPropos.profile.availabilityValue', 'Disponible pour de nouvelles opportunités')}
                </span>
              </div>

            </div>

            {/* Passerelle vers la page Parcours */}
            <div className="apropos-profile__bridge">
              <p className="bridge-text">
                {t('aPropos.profile.parcoursPrompt', 'Vous souhaitez découvrir mon parcours professionnel et les équipes avec lesquelles j’ai travaillé ?')}
              </p>
              <Link to="/parcours" className="btn btn-secondary">
                <Briefcase size={16} aria-hidden="true" />
                {t('aPropos.profile.parcoursBtn', 'Découvrir mon parcours')}
              </Link>
            </div>

          </div>

        </div>
      </section>

      {/* ===== 7. CTA FINAL COMPACT ===== */}
      <section className="section apropos-cta-section" aria-labelledby="cta-heading">
        <div className="container">
          <div className="apropos-cta-card">
            <h2 id="cta-heading" className="apropos-cta-card__title">
              {t('aPropos.cta.title', 'Vous souhaitez échanger autour d’une opportunité UX/UI ?')}
            </h2>
            <p className="apropos-cta-card__desc">
              {t('aPropos.cta.desc', 'Je suis disponible pour discuter d’un poste, d’une mission ou d’une collaboration autour de produits web et d’interfaces métier.')}
            </p>
            <div className="apropos-cta-card__actions">
              <Link to="/contact" className="btn btn-primary">
                {t('aPropos.cta.primary', 'Me contacter')}
              </Link>
              <a 
                href="/cv-seydou-diallo.pdf" 
                download="CV_Seydou_DIALLO_FR.pdf"
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn btn-secondary"
              >
                <FileText size={16} aria-hidden="true" />
                {t('aPropos.cta.secondary', 'Télécharger mon CV')}
              </a>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
