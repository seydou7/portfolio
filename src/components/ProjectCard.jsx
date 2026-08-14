import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, LayoutDashboard, Globe, Smartphone, Code, Layers } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import './ProjectCard.css'

export default function ProjectCard({ project }) {
  const { t } = useTranslation()
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)

  if (!project) return null

  const getCategoryIcon = (cat) => {
    switch (cat) {
      case 'dashboard': return <LayoutDashboard size={14} />
      case 'web':       return <Globe size={14} />
      case 'mobile':    return <Smartphone size={14} />
      case 'dev':       return <Code size={14} />
      default:          return <Layers size={14} />
    }
  }

  const getCategoryLabel = (cat) => {
    switch (cat) {
      case 'dashboard': return t('realisations.catDashboard', 'Dashboard / Métier')
      case 'web':       return t('realisations.catWeb', 'Web & Digital')
      case 'mobile':    return t('realisations.catMobile', 'Mobile App')
      case 'dev':       return t('realisations.catDev', 'Front-end & UI')
      default:          return cat ? cat.charAt(0).toUpperCase() + cat.slice(1) : ''
    }
  }

  // Limiter à 4 tags maximum comme prescrit
  const visibleTags = Array.isArray(project.techno) ? project.techno.slice(0, 4) : []

  // Déterminer l'image à afficher
  const imageSrc = project.cover || project.image || ''

  return (
    <article className="project-card-wrapper">
      <Link 
        to={`/projet/${project.id}`} 
        className="project-card"
        aria-label={`${project.nom} — ${project.type || 'Détails du projet'}`}
      >
        {/* Visuel 16:10 */}
        <div className="project-card__media">
          {imageSrc && !imageError ? (
            <>
              {!imageLoaded && (
                <div className="project-card__media-skeleton" aria-hidden="true" />
              )}
              <img
                src={imageSrc}
                alt={`Interface du projet ${project.nom}`}
                loading="lazy"
                className={`project-card__img ${imageLoaded ? 'project-card__img--loaded' : ''}`}
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageError(true)}
              />
            </>
          ) : (
            <div className={`project-card__fallback project-card__fallback--${project.categorie || 'default'}`}>
              <div className="project-card__fallback-icon" aria-hidden="true">
                {getCategoryIcon(project.categorie)}
              </div>
              <span className="project-card__fallback-title">{project.nom}</span>
            </div>
          )}

          {/* Badges sur le média */}
          <div className="project-card__media-badges">
            {project.showInHome && (
              <span className="project-badge project-badge--featured">
                {t('realisations.badgeSelected', 'Projet sélectionné')}
              </span>
            )}
            {project.pays && (
              <span className="project-badge project-badge--country">
                {project.pays}
              </span>
            )}
          </div>
        </div>

        {/* Corps de la carte */}
        <div className="project-card__content">
          {/* En-tête contextuel */}
          <div className="project-card__context">
            <span className="project-card__category">
              {getCategoryIcon(project.categorie)}
              <span>{getCategoryLabel(project.categorie)}</span>
            </span>
            {project.ecrans && (
              <span className="project-card__screens">
                {project.ecrans} {t('realisations.ecrans', 'écrans')}
              </span>
            )}
          </div>

          {/* Titre & sous-titre */}
          <h2 className="project-card__title">{project.nom}</h2>
          {project.type && (
            <p className="project-card__type">{project.type}</p>
          )}

          {/* Description limitée visuellement */}
          {project.description && (
            <p className="project-card__desc">{project.description}</p>
          )}

          {/* Tags technologiques (max 4) */}
          {visibleTags.length > 0 && (
            <div className="project-card__tags" aria-label="Compétences et technologies">
              {visibleTags.map((tag) => (
                <span key={tag} className="project-card__tag">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* CTA d'action en bas de carte */}
          <div className="project-card__footer">
            <span className="project-card__cta">
              <span>{t('realisations.voirProjet', 'Voir le projet')}</span>
              <ArrowRight size={15} className="project-card__cta-arrow" aria-hidden="true" />
            </span>
          </div>
        </div>
      </Link>
    </article>
  )
}
