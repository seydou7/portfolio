import { useEffect, useState } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import { ArrowLeft, ExternalLink, LayoutDashboard, Smartphone, Globe } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { projets as staticProjets } from '../data/projets'
import { translateObject } from '../i18n/autoTranslate'
import API_URL from '../config/api'
import './ProjetDetail.css'

export default function ProjetDetail() {
  const { id } = useParams()
  const [projets, setProjets] = useState([])
  const [translatedProjet, setTranslatedProjet] = useState(null)
  const { t, i18n } = useTranslation()

  useEffect(() => {
    window.scrollTo(0, 0)
    
    fetch(`${API_URL}/api/projets`)
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          setProjets(data)
        } else {
          setProjets(staticProjets)
        }
      })
      .catch(err => {
        console.error('Erreur lors du chargement des projets:', err)
        setProjets(staticProjets)
      })
  }, [id])

  const baseProjet = projets.find(p => p.id === id)

  // Autotranslate the selected project when it's found or when language changes
  useEffect(() => {
    if (!baseProjet) return
    const lang = i18n.language?.startsWith('en') ? 'en' : 'fr'
    translateObject(baseProjet, ['contexte', 'description', 'type', 'role'], lang)
      .then(setTranslatedProjet)
  }, [baseProjet, i18n.language])

  if (projets.length > 0 && !baseProjet) {
    return <Navigate to="/realisations" replace />
  }

  const projet = translatedProjet || baseProjet

  if (!projet) {
    return <div className="container" style={{padding: '10rem 2rem', textAlign: 'center'}}>Chargement...</div>
  }

  // Fonction pour obtenir l'URL d'embed Figma de façon robuste
  const getFigmaEmbedUrl = (url) => {
    if (!url) return null;
    if (url.includes('figma.com/embed')) {
      return url + (url.includes('?') ? '&hide-ui=1' : '?hide-ui=1');
    }
    if (url.includes('figma.com')) {
      // Convertir un lien normal en lien embed
      return `https://www.figma.com/embed?embed_host=share&url=${encodeURIComponent(url)}&hide-ui=1`;
    }
    return null;
  }

  const figmaEmbedUrl = getFigmaEmbedUrl(projet.figma);

  const renderIcon = () => {
    switch (projet.categorie) {
      case 'mobile': return <Smartphone size={16} />
      case 'web': return <Globe size={16} />
      case 'dashboard': return <LayoutDashboard size={16} />
      default: return <Globe size={16} />
    }
  }

  return (
    <div className="projet-detail">
      {/* Detail Header */}
      <div className="projet-detail__header">
        <div className="container">
          <Link to="/realisations" className="projet-detail__back">
            <ArrowLeft size={16} />
            <span>{t('projetDetail.back')}</span>
          </Link>
          
          <div className="projet-detail__title-wrapper">
            <span className="section-label">{projet.pays}</span>
            <h1 className="projet-detail__title">{projet.nom}</h1>
            <p className="projet-detail__subtitle">{projet.type}</p>
          </div>

          <div className="projet-detail__meta">
            <div className="meta-item">
              <span className="meta-label">{t('projetDetail.role')}</span>
              <span className="meta-value">{projet.role}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">{t('projetDetail.category')}</span>
              <span className="meta-value flex-center">
                {renderIcon()}
                {projet.categorie.charAt(0).toUpperCase() + projet.categorie.slice(1)}
              </span>
            </div>
            <div className="meta-item">
              <span className="meta-label">{t('projetDetail.screens')}</span>
              <span className="meta-value">{projet.ecrans}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Cover Image */}
      <div className="projet-detail__cover-wrapper">
        <div className="container">
          <div className="projet-detail__cover">
            <img src={projet.cover} alt={`Maquette de ${projet.nom}`} />
          </div>
        </div>
      </div>

      {/* Context & Info */}
      <section className="projet-detail__section">
        <div className="container projet-detail__grid">
          <div className="projet-detail__text">
            <h2 className="projet-section-title">{t('projetDetail.context')}</h2>
            <p className="projet-desc-text">{projet.contexte}</p>
            <h2 className="projet-section-title" style={{ marginTop: '2rem' }}>{t('projetDetail.mission')}</h2>
            <p className="projet-desc-text">{projet.description}</p>
          </div>
          
          <div className="projet-detail__sidebar">
            <div className="sidebar-box">
              <h3 className="sidebar-title">{t('projetDetail.technos')}</h3>
              <div className="tag-list">
                {projet.techno.map(t => (
                  <span key={t} className="tag tag-dark">{t}</span>
                ))}
              </div>
            </div>
            
            {(projet.live || projet.figma) && (
              <div className="sidebar-box">
                <h3 className="sidebar-title">{t('projetDetail.links')}</h3>
                <div className="links-list">
                  {projet.live && (
                    <a href={projet.live} target="_blank" rel="noopener noreferrer" className="btn btn-outline" style={{width: '100%'}}>
                      <Globe size={16} /> {t('projetDetail.liveSite')}
                    </a>
                  )}
                  {projet.figma && (
                    <a href={projet.figma.includes('embed') ? projet.figma.replace('/embed?embed_host=share&url=', '') : projet.figma} target="_blank" rel="noopener noreferrer" className="btn btn-outline" style={{width: '100%'}}>
                      <ExternalLink size={16} /> {t('projetDetail.openFigma')}
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Figma Embed or Gallery */}
      {figmaEmbedUrl && (
        <section className="projet-detail__section projet-detail__section--dark">
          <div className="container">
            <div className="projet-section-header-center">
              <span className="section-label">{t('projetDetail.interactive')}</span>
              <h2 className="projet-section-title">{t('projetDetail.figmaProto')}</h2>
              <p className="projet-desc-text text-center">{t('projetDetail.figmaDesc')}</p>
            </div>
            
            <div className="figma-embed-container">
              <iframe
                title={`Figma Prototype ${projet.nom}`}
                style={{ border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px' }}
                width="100%"
                height="700"
                src={figmaEmbedUrl}
                allowFullScreen
              />
            </div>
          </div>
        </section>
      )}
      
      {/* Next Project CTA */}
      <section className="projet-detail__footer">
        <div className="container">
          <Link to="/realisations" className="btn btn-primary">
            {t('projetDetail.backAll')}
          </Link>
        </div>
      </section>

    </div>
  )
}
