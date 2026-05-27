import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import './LanguageModal.css'

export default function LanguageModal({ onClose }) {
  const { t, i18n } = useTranslation()
  const [remember, setRemember] = useState(false)

  const selectLanguage = (lang) => {
    i18n.changeLanguage(lang)
    localStorage.setItem('portfolio_lang', lang)
    if (remember) {
      localStorage.setItem('portfolio_lang_chosen', 'true')
    }
    onClose()
  }

  return (
    <div className="lang-modal-overlay" role="dialog" aria-modal="true">
      <div className="lang-modal animate-fade-up">
        <div className="lang-modal__header">
          <div className="lang-modal__icon">🌐</div>
          <h2 className="lang-modal__title">{t('langModal.title')}</h2>
          <p className="lang-modal__subtitle">{t('langModal.subtitle')}</p>
        </div>

        <div className="lang-modal__options">
          <button
            className="lang-option"
            onClick={() => selectLanguage('fr')}
          >
            <span className="lang-option__flag">🇫🇷</span>
            <span className="lang-option__name">{t('langModal.fr')}</span>
          </button>
          <button
            className="lang-option"
            onClick={() => selectLanguage('en')}
          >
            <span className="lang-option__flag">🇬🇧</span>
            <span className="lang-option__name">{t('langModal.en')}</span>
          </button>
        </div>

        <label className="lang-modal__remember">
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
          />
          <span>{t('langModal.remember')}</span>
        </label>
      </div>
    </div>
  )
}
