import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, MapPin } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import './Accueil.css'

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
  const { t } = useTranslation()

  return (
    <>
      {/* ===== HERO ===== */}
      <section className="hero" id="hero">
        <div className="hero__bg-ornament" aria-hidden="true" />

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

          {/* CTA */}
          <div className="hero__ctas animate-fade-up" style={{ animationDelay: '1s' }}>
            <Link to="/realisations" className="btn btn-primary hero__cta-main">
              {t('hero.cta')}
              <ArrowRight size={16} />
            </Link>
            <Link to="/contact" className="btn btn-outline">
              {t('hero.ctaSecondary')}
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="hero__scroll-indicator" aria-hidden="true">
          <span className="hero__scroll-line" />
          <span className="hero__scroll-text">Scroll</span>
        </div>
      </section>

      {/* ===== QUOTE (Image 3) ===== */}
      <section className="section quote-section reveal">
        <div className="container text-center">
          <blockquote className="quote-text">
            {t('quote.text')}
          </blockquote>
          <span className="quote-author">{t('quote.author')}</span>
        </div>
      </section>

      {/* ===== ABOUT (Image 4) ===== */}
      <section className="section about-split reveal" id="a-propos">
        <div className="container">
          <div className="about-grid">
            <div className="about-image-wrapper">
              <img src="/about-workspace.png" alt="Espace de travail design et code" className="about-img" />
            </div>
            <div className="about-content">
              <span className="section-label">{t('about.label')}</span>
              <h2 className="about-title">
                {t('about.title')}
              </h2>
              <div className="about-desc">
                <p>{t('about.bio1')}</p>
                <p>{t('about.bio2')}</p>
              </div>
              <div className="about-footer">
                DAKAR · FULL REMOTE · {t('contact.availabilityValue').toUpperCase()}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SECTORS (Image 2) ===== */}
      <section className="section sectors-section reveal">
        <div className="container text-center">
          <span className="section-label">{t('sectors.label')}</span>
          <h2 className="sectors-title">{t('sectors.title')}</h2>
          <div className="sectors-list">
            {t('sectors.list', { returnObjects: true }).map((sector, idx) => (
              <span key={idx}>{sector}</span>
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
          <div className="cta-block">
            <span className="section-label">{t('ctaFinal.label')}</span>
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
