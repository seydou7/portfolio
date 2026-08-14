import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Briefcase, Download, Calendar, Building, MapPin } from 'lucide-react'
import { experiences as staticExperiences } from '../data/parcours'
import { useTranslation } from 'react-i18next'
import { translateArray } from '../i18n/autoTranslate'
import API_URL from '../config/api'
import './Parcours.css'

export default function Parcours() {
  const [experiences, setExperiences] = useState([])
  const [translatedExp, setTranslatedExp] = useState([])
  const [loading, setLoading] = useState(true)
  const { t, i18n } = useTranslation()

  // SEO
  useEffect(() => {
    document.title = t('parcours.seoTitle', 'Parcours — Seydou Diallo | UX/UI Designer')
    const metaDesc = document.querySelector('meta[name="description"]')
    if (metaDesc) {
      metaDesc.setAttribute(
        'content',
        t('parcours.seoDesc', 'Découvrez le parcours professionnel et les collaborations de Seydou Diallo : conception UX/UI de plateformes métier, design systems et intégration front-end.')
      )
    }
  }, [t, i18n.language])

  // Chargement 100% dynamique
  useEffect(() => {
    let isMounted = true
    setLoading(true)

    fetch(`${API_URL}/api/parcours`)
      .then(res => {
        if (!res.ok) throw new Error('API indisponible')
        return res.json()
      })
      .then(data => {
        if (!isMounted) return
        if (Array.isArray(data) && data.length > 0) {
          setExperiences(data.filter(item => item.type === 'experience'))
        } else {
          setExperiences(staticExperiences)
        }
        setLoading(false)
      })
      .catch(err => {
        if (!isMounted) return
        console.warn('Fallback parcours local:', err.message)
        setExperiences(staticExperiences)
        setLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [])

  // Auto-traduction
  useEffect(() => {
    if (experiences.length === 0) return
    const lang = i18n.language?.startsWith('en') ? 'en' : 'fr'
    translateArray(experiences, ['description', 'poste', 'entreprise'], lang)
      .then(setTranslatedExp)
      .catch(() => setTranslatedExp([]))
  }, [experiences, i18n.language])

  const displayedExp = translatedExp.length > 0 ? translatedExp : experiences

  return (
    <div className="page-parcours">
      
      {/* ===== 1. HERO / EN-TÊTE ===== */}
      <section className="parcours-hero">
        <div className="container">
          <span className="section-label">{t('parcours.label', 'PARCOURS & COLLABORATIONS')}</span>
          <h1 className="parcours-hero__title">
            {t('parcours.title', 'Une pratique forgée au contact de produits complexes')}
          </h1>
          <p className="parcours-hero__desc">
            {t('parcours.subtitle', 'Depuis 2018, j’interviens sur des plateformes institutionnelles, des applications métier, des produits éducatifs et des services web à l’international.')}
          </p>

          {/* Marchés d'intervention */}
          <div className="parcours-countries">
            <span className="parcours-countries__label">{t('parcours.countriesLabel', 'Marchés d’intervention')} :</span>
            <div className="parcours-countries__list">
              <span className="country-chip"><span className="country-flag">🇳🇱</span> Pays-Bas</span>
              <span className="country-chip"><span className="country-flag">🇸🇳</span> Sénégal</span>
              <span className="country-chip"><span className="country-flag">🇨🇦</span> Canada</span>
              <span className="country-chip"><span className="country-flag">🇫🇷</span> France</span>
              <span className="country-chip"><span className="country-flag">🇲🇱</span> Mali</span>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 2. TIMELINE EXPÉRIENCES ===== */}
      <section className="parcours-timeline-section">
        <div className="container">
          <div className="parcours-section-header">
            <span className="section-label">{t('parcours.expLabel', 'EXPÉRIENCES PROFESSIONNELLES')}</span>
            <h2>{t('parcours.expTitle', 'Trajectoire & Collaborations')}</h2>
          </div>

          <div className="parcours-timeline">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="parcours-card-skeleton" aria-hidden="true">
                  <div className="parcours-skeleton__line parcours-skeleton__line--date" />
                  <div className="parcours-skeleton__line parcours-skeleton__line--title" />
                  <div className="parcours-skeleton__line parcours-skeleton__line--sub" />
                  <div className="parcours-skeleton__line parcours-skeleton__line--desc" />
                </div>
              ))
            ) : (
              displayedExp.map((item, index) => (
                <article key={item.id || index} className="parcours-card">
                  {/* Puce / Timeline indicator */}
                  <div className="parcours-card__indicator" aria-hidden="true">
                    <span className="parcours-card__dot" />
                    {index < displayedExp.length - 1 && <span className="parcours-card__line" />}
                  </div>

                  <div className="parcours-card__content">
                    {/* Header de la carte */}
                    <div className="parcours-card__top">
                      <span className="parcours-card__period">
                        <Calendar size={13} aria-hidden="true" />
                        {item.periode}
                      </span>
                      {item.pays && (
                        <span className="parcours-card__location">
                          <MapPin size={13} aria-hidden="true" />
                          {item.pays}
                        </span>
                      )}
                    </div>

                    <h3 className="parcours-card__role">{item.poste}</h3>
                    
                    <div className="parcours-card__company">
                      <Building size={14} aria-hidden="true" />
                      <span>{item.entreprise}</span>
                    </div>

                    <p className="parcours-card__desc">{item.description}</p>
                  </div>
                </article>
              ))
            )}
          </div>
        </div>
      </section>

      {/* ===== 3. CTA FINAL ===== */}
      <section className="parcours-cta-section">
        <div className="container">
          <div className="parcours-cta-card">
            <h2>Vous recherchez un UX/UI Designer pour structurer ou faire évoluer votre produit ?</h2>
            <p>Disponible pour échanger sur une opportunité, une mission UX/UI ou un projet nécessitant rigueur d'usage et intégration front-end réaliste.</p>
            
            <div className="parcours-cta-actions">
              <Link to="/contact" className="btn btn-primary">
                {t('parcours.ctaContact', 'Discuter d’une opportunité')}
              </Link>
              <a 
                href="/cv-seydou-diallo.pdf" 
                download="CV_Seydou_DIALLO_FR.pdf" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn btn-secondary"
              >
                <Download size={15} />
                {t('parcours.ctaCV', 'Télécharger mon CV')}
              </a>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
