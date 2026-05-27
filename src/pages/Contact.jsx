import { useRef, useState } from 'react'
import emailjs from '@emailjs/browser'
import { Mail, Phone, Link2, MapPin, Send, CheckCircle, AlertCircle } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import './Contact.css'

export default function Contact() {
  const formRef = useRef(null)
  const { t } = useTranslation()
  const [status, setStatus] = useState(null) // null | 'sending' | 'success' | 'error'
  const [formData, setFormData] = useState({
    nom: '', email: '', sujet: '', message: ''
  })

  const infos = [
    {
      icon: <Mail size={20} />,
      label: 'Email',
      value: 'seydoukellel@gmail.com',
      href: 'mailto:seydoukellel@gmail.com',
    },
    {
      icon: <Phone size={20} />,
      label: t('contact.phoneLabel') || 'Téléphone',
      value: '+221 77 493 10 84',
      href: 'tel:+221774931084',
    },
    {
      icon: <Link2 size={20} />,
      label: 'LinkedIn',
      value: 'Seydou Diallo',
      href: 'https://www.linkedin.com/in/seydou-diallo-front-end-developpeur-designer-ux-ui/',
      external: true,
    },
    {
      icon: <MapPin size={20} />,
      label: t('contact.location'),
      value: t('hero.location'),
      href: null,
    },
  ]

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
      setFormData({ nom: '', email: '', sujet: '', message: '' })
    } catch (error) {
      console.error('Erreur EmailJS:', error)
      setStatus('error')
    }
  }

  return (
    <div className="page-contact">
      {/* Editorial Header */}
      <div className="page-header-editorial">
        <span className="section-label">{t('contact.label')}</span>
        <h1 className="page-header-editorial__title">{t('contact.title')}</h1>
        <div className="page-header-editorial__line" aria-hidden="true" />
        <p className="page-header-editorial__subtitle">
          {t('contact.subtitle')}
        </p>
      </div>

      <section className="section">
        <div className="container">
          <div className="contact__grid">
            {/* Infos */}
            <div className="contact__info">
              <h2 className="contact__info-title">{t('contact.infoTitle')}</h2>
              <p className="contact__info-sub">
                {t('contact.infoSub')}
              </p>

              <div className="contact__info-list">
                {infos.map(info => (
                  <div key={info.label} className="contact__info-item">
                    <div className="contact__info-icon">{info.icon}</div>
                    <div>
                      <span className="contact__info-label">{info.label}</span>
                      {info.href ? (
                        <a
                          href={info.href}
                          className="contact__info-value contact__info-value--link"
                          target={info.external ? '_blank' : undefined}
                          rel={info.external ? 'noopener noreferrer' : undefined}
                        >
                          {info.value}
                        </a>
                      ) : (
                        <span className="contact__info-value">{info.value}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Disponibilité */}
              <div className="contact__availability">
                <span className="contact__availability-dot" aria-hidden="true" />
                <span>{t('contact.availability')}</span>
              </div>
            </div>

            {/* Formulaire */}
            <div className="contact__form-wrapper">
              <form
                ref={formRef}
                onSubmit={handleSubmit}
                className="contact__form"
                noValidate
              >
                <div className="contact__form-row">
                  <div className="form-group">
                    <label htmlFor="nom" className="form-label">{t('contact.nameLabel')}</label>
                    <input
                      id="nom"
                      name="nom"
                      type="text"
                      className="form-input"
                      placeholder={t('contact.namePlaceholder')}
                      value={formData.nom}
                      onChange={handleChange}
                      required
                      autoComplete="name"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email" className="form-label">{t('contact.emailLabel')}</label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      className="form-input"
                      placeholder={t('contact.emailPlaceholder')}
                      value={formData.email}
                      onChange={handleChange}
                      required
                      autoComplete="email"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">{t('contact.typeLabel')}</label>
                  <div className="contact__chips">
                    {t('contact.projectTypes', { returnObjects: true }).map(type => (
                      <button
                        key={type}
                        type="button"
                        className={`contact__chip ${formData.sujet === type ? 'contact__chip--active' : ''}`}
                        onClick={() => setFormData(prev => ({ ...prev, sujet: type }))}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                  {/* Champ caché pour qu'EmailJS puisse lire la valeur du sujet */}
                  <input type="hidden" name="sujet" value={formData.sujet} />
                </div>

                <div className="form-group">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label htmlFor="message" className="form-label">{t('contact.msgLabel')}</label>
                    <span style={{ fontSize: '12px', color: 'var(--color-muted)' }}>{formData.message.length} / 1000</span>
                  </div>
                  <textarea
                    id="message"
                    name="message"
                    className="form-textarea"
                    placeholder={t('contact.messagePlaceholder')}
                    value={formData.message}
                    onChange={handleChange}
                    required
                    maxLength={1000}
                    rows={6}
                  />
                </div>

                {/* Status */}
                {status === 'success' && (
                  <div className="contact__status contact__status--success">
                    <CheckCircle size={18} />
                    {t('contact.success')}
                  </div>
                )}
                {status === 'error' && (
                  <div className="contact__status contact__status--error">
                    <AlertCircle size={18} />
                    {t('contact.error')}
                  </div>
                )}

                <button
                  type="submit"
                  className="btn btn-primary contact__submit"
                  disabled={status === 'sending'}
                  aria-label="Envoyer le message"
                >
                  {status === 'sending' ? (
                    <>
                      <span className="contact__spinner" aria-hidden="true" />
                      {t('contact.btnSending')}
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      {t('contact.btnSubmit')}
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
