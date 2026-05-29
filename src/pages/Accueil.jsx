import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, MapPin, ArrowUpRight, Globe, Smartphone, LayoutDashboard, Code, Monitor } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { projets as staticProjets } from '../data/projets'
import { translateArray } from '../i18n/autoTranslate'
import API_URL from '../config/api'
import './Accueil.css'

const categoryIcon = {
  web:       <Globe size={14} />,
  mobile:    <Smartphone size={14} />,
  dashboard: <LayoutDashboard size={14} />,
  dev:       <Code size={14} />,
}

/* ---- Hero Name Animation ---- */
function AnimatedName({ name }) {
  return (
    <span className="hero__name-animated" aria-label={name}>
      {name.split('').map((char, i) => (
        <span
          key={i}
          className="hero__char"
          style={{ animationDelay: `${i * 0.06}s` }}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </span>
  )
}

/* ---- Marquee Component ---- */
function Marquee() {
  return (
    <div className="marquee-container">
      <div className="marquee-content">
        <span>UX/UI DESIGNER ✦ FRONT-END DEVELOPER ✦ FREELANCE ✦ </span>
        <span>UX/UI DESIGNER ✦ FRONT-END DEVELOPER ✦ FREELANCE ✦ </span>
        <span>UX/UI DESIGNER ✦ FRONT-END DEVELOPER ✦ FREELANCE ✦ </span>
        <span>UX/UI DESIGNER ✦ FRONT-END DEVELOPER ✦ FREELANCE ✦ </span>
      </div>
    </div>
  )
}

/* ---- Scroll Reveal Hook ---- */
function useScrollReveal(selector) {
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('revealed')
          observer.unobserve(e.target)
        }
      }),
      { threshold: 0.12 }
    )
    document.querySelectorAll(selector).forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [selector])
}

