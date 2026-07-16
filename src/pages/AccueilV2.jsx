import { useEffect, useState, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight, Mail, Phone, Link2,
  Globe, Smartphone, LayoutDashboard, Code, Monitor,
  Palette, Eye, Users, Calendar, Briefcase, Layers,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion'
import { projets as staticProjets } from '../data/projets'
import { translateArray } from '../i18n/autoTranslate'
import API_URL from '../config/api'
import './AccueilV2.css'

/* ============================================================
   HELPERS
   ============================================================ */
const categoryIcon = {
  web: <Globe size={16} />,
  mobile: <Smartphone size={16} />,
  dashboard: <LayoutDashboard size={16} />,
  dev: <Code size={16} />,
}
const serviceIcons = [<Palette size={24} />, <Code size={24} />, <Eye size={24} />, <Users size={24} />]
const statIcons = [<Calendar size={22} />, <Briefcase size={22} />, <Globe size={22} />, <Layers size={22} />]

/* Framer Motion variants */
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] },
  }),
}

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
}

const scaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
}

/* ============================================================
   SPOTLIGHT CURSOR
   ============================================================ */
function Spotlight() {
  const x = useMotionValue(-200)
  const y = useMotionValue(-200)
  const smoothX = useSpring(x, { stiffness: 100, damping: 30 })
  const smoothY = useSpring(y, { stiffness: 100, damping: 30 })

  useEffect(() => {
    const move = (e) => { x.set(e.clientX - 200); y.set(e.clientY - 200) }
    window.addEventListener('mousemove', move)
    return () => window.removeEventListener('mousemove', move)
  }, [x, y])

  return (
    <motion.div
      className="v2-spotlight"
      style={{ left: smoothX, top: smoothY }}
      aria-hidden="true"
    />
  )
}

/* ============================================================
   ANIMATED NAME
   ============================================================ */
function AnimatedName({ name }) {
  return (
    <motion.span
      aria-label={name}
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      {name.split('').map((char, i) => (
        <motion.span
          key={i}
          style={{ display: 'inline-block' }}
          variants={{
            hidden: { opacity: 0, y: 60, rotateX: -40 },
            visible: {
              opacity: 1, y: 0, rotateX: 0,
              transition: { duration: 0.6, delay: 0.3 + i * 0.04, ease: [0.16, 1, 0.3, 1] },
            },
          }}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </motion.span>
  )
}

/* ============================================================
   TYPEWRITER
   ============================================================ */
function Typewriter({ words }) {
  const [index, setIndex] = useState(0)
  const [text, setText] = useState('')
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const word = words[index]
    const speed = deleting ? 35 : 70
    const timeout = setTimeout(() => {
      if (!deleting) {
        setText(word.slice(0, text.length + 1))
        if (text.length + 1 === word.length) setTimeout(() => setDeleting(true), 2000)
      } else {
        setText(word.slice(0, text.length - 1))
        if (text.length === 0) { setDeleting(false); setIndex((i) => (i + 1) % words.length) }
      }
    }, speed)
    return () => clearTimeout(timeout)
  }, [text, deleting, index, words])

  return (
    <span className="v2-hero__typewriter">
      {text}<span className="v2-hero__cursor" aria-hidden="true" />
    </span>
  )
}

/* ============================================================
   COUNT-UP
   ============================================================ */
function CountUp({ target, suffix = '', duration = 2000 }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true
          const num = parseInt(target, 10)
          const steps = 60
          const stepDur = duration / steps
          let current = 0
          const inc = num / steps
          const interval = setInterval(() => {
            current += inc
            if (current >= num) { setCount(num); clearInterval(interval) }
            else setCount(Math.floor(current))
          }, stepDur)
        }
      },
      { threshold: 0.3 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [target, duration])

  return <span ref={ref}>{count}{suffix}</span>
}

/* ============================================================
   SCROLL REVEAL HOOK
   ============================================================ */
function useScrollRevealV2() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('v2-revealed'); observer.unobserve(e.target) }
      }),
      { threshold: 0.08 }
    )
    document.querySelectorAll('.v2-reveal, .v2-reveal-left, .v2-reveal-right').forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])
}

/* ============================================================
   PARALLAX SECTION
   ============================================================ */
function ParallaxSection({ children, speed = 0.1, className = '' }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [speed * 100, speed * -100])

  return (
    <motion.section ref={ref} style={{ y }} className={className}>
      {children}
    </motion.section>
  )
}

