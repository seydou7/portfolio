import { useEffect, useState } from 'react'
import { experiences as staticExperiences, formations as staticFormations } from '../data/parcours'
import { useTranslation } from 'react-i18next'
import { translateArray } from '../i18n/autoTranslate'
import API_URL from '../config/api'
import './Parcours.css'

export default function Parcours() {
  const [experiences, setExperiences] = useState([])
  const [translatedExp, setTranslatedExp] = useState([])
  const { t, i18n } = useTranslation()

  useEffect(() => {
    fetch(`${API_URL}/api/parcours`)
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          setExperiences(data.filter(item => item.type === 'experience'))
        } else {
          setExperiences(staticExperiences)
        }
      })
      .catch(err => {
        console.error('Erreur lors du chargement du parcours:', err)
        setExperiences(staticExperiences)
      })
  }, [])

  // Auto-traduire quand la langue ou les données changent
  useEffect(() => {
    const lang = i18n.language?.startsWith('en') ? 'en' : 'fr'
    if (experiences.length > 0) {
      translateArray(experiences, ['description', 'poste', 'entreprise'], lang)
        .then(setTranslatedExp)
    }
  }, [experiences, i18n.language])

  const displayedExp = translatedExp.length > 0 ? translatedExp : experiences

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('revealed')
          observer.unobserve(e.target)
        }
      }),
      { threshold: 0.1 }
    )
    
    const timer = setTimeout(() => {
      document.querySelectorAll('.reveal').forEach(el => observer.observe(el))
    }, 100)

    return () => {
      observer.disconnect()
      clearTimeout(timer)
    }
  }, [experiences])

  return (
    <div className="page-parcours-editorial">
      {/* Editorial Header */}
      <div className="page-header-editorial">
        <span className="section-label">{t('parcours.label')}</span>
        <h1 className="page-header-editorial__title">{t('parcours.title')}</h1>

        <div className="page-header-editorial__line" aria-hidden="true" />
        <p className="page-header-editorial__subtitle">
          UNE LIGNE DIRECTRICE CLAIRE: CONCEVOIR ET LIVRER DES PRODUITS D'EXCEPTION.
        </p>
      </div>

      <div className="parcours-container">
        
        {/* Bloc Pays */}
        <div className="countries-block reveal">
          <div className="countries-list">
            <div className="country-item">
              <span className="country-flag">🇳🇱</span>
              <span className="country-name">Pays-Bas</span>
            </div>
            <div className="country-item">
              <span className="country-flag">🇸🇳</span>
              <span className="country-name">Sénégal</span>
            </div>
            <div className="country-item">
              <span className="country-flag">🇨🇦</span>
              <span className="country-name">Canada</span>
            </div>
            <div className="country-item">
              <span className="country-flag">🇫🇷</span>
              <span className="country-name">France</span>
            </div>
            <div className="country-item">
              <span className="country-flag">🇲🇱</span>
              <span className="country-name">Mali</span>
            </div>
          </div>
        </div>
        
        {/* Section Expérience */}
        <div className="timeline-section">
          <div className="timeline-section__header reveal">
            <span className="section-label">{t('parcours.expLabel')}</span>
            <h2 className="timeline-section__title">{t('parcours.expTitle')}</h2>
          </div>

          <div className="timeline-wrapper">
            <div className="timeline-center-line" aria-hidden="true" />
            
            {displayedExp.map((item, index) => (
              <div key={index} className={`timeline-block reveal ${index % 2 === 0 ? 'timeline-block--left' : 'timeline-block--right'}`} style={{ transitionDelay: `${index * 0.15}s` }}>
                <div className="timeline-dot" aria-hidden="true" />
                <div className="timeline-content">
                  <span className="timeline-date">{item.periode}</span>
                  <h3 className="timeline-company">{item.entreprise}</h3>
                  <span className="timeline-role">{item.poste}</span>
                  <p className="timeline-desc">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