/* ---- Page ---- */
export default function Accueil() {
  useScrollReveal('.reveal')
  const { t, i18n } = useTranslation()
  const [projetsHome, setProjetsHome] = useState([])
  const [translatedProjets, setTranslatedProjets] = useState([])

  useEffect(() => {
    fetch(`${API_URL}/api/projets`)
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          const homeProj = data.filter(p => p.showInHome)
          if (homeProj.length > 0) {
            setProjetsHome(homeProj)
          } else {
            setProjetsHome(data.slice(0, 3)) // Fallback if none selected
          }
        } else {
          setProjetsHome(staticProjets.slice(0, 3))
        }
      })
      .catch(err => {
        console.error('Erreur lors du chargement des projets:', err)
        setProjetsHome(staticProjets.filter(p => p.showInHome).slice(0,3))
      })
  }, [])

  // Auto-traduire
  useEffect(() => {
    if (projetsHome.length === 0) return
    const lang = i18n.language?.startsWith('en') ? 'en' : 'fr'
    translateArray(projetsHome, ['description', 'type'], lang)
      .then(setTranslatedProjets)
  }, [projetsHome, i18n.language])

  const displayedProjets = translatedProjets.length > 0 ? translatedProjets : projetsHome

  // Re-observe reveal elements after projects are loaded
  useEffect(() => {
    if (displayedProjets.length === 0) return
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('revealed')
          observer.unobserve(e.target)
        }
      }),
      { threshold: 0.08 }
    )
    const timer = setTimeout(() => {
      document.querySelectorAll('.reveal:not(.revealed)').forEach(el => observer.observe(el))
    }, 100)
    return () => {
      observer.disconnect()
      clearTimeout(timer)
    }
  }, [displayedProjets])

  return (
    <>
      {/* ===== HERO V2 (Immersive) ===== */}
      <section className="hero" id="hero">
        <div className="hero__bg-ornament" aria-hidden="true" />
        <div className="hero__bg-blob" aria-hidden="true" />

        <div className="container hero__content">
          {/* Localisation badge */}
          <div className="hero__location animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <MapPin size={14} />
            <span>{t('hero.location')}</span>
          </div>

          {/* Nom animé */}
          <h1 className="hero__name">
            <AnimatedName name="Seydou Diallo" />
          </h1>

          {/* Titre */}
          <p className="hero__title animate-fade-up" style={{ animationDelay: '0.8s' }}>
            {t('hero.title1')} <span className="hero__title-sep">—</span> Product Designer
            <span className="hero__title-plus">{t('hero.devTitle')}</span>
          </p>

          {/* Badges Glassmorphism */}
          <div className="hero__badges animate-fade-up" style={{ animationDelay: '0.9s' }}>
            <span className="hero__badge">Figma</span>
            <span className="hero__badge">React</span>
            <span className="hero__badge">UI/UX</span>
            <span className="hero__badge">Front-end</span>
          </div>

          {/* CTA */}
          <div className="hero__ctas animate-fade-up" style={{ animationDelay: '1s' }}>
            <Link to="/realisations" className="btn btn-primary hero__cta-main">
              {t('hero.cta')}
              <ArrowRight size={16} />
            </Link>
            <Link to="/contact" className="btn btn-outline glass-btn">
              {t('hero.ctaSecondary')}
            </Link>
          </div>
        </div>

        {/* Marquee en bas du hero */}
        <div className="hero__marquee-wrapper animate-fade-in" style={{ animationDelay: '1.2s' }}>
          <Marquee />
        </div>
      </section>

      {/* ===== BENTO GRID (About + Stats + Sectors) ===== */}
      <section className="section bento-section reveal" id="a-propos">
        <div className="container">
          <div className="bento-grid">
            
            {/* Box 1: Bio */}
            <div className="bento-box bento-bio">
              <span className="section-label">{t('about.label')}</span>
              <h2 className="bento-title">{t('about.title')}</h2>
              <div className="bento-desc">
                <p>{t('about.bio1')}</p>
                <p>{t('about.bio2')}</p>
              </div>
            </div>

            {/* Box 2: Location Map */}
            <div className="bento-box bento-location">
              <div className="bento-location-inner">
                <MapPin size={32} className="text-gold mb-2"/>
                <h3>Dakar, SN</h3>
                <p>Full Remote</p>
                <div className="pulsing-dot"></div>
              </div>
            </div>

            {/* Box 3: Stats */}
            <div className="bento-box bento-stats">
              <div className="stat-item">
                <span className="stat-num">6+</span>
                <span className="stat-label">{t('about.stat1Label')}</span>
              </div>
              <div className="stat-item">
                <span className="stat-num">15+</span>
                <span className="stat-label">{t('about.stat2Label')}</span>
              </div>
              <div className="stat-item">
                <span className="stat-num">5</span>
                <span className="stat-label">{t('about.stat3Label')}</span>
              </div>
            </div>

            {/* Box 4: Sectors Cloud */}
            <div className="bento-box bento-sectors">
              <span className="section-label">{t('sectors.label')}</span>
              <div className="sectors-cloud">
                {t('sectors.list', { returnObjects: true }).map((sector, idx) => (
                  <span key={idx} className="bento-tag">{sector}</span>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ===== FEATURED PROJECTS (Hybrid Layout) ===== */}
      <section className="section featured-projects reveal" id="featured">
        <div className="container">
          <div className="section-header-flex">
            <div>
              <span className="section-label">{t('realisations.label')}</span>
              <h2 className="section-title-large">{t('realisations.featuredTitle')}</h2>
            </div>
            <Link to="/realisations" className="btn btn-outline featured-btn">
              {t('realisations.featuredViewAll')}
              <ArrowRight size={16} />
            </Link>
          </div>
          
          <div className="featured-grid">
            {displayedProjets.map((projet, i) => (
              <Link to={`/projet/${projet.id}`} key={projet.id} className="projet-card tilt-effect reveal" style={{ transitionDelay: `${i * 0.1}s` }}>
                {/* Image Cover */}
                <div className="projet-card__img-wrap-home">
                  <img src={projet.cover} alt={projet.nom} className="projet-card__img-home" />
                </div>

                {/* Header carte */}
                <div className="projet-card__header">
                  <div className="projet-card__icon" aria-hidden="true">
                    {categoryIcon[projet.categorie] || <Monitor size={20} />}
                  </div>
                  <span className="projet-card__pays">{projet.pays}</span>
                </div>

                {/* Content */}
                <div className="projet-card__body">
                  <h2 className="projet-card__nom">{projet.nom}</h2>
                  <p className="projet-card__type">{projet.type}</p>
                  <p className="projet-card__desc">{projet.description}</p>

                  {/* Technos */}
                  <div className="projet-card__techno">
                    {projet.techno.map(t => (
                      <span key={t} className="tag tag-dark">{t}</span>
                    ))}
                  </div>
                </div>

                {/* Footer */}
                <div className="projet-card__footer">
                  <span className="projet-card__ecrans">{projet.ecrans} {t('realisations.ecrans')}</span>
                  <div className="projet-card__action">
                    <span>{t('realisations.voirProjet')}</span>
                    <ArrowRight size={14} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== METHOD (Image 1) ===== */}
      <section className="section method-section reveal" id="methode">
        <div className="container">
          <div className="method-header">
            <div className="method-title-wrap">
              <span className="section-label">{t('methods.label')}</span>
              <h2 className="method-title">
                {t('methods.title1')}<br />
                <span className="italic">{t('methods.title2')}</span>
              </h2>
            </div>
            <div className="method-desc">
              <p>{t('methods.desc')}</p>
            </div>
          </div>

          <div className="method-grid">
            <div className="method-step reveal" style={{ transitionDelay: '0.1s' }}>
              <span className="step-num">{t('methods.step1Num')}</span>
              <h3 className="step-title">{t('methods.step1Title')}</h3>
              <p>{t('methods.step1Desc')}</p>
            </div>
            <div className="method-step reveal" style={{ transitionDelay: '0.2s' }}>
              <span className="step-num">{t('methods.step2Num')}</span>
              <h3 className="step-title">{t('methods.step2Title')}</h3>
              <p>{t('methods.step2Desc')}</p>
            </div>
            <div className="method-step reveal" style={{ transitionDelay: '0.3s' }}>
              <span className="step-num">{t('methods.step3Num')}</span>
              <h3 className="step-title">{t('methods.step3Title')}</h3>
              <p>{t('methods.step3Desc')}</p>
            </div>
            <div className="method-step reveal" style={{ transitionDelay: '0.4s' }}>
              <span className="step-num">{t('methods.step4Num')}</span>
              <h3 className="step-title">{t('methods.step4Title')}</h3>
              <p>{t('methods.step4Desc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CTA FINAL ===== */}
      <section className="section cta-section reveal" id="cta">
        <div className="container">
          <div className="cta-block liquid-cta">
            <span className="section-label text-gold-light">{t('ctaFinal.label')}</span>
            <h2 className="cta-block__title">
              {t('ctaFinal.title1')}<br />
              <span className="text-gold italic">{t('ctaFinal.title2')}</span>
            </h2>
            <p className="cta-block__sub">
              {t('ctaFinal.sub')}
            </p>
            <div className="flex gap-4 justify-center" style={{ flexWrap: 'wrap' }}>
              <Link to="/contact" className="btn btn-primary">
                {t('ctaFinal.btn')}
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
