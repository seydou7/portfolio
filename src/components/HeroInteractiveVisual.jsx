import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  Layers, 
  SlidersHorizontal,
  ChevronRight,
  TrendingUp
} from 'lucide-react'
import './HeroInteractiveVisual.css'

export default function HeroInteractiveVisual() {
  const [activeTab, setActiveTab] = useState('tous')
  const [approvedCount, setApprovedCount] = useState(128)
  const [justApproved, setJustApproved] = useState(false)

  const handleApproveAction = () => {
    if (!justApproved) {
      setApprovedCount(prev => prev + 1)
      setJustApproved(true)
      setTimeout(() => setJustApproved(false), 3000)
    }
  }

  return (
    <div className="hero-interactive-showcase" aria-label="Aperçu interactif d'interface conçue par Seydou Diallo">
      
      {/* Background glow effects */}
      <div className="hero-showcase__ambient-glow" aria-hidden="true" />

      {/* ===== 1. CARTE PRINCIPALE — DASHBOARD MÉTIER CETUD ===== */}
      <motion.div 
        className="showcase-main-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        
        {/* Header de la fenêtre d'application */}
        <div className="showcase-card__window-bar">
          <div className="window-dots" aria-hidden="true">
            <span className="dot dot--red" />
            <span className="dot dot--yellow" />
            <span className="dot dot--green" />
          </div>
          <div className="window-title">
            <span className="window-badge">CETUD</span>
            <span className="window-path">system.cetud.sn / dashboard</span>
          </div>
          <div className="window-status">
            <span className="pulse-dot" aria-hidden="true" />
            <span className="status-label">En direct</span>
          </div>
        </div>

        {/* Corps du Dashboard */}
        <div className="showcase-card__body">
          
          {/* Titre & onglets */}
          <div className="showcase-app__header">
            <div>
              <h3 className="showcase-app__title">Gestion des Tarifs Sociaux</h3>
              <p className="showcase-app__sub">Plateforme multi-rôles · Validation des bénéficiaires</p>
            </div>
            
            <div className="showcase-app__tabs" role="tablist">
              <button 
                className={`tab-btn ${activeTab === 'tous' ? 'tab-btn--active' : ''}`}
                onClick={() => setActiveTab('tous')}
                type="button"
              >
                Tous
              </button>
              <button 
                className={`tab-btn ${activeTab === 'pending' ? 'tab-btn--active' : ''}`}
                onClick={() => setActiveTab('pending')}
                type="button"
              >
                En attente (14)
              </button>
            </div>
          </div>

          {/* Mini statistiques clés */}
          <div className="showcase-stats-grid">
            <div className="stat-box">
              <span className="stat-box__label">Demandes reçues</span>
              <div className="stat-box__val-wrap">
                <span className="stat-box__value">1,420</span>
                <span className="stat-box__growth">
                  <TrendingUp size={12} /> +18%
                </span>
              </div>
            </div>

            <div className="stat-box stat-box--highlight">
              <span className="stat-box__label">Cartes validées</span>
              <div className="stat-box__val-wrap">
                <span className="stat-box__value">{approvedCount}</span>
                <span className="stat-box__tag">Actives</span>
              </div>
            </div>
          </div>

          {/* Mini Table des bénéficiaires */}
          <div className="showcase-table">
            <div className="showcase-table__row showcase-table__row--header">
              <span>Bénéficiaire</span>
              <span>Catégorie</span>
              <span>Statut</span>
            </div>

            <div className="showcase-table__row">
              <div className="user-cell">
                <div className="user-avatar user-avatar--1">AD</div>
                <div className="user-meta">
                  <span className="user-name">Awa Diallo</span>
                  <span className="user-sub">Dakar Plateau</span>
                </div>
              </div>
              <span className="category-pill">Tarif Étudiant</span>
              <span className="status-pill status-pill--success">
                <CheckCircle2 size={12} /> Validé
              </span>
            </div>

            <div className="showcase-table__row">
              <div className="user-cell">
                <div className="user-avatar user-avatar--2">MN</div>
                <div className="user-meta">
                  <span className="user-name">Moussa Ndiaye</span>
                  <span className="user-sub">Grand Yoff</span>
                </div>
              </div>
              <span className="category-pill">Mobilité Réduite</span>
              {justApproved ? (
                <span className="status-pill status-pill--success">
                  <CheckCircle2 size={12} /> Validé
                </span>
              ) : (
                <button 
                  className="status-pill status-pill--action"
                  onClick={handleApproveAction}
                  type="button"
                  title="Cliquer pour valider"
                >
                  <Clock size={12} /> À valider
                </button>
              )}
            </div>
          </div>

        </div>

      </motion.div>

      {/* ===== 2. CARTE FLOTTANTE — DESIGN SYSTEM INSPECTOR (Haut Droite) ===== */}
      <motion.aside 
        className="showcase-floating-card showcase-floating-card--top"
        initial={{ opacity: 0, x: 20, y: -10 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ duration: 0.6, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
        whileHover={{ y: -4, transition: { duration: 0.2 } }}
      >
        <div className="floating-card__header">
          <div className="floating-card__icon floating-card__icon--blue" aria-hidden="true">
            <Layers size={14} />
          </div>
          <span className="floating-card__title">Design System v2.4</span>
        </div>

        <div className="floating-card__tokens">
          <span className="token-label">Color Tokens</span>
          <div className="color-swatches" aria-label="Nuancier de couleurs">
            <span className="swatch swatch--blue" title="Primary #2563EB" />
            <span className="swatch swatch--dark" title="Surface #101828" />
            <span className="swatch swatch--green" title="Success #16A34A" />
            <span className="swatch swatch--border" title="Border #E4E7EC" />
          </div>
        </div>

        <div className="floating-card__action-preview">
          <button className="preview-btn" type="button">
            <span>Bouton Primaire</span>
            <ChevronRight size={13} />
          </button>
        </div>
      </motion.aside>

      {/* ===== 3. BADGE FLOTTANT — UX & PROTOTYPAGE (Bas Gauche) ===== */}
      <motion.aside 
        className="showcase-floating-card showcase-floating-card--bottom"
        initial={{ opacity: 0, x: -20, y: 15 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ duration: 0.6, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
        whileHover={{ y: -4, transition: { duration: 0.2 } }}
      >
        <div className="floating-badge-inner">
          <div className="floating-card__icon floating-card__icon--gold" aria-hidden="true">
            <Sparkles size={14} />
          </div>
          <div className="floating-badge-text">
            <span className="badge-main">19 Écrans Prototypés</span>
            <span className="badge-sub">Figma Auto-layout & Variables</span>
          </div>
        </div>
      </motion.aside>

    </div>
  )
}