/* ============================================================
   MAIN PAGE
   ============================================================ */
export default function AccueilV2() {
  useScrollRevealV2()
  const { t, i18n } = useTranslation()
  const [projetsHome, setProjetsHome] = useState([])
  const [translatedProjets, setTranslatedProjets] = useState([])

  // Fetch projects
  useEffect(() => {
    fetch(`${API_URL}/api/projets`)
      .then(res => res.json())
      .then(data => {
        if (data?.length > 0) {
          const hp = data.filter(p => p.showInHome)
          const fallback = [...hp, ...data.filter(p => !p.showInHome)].slice(0, 3)
          setProjetsHome(hp.length >= 3 ? hp.slice(0, 3) : fallback)
        } else {
          const sp = staticProjets.filter(p => p.showInHome)
          const fallback = [...sp, ...staticProjets.filter(p => !p.showInHome)].slice(0, 3)
          setProjetsHome(sp.length >= 3 ? sp.slice(0, 3) : fallback)
        }
      })
      .catch(() => {
        const sp = staticProjets.filter(p => p.showInHome)
        const fallback = [...sp, ...staticProjets.filter(p => !p.showInHome)].slice(0, 3)
        setProjetsHome(sp.length >= 3 ? sp.slice(0, 3) : fallback)
      })
  }, [])

  useEffect(() => {
    if (!projetsHome.length) return
    const lang = i18n.language?.startsWith('en') ? 'en' : 'fr'
    translateArray(projetsHome, ['description', 'type'], lang).then(setTranslatedProjets)
  }, [projetsHome, i18n.language])

  const displayedProjets = translatedProjets.length > 0 ? translatedProjets : projetsHome

  // Re-observe reveals after dynamic content loads
  useEffect(() => {
    if (!displayedProjets.length) return
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('v2-revealed'); observer.unobserve(e.target) }
      }),
      { threshold: 0.08 }
    )
    const timer = setTimeout(() => {
      document.querySelectorAll('.v2-reveal:not(.v2-revealed), .v2-reveal-left:not(.v2-revealed), .v2-reveal-right:not(.v2-revealed)')
        .forEach(el => observer.observe(el))
    }, 100)
    return () => { observer.disconnect(); clearTimeout(timer) }
  }, [displayedProjets])

  const typewriterWords = t('heroV2.typewriter', { returnObjects: true })
  const statsItems = t('statsImpact.items', { returnObjects: true })
  const serviceItems = t('servicesSection.items', { returnObjects: true })
  const stackCategories = t('stackTech.categories', { returnObjects: true })
  const countries = t('availability.countries', { returnObjects: true })
  const trustClients = t('trustBar.clients', { returnObjects: true })

  return (
    <div className="v2-page">
      {/* ===== GLOBAL BACKGROUND EFFECTS ===== */}
      <div className="v2-aurora" aria-hidden="true">
        <div className="v2-aurora__blob v2-aurora__blob--1" />
        <div className="v2-aurora__blob v2-aurora__blob--2" />
        <div className="v2-aurora__blob v2-aurora__blob--3" />
      </div>
      <div className="v2-grid-overlay" aria-hidden="true" />
      <div className="v2-noise" aria-hidden="true" />
      <Spotlight />

      {/* ===== 1. HERO ===== */}
      <section className="v2-hero" id="v2-hero">
        <div className="v2-hero__beams" aria-hidden="true">
          {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className={`v2-beam v2-beam--${i}`} />)}
        </div>

        <motion.div
          className="v2-hero__content"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.p className="v2-hero__greeting" variants={fadeUp} custom={0}>
            {t('heroV2.greeting')}
          </motion.p>

          <h1 className="v2-hero__name">
            <AnimatedName name={t('heroV2.name')} />
          </h1>

          <motion.div className="v2-hero__typewriter-wrap" variants={fadeUp} custom={3}>
            <Typewriter words={Array.isArray(typewriterWords) ? typewriterWords : ['Designer UX/UI']} />
          </motion.div>

          <motion.p className="v2-hero__subtitle" variants={fadeUp} custom={4}>
            {t('heroV2.subtitle')}
          </motion.p>

          <motion.div className="v2-hero__stats" variants={fadeUp} custom={5}>
            <div className="v2-hero__stat">
              <span className="v2-hero__stat-num">6+</span>
              <span className="v2-hero__stat-label">{t('heroV2.statYears')}</span>
            </div>
            <div className="v2-hero__stat">
              <span className="v2-hero__stat-num">15+</span>
              <span className="v2-hero__stat-label">{t('heroV2.statProjects')}</span>
            </div>
            <div className="v2-hero__stat">
              <span className="v2-hero__stat-num">5</span>
              <span className="v2-hero__stat-label">{t('heroV2.statCountries')}</span>
            </div>
          </motion.div>

          <motion.div variants={fadeUp} custom={6} style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="v2-hero__available">
              <span className="v2-hero__available-dot" />
              {t('heroV2.available')}
            </div>
          </motion.div>

          <motion.div className="v2-hero__ctas" variants={fadeUp} custom={7}>
            <Link to="/realisations" className="v2-hero__cta-primary">
              {t('heroV2.ctaPrimary')} <ArrowRight size={16} />
            </Link>
            <Link to="/contact" className="v2-hero__cta-secondary">
              {t('heroV2.ctaSecondary')}
            </Link>
          </motion.div>
        </motion.div>

        <div className="v2-hero__scroll" aria-hidden="true">
          <span>{t('heroV2.scrollHint')}</span>
          <div className="v2-hero__scroll-line" />
        </div>
      </section>

      {/* ===== 2. TRUST BAR ===== */}
      <section className="v2-trust" id="v2-trust">
        <p className="v2-trust__label">{t('trustBar.label')}</p>
        <div className="v2-trust__track">
          {[...trustClients, ...trustClients].map((client, i) => (
            <span key={i}>
              <span className="v2-trust__item">{client}</span>
              {i < trustClients.length * 2 - 1 && <span className="v2-trust__sep">✦</span>}
            </span>
          ))}
        </div>
      </section>

      <div className="v2-section-divider" />

      {/* ===== 3. PITCH ABOUT ===== */}
      <section className="v2-pitch section" id="v2-about">
        <div className="container">
          <div className="v2-pitch__grid">
            <motion.div
              className="v2-pitch__text"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
              variants={staggerContainer}
            >
              <motion.span className="v2-pitch__label" variants={fadeUp}>{t('pitchAbout.label')}</motion.span>
              <motion.h2 className="v2-pitch__title" variants={fadeUp}>{t('pitchAbout.title')}</motion.h2>
              <motion.p className="v2-pitch__para" variants={fadeUp}>{t('pitchAbout.p1')}</motion.p>
              <motion.p className="v2-pitch__para" variants={fadeUp}>{t('pitchAbout.p2')}</motion.p>
              <motion.p className="v2-pitch__para" variants={fadeUp}>{t('pitchAbout.p3')}</motion.p>
              <motion.div className="v2-pitch__divider" variants={fadeUp} />
              <motion.div variants={fadeUp}>
                <Link to="/parcours" className="v2-pitch__cta">
                  {t('pitchAbout.cta')} <ArrowRight size={14} />
                </Link>
              </motion.div>
            </motion.div>

            <motion.div
              className="v2-pitch__img-wrap"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
              variants={scaleIn}
            >
              <img
                src="/about-workspace.png"
                alt={t('pitchAbout.imgAlt')}
                className="v2-pitch__img"
                loading="lazy"
              />
            </motion.div>
          </div>
        </div>
      </section>

      <div className="v2-section-divider" />

      {/* ===== 4. STATS IMPACT ===== */}
      <section className="v2-stats section" id="v2-stats">
        <div className="container">
          <motion.p
            className="v2-stats__label"
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
          >
            {t('statsImpact.label')}
          </motion.p>
          <motion.div
            className="v2-stats__grid"
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }}
            variants={staggerContainer}
          >
            {Array.isArray(statsItems) && statsItems.map((stat, i) => (
              <motion.div className="v2-stat-card" key={i} variants={fadeUp} custom={i}>
                <div className="v2-stat-card__icon">{statIcons[i]}</div>
                <div className="v2-stat-card__num">
                  <CountUp target={stat.value} />
                  <span className="v2-stat-card__suffix">{stat.suffix}</span>
                </div>
                <p className="v2-stat-card__label">{stat.label}</p>
                <p className="v2-stat-card__desc">{stat.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <div className="v2-section-divider" />

      {/* ===== 5. FEATURED PROJECTS ===== */}
      <section className="v2-projects section" id="v2-projects">
        <div className="container">
          <motion.div
            className="v2-projects__header"
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
          >
            <div>
              <span className="v2-projects__label">{t('realisations.label')}</span>
              <h2 className="v2-projects__title">{t('realisations.featuredTitle')}</h2>
            </div>
            <Link to="/realisations" className="v2-projects__view-all">
              {t('realisations.featuredViewAll')} <ArrowRight size={14} />
            </Link>
          </motion.div>

          <div className="v2-projects__grid">
            {displayedProjets.map((projet, i) => (
              <motion.div
                key={projet.id}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-80px' }}
                variants={fadeUp}
                custom={i}
              >
                <Link to={`/projet/${projet.id}`} className="v2-project-case">
                  <div className="v2-project-case__img-wrap">
                    <img src={projet.cover} alt={projet.nom} className="v2-project-case__img" loading="lazy" />
                  </div>
                  <div className="v2-project-case__info">
                    <div className="v2-project-case__meta">
                      <span className="v2-project-case__meta-icon">
                        {categoryIcon[projet.categorie] || <Monitor size={16} />}
                      </span>
                      <span>{projet.pays}</span><span>·</span>
                      <span>{projet.ecrans} {t('realisations.ecrans')}</span>
                    </div>
                    <h3 className="v2-project-case__name">{projet.nom}</h3>
                    <p className="v2-project-case__type">{projet.type}</p>
                    <p className="v2-project-case__desc">{projet.description}</p>
                    <div className="v2-project-case__techs">
                      {projet.techno.map(tech => (
                        <span key={tech} className="v2-project-case__tech">{tech}</span>
                      ))}
                    </div>
                    <span className="v2-project-case__link">
                      {t('realisations.voirProjet')} <ArrowRight size={14} />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <div className="v2-section-divider" />

      {/* ===== 6. SERVICES ===== */}
      <section className="v2-services section" id="v2-services">
        <div className="container">
          <motion.div
            className="v2-services__header"
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
          >
            <span className="v2-services__label">{t('servicesSection.label')}</span>
            <h2 className="v2-services__title">{t('servicesSection.title')}</h2>
          </motion.div>

          <motion.div
            className="v2-services__grid"
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }}
            variants={staggerContainer}
          >
            {Array.isArray(serviceItems) && serviceItems.map((service, i) => (
              <motion.div className="v2-service-card" key={i} variants={fadeUp} custom={i}>
                <div className="v2-service-card__icon">{serviceIcons[i]}</div>
                <h3 className="v2-service-card__title">{service.title}</h3>
                <p className="v2-service-card__desc">{service.desc}</p>
                <div className="v2-service-card__tags">
                  {service.tags.map(tag => (
                    <span key={tag} className="v2-service-card__tag">{tag}</span>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <div className="v2-section-divider" />

      {/* ===== 7. STACK TECH ===== */}
      <section className="v2-stack section" id="v2-stack">
        <div className="container">
          <motion.div
            className="v2-stack__header"
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
          >
            <span className="v2-stack__label">{t('stackTech.label')}</span>
            <h2 className="v2-stack__title">{t('stackTech.title')}</h2>
          </motion.div>

          <motion.div
            className="v2-stack__categories"
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }}
            variants={staggerContainer}
          >
            {Array.isArray(stackCategories) && stackCategories.map((cat, i) => (
              <motion.div className="v2-stack__category" key={i} variants={fadeUp} custom={i}>
                <span className="v2-stack__cat-name">{cat.name}</span>
                <div className="v2-stack__tools">
                  {cat.tools.map((tool, j) => (
                    <motion.span
                      key={tool}
                      className="v2-stack__tool"
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 + j * 0.04, duration: 0.4 }}
                    >
                      {tool}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <div className="v2-section-divider" />

      {/* ===== 8. TESTIMONIAL ===== */}
      <ParallaxSection speed={0.05} className="v2-testimonial" id="v2-testimonial">
        <motion.div
          className="v2-testimonial__inner container"
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }}
          variants={staggerContainer}
        >
          <motion.div className="v2-testimonial__mark" aria-hidden="true" variants={fadeUp}>"</motion.div>
          <motion.blockquote className="v2-testimonial__quote" variants={fadeUp}>
            {t('testimonial.quote')}
          </motion.blockquote>
          <motion.p className="v2-testimonial__author" variants={fadeUp}>{t('testimonial.author')}</motion.p>
          <motion.p className="v2-testimonial__role" variants={fadeUp}>{t('testimonial.role')}</motion.p>
        </motion.div>
      </ParallaxSection>

      <div className="v2-section-divider" />

      {/* ===== 9. AVAILABILITY ===== */}
      <section className="v2-availability section" id="v2-availability">
        <div className="container">
          <motion.div
            className="v2-availability__header"
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
          >
            <span className="v2-availability__label">{t('availability.label')}</span>
            <h2 className="v2-availability__title">{t('availability.title')}</h2>
          </motion.div>

          <div className="v2-availability__grid">
            <motion.div
              className="v2-availability__countries"
              initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }}
              variants={staggerContainer}
            >
              {Array.isArray(countries) && countries.map((country, i) => (
                <motion.div className="v2-country" key={i} variants={fadeUp} custom={i}>
                  <span className="v2-country__flag" role="img" aria-label={country.name}>{country.flag}</span>
                  <span className="v2-country__name">{country.name}</span>
                  <span className="v2-country__role">{country.role}</span>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              className="v2-availability__status"
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={scaleIn}
            >
              <div className="v2-availability__remote-badge">
                <span className="v2-hero__available-dot" />
                {t('availability.remote')}
              </div>
              <h3 className="v2-availability__remote-title">{t('availability.remote')}</h3>
              <p className="v2-availability__remote-desc">{t('availability.remoteDesc')}</p>
              <div className="v2-availability__info-row">
                <span className="v2-availability__info-label">{t('availability.statusLabel')}</span>
                <span className="v2-availability__info-value">{t('availability.statusValue')}</span>
              </div>
              <div className="v2-availability__info-row">
                <span className="v2-availability__info-label">{t('availability.typeLabel')}</span>
                <span className="v2-availability__info-value">{t('availability.typeValue')}</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <div className="v2-section-divider" />

      {/* ===== 10. CTA MEGA ===== */}
      <section className="v2-cta-mega" id="v2-cta">
        <div className="v2-cta-mega__glow" aria-hidden="true" />
        <motion.div
          className="v2-cta-mega__inner container"
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }}
          variants={staggerContainer}
        >
          <motion.span className="v2-cta-mega__label" variants={fadeUp}>{t('ctaMega.label')}</motion.span>
          <motion.h2 className="v2-cta-mega__title" variants={fadeUp}>
            {t('ctaMega.title1')}<br /><span>{t('ctaMega.title2')}</span>
          </motion.h2>
          <motion.p className="v2-cta-mega__subtitle" variants={fadeUp}>{t('ctaMega.subtitle')}</motion.p>

          <motion.div className="v2-cta-mega__channels" variants={fadeUp}>
            <a href="mailto:seydoukellel@gmail.com" className="v2-cta-mega__channel">
              <span className="v2-cta-mega__channel-icon"><Mail size={20} /></span>
              <span className="v2-cta-mega__channel-label">{t('ctaMega.emailLabel')}</span>
              <span className="v2-cta-mega__channel-value">seydoukellel@gmail.com</span>
            </a>
            <a href="tel:+221774931084" className="v2-cta-mega__channel">
              <span className="v2-cta-mega__channel-icon"><Phone size={20} /></span>
              <span className="v2-cta-mega__channel-label">{t('ctaMega.phoneLabel')}</span>
              <span className="v2-cta-mega__channel-value">+221 77 493 10 84</span>
            </a>
            <a
              href="https://www.linkedin.com/in/seydou-diallo-front-end-developpeur-designer-ux-ui/"
              target="_blank" rel="noopener noreferrer"
              className="v2-cta-mega__channel"
            >
              <span className="v2-cta-mega__channel-icon"><Link2 size={20} /></span>
              <span className="v2-cta-mega__channel-label">{t('ctaMega.linkedinLabel')}</span>
              <span className="v2-cta-mega__channel-value">Seydou Diallo</span>
            </a>
          </motion.div>

          <motion.div variants={fadeUp}>
            <Link to="/contact" className="v2-cta-mega__btn">
              {t('ctaMega.btn')} <ArrowRight size={18} />
            </Link>
          </motion.div>
        </motion.div>
      </section>
    </div>
  )
}
