import { useRef, useState, useEffect } from 'react'
import emailjs from '@emailjs/browser'
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  Globe, 
  ExternalLink 
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import './Contact.css'

export default function Contact() {
  const formRef = useRef(null)
  const { t, i18n } = useTranslation()
  const [status, setStatus] = useState(null) // null | 'sending' | 'success' | 'error'
  
  const rawTypes = t('contact.contactTypes', { returnObjects: true })
  const contactTypes = Array.isArray(rawTypes) 
    ? rawTypes 
    : ['Opportunité professionnelle', 'Mission UX/UI', 'Collaboration', 'Autre']

  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    sujet: contactTypes[0] || 'Opportunité professionnelle',
    message: ''
  })

  // SEO & Document Title
  useEffect(() => {
    document.title = t('contact.seoTitle', 'Contact — Seydou Diallo | UX/UI Designer')
    const metaDesc = document.querySelector('meta[name="description"]')
    if (metaDesc) {
      metaDesc.setAttribute(
        'content',
        t('contact.seoDesc', 'Contactez Seydou Diallo, UX/UI Designer basé à Dakar et disponible pour des opportunités professionnelles, missions UX/UI et collaborations en remote.')
      )
    }
  }, [t, i18n.language])

  const handleChange = e => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setStatus('sending')

    try {
      await emailjs.sendForm(
        import.meta.env.VITE_EMAILJS_SERVICE_ID || 'votre_service_id',
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'votre_template_id',
        formRef.current,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'votre_public_key'
      )
      setStatus('success')
      setFormData({
        nom: '',
        email: '',
        sujet: contactTypes[0] || 'Opportunité professionnelle',
        message: ''
      })
    } catch (error) {
      console.error('Erreur EmailJS:', error)
      setStatus('error')
    }
  }

  return (
    <div className="page-contact">
      
      {/* ===== 1. HERO COMPACT ===== */}
      <section className="contact-hero" aria-labelledby="contact-h1">
        <div className="container">
          <div className="contact-hero__inner">
            
            <div className="contact-hero__status-badge">
              <span className="status-dot-green" aria-hidden="true" />
              <span>{t('contact.availability', 'Disponible pour de nouvelles opportunités')}</span>
            </div>

            <span className="section-label">{t('contact.label', 'CONTACT')}</span>

            <h1 id="contact-h1" className="contact-hero__title">
              {t('contact.title', 'Parlons de votre prochaine opportunité')}
            </h1>

            <p className="contact-hero__subtitle">
              {t('contact.subtitle', 'Une opportunité professionnelle, une mission UX/UI ou une collaboration ? Écrivez-moi, je vous répondrai avec plaisir.')}
            </p>

            <div className="contact-hero__meta">
              <MapPin size={15} className="contact-hero__meta-icon" aria-hidden="true" />
              <span>{t('contact.locationMeta', 'Basé à Dakar · Disponible en remote')}</span>
            </div>

          </div>
        </div>
      </section>

      {/* ===== 2. ZONE PRINCIPALE CONTACT (2 COLONNES) ===== */}
      <section className="section contact-section" aria-label="Section de contact">
        <div className="container">
          <div className="contact-layout">
            
            {/* Colonne gauche — Contact Direct */}
            <aside className="contact-direct">
              <div className="contact-direct__card">
                
                <h2 className="contact-direct__title">
                  {t('contact.infoTitle', 'Vous préférez un contact direct ?')}
                </h2>
                
                <p className="contact-direct__sub">
                  {t('contact.infoSub', 'Vous pouvez également me joindre directement par e-mail ou via LinkedIn.')}
                </p>

                <div className="contact-direct__list">
                  
                  {/* E-mail */}
                  <div className="contact-direct__item">
                    <div className="contact-direct__icon-wrapper" aria-hidden="true">
                      <Mail size={18} />
                    </div>
                    <div className="contact-direct__details">
                      <span className="contact-direct__label">{t('contact.emailLabel', 'E-mail')}</span>
                      <a 
                        href="mailto:seydoukellel@gmail.com" 
                        className="contact-direct__value contact-direct__value--link"
                      >
                        seydoukellel@gmail.com
                      </a>
                    </div>
                  </div>

                  {/* Téléphone */}
                  <div className="contact-direct__item">
                    <div className="contact-direct__icon-wrapper" aria-hidden="true">
                      <Phone size={18} />
                    </div>
                    <div className="contact-direct__details">
                      <span className="contact-direct__label">{t('contact.phoneLabel', 'Téléphone')}</span>
                      <a 
                        href="tel:+221774931084" 
                        className="contact-direct__value contact-direct__value--link"
                      >
                        +221 77 493 10 84
                      </a>
                    </div>
                  </div>

                  {/* Localisation */}
                  <div className="contact-direct__item">
                    <div className="contact-direct__icon-wrapper" aria-hidden="true">
                      <MapPin size={18} />
                    </div>
                    <div className="contact-direct__details">
                      <span className="contact-direct__label">{t('contact.locationLabel', 'Localisation')}</span>
                      <span className="contact-direct__value">{t('contact.locationValue', 'Dakar, Sénégal')}</span>
                      <span className="contact-direct__sub-text">{t('contact.locationSub', 'Disponible en remote')}</span>
                    </div>
                  </div>

                  {/* LinkedIn */}
                  <div className="contact-direct__item">
                    <div className="contact-direct__icon-wrapper" aria-hidden="true">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                        <rect x="2" y="9" width="4" height="12" />
                        <circle cx="4" cy="4" r="2" />
                      </svg>
                    </div>
                    <div className="contact-direct__details">
                      <span className="contact-direct__label">{t('contact.linkedinLabel', 'LinkedIn')}</span>
                      <a 
                        href="https://www.linkedin.com/in/seydou-diallo-ux/" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="contact-direct__value contact-direct__value--link contact-direct__value--external"
                      >
                        <span>Seydou Diallo</span>
                        <ExternalLink size={13} aria-hidden="true" />
                      </a>
                    </div>
                  </div>

                </div>

              </div>
            </aside>

            {/* Colonne droite — Formulaire */}
            <main className="contact-form-col">
              <div className="contact-form-card">
                
                <div className="contact-form-card__header">
                  <h2 className="contact-form-card__title">
                    {t('contact.formTitle', 'Envoyez-moi un message')}
                  </h2>
                  <p className="contact-form-card__sub">
                    {t('contact.formSub', 'Décrivez brièvement votre demande et je vous répondrai dès que possible.')}
                  </p>
                </div>

                <form
                  ref={formRef}
                  onSubmit={handleSubmit}
                  className="contact-form"
                  noValidate
                >
                  
                  {/* Ligne 1 : Nom et E-mail */}
                  <div className="contact-form__row">
                    
                    <div className="form-group">
                      <label htmlFor="nom" className="form-label">
                        {t('contact.nameLabel', 'Nom')}
                      </label>
                      <input
                        id="nom"
                        name="nom"
                        type="text"
                        className="form-input"
                        placeholder={t('contact.namePlaceholder', 'Votre nom')}
                        value={formData.nom}
                        onChange={handleChange}
                        required
                        autoComplete="name"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="email" className="form-label">
                        {t('contact.formEmailLabel', 'E-mail')}
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        className="form-input"
                        placeholder={t('contact.emailPlaceholder', 'vous@exemple.com')}
                        value={formData.email}
                        onChange={handleChange}
                        required
                        autoComplete="email"
                      />
                    </div>

                  </div>

                  {/* Ligne 2 : Objet / Type de contact */}
                  <div className="form-group">
                    <label className="form-label" id="contact-type-label">
                      {t('contact.typeLabel', 'Vous me contactez pour')}
                    </label>
                    
                    <div 
                      className="contact-type-chips" 
                      role="radiogroup" 
                      aria-labelledby="contact-type-label"
                    >
                      {contactTypes.map(type => {
                        const isSelected = formData.sujet === type
                        return (
                          <button
                            key={type}
                            type="button"
                            role="radio"
                            aria-checked={isSelected}
                            className={`contact-type-chip ${isSelected ? 'contact-type-chip--selected' : ''}`}
                            onClick={() => setFormData(prev => ({ ...prev, sujet: type }))}
                          >
                            {type}
                          </button>
                        )
                      })}
                    </div>
                    
                    {/* Champ caché pour EmailJS */}
                    <input type="hidden" name="sujet" value={formData.sujet} />
                  </div>

                  {/* Ligne 3 : Message */}
                  <div className="form-group">
                    <div className="form-group__header">
                      <label htmlFor="message" className="form-label">
                        {t('contact.msgLabel', 'Message')}
                      </label>
                      <span className="char-counter" aria-live="polite">
                        {formData.message.length} / 1000
                      </span>
                    </div>
                    <textarea
                      id="message"
                      name="message"
                      className="form-textarea"
                      placeholder={t('contact.messagePlaceholder', 'Parlez-moi de l’opportunité, de la mission ou du contexte dans lequel vous souhaitez échanger.')}
                      value={formData.message}
                      onChange={handleChange}
                      required
                      maxLength={1000}
                      rows={6}
                    />
                  </div>

                  {/* Notifications de Statut */}
                  {status === 'success' && (
                    <div 
                      className="contact-alert contact-alert--success" 
                      role="status" 
                      aria-live="polite"
                    >
                      <CheckCircle2 size={18} aria-hidden="true" />
                      <span>{t('contact.success', 'Message envoyé. Merci, je vous répondrai dès que possible.')}</span>
                    </div>
                  )}

                  {status === 'error' && (
                    <div 
                      className="contact-alert contact-alert--error" 
                      role="alert" 
                      aria-live="assertive"
                    >
                      <AlertCircle size={18} aria-hidden="true" />
                      <span>{t('contact.error', 'Le message n’a pas pu être envoyé. Vérifiez les informations ou réessayez.')}</span>
                    </div>
                  )}

                  {/* Ligne 4 : Bouton d'envoi */}
                  <button
                    type="submit"
                    className="btn btn-primary contact-submit-btn"
                    disabled={status === 'sending'}
                    aria-label={status === 'sending' ? 'Envoi en cours' : 'Envoyer le message'}
                  >
                    {status === 'sending' ? (
                      <>
                        <span className="contact-spinner" aria-hidden="true" />
                        <span>{t('contact.btnSending', 'Envoi en cours…')}</span>
                      </>
                    ) : (
                      <>
                        <Send size={16} aria-hidden="true" />
                        <span>{t('contact.btnSubmit', 'Envoyer le message')}</span>
                      </>
                    )}
                  </button>

                  {/* Micro-zone de réassurance */}
                  <p className="contact-reassurance">
                    {t('contact.reassurance', 'Votre message est uniquement utilisé pour répondre à votre prise de contact.')}
                  </p>

                </form>

              </div>
            </main>

          </div>
        </div>
      </section>

    </div>
  )
}
