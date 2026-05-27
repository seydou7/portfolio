import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import LanguageModal from './components/LanguageModal'
import Accueil from './pages/Accueil'
import Parcours from './pages/Parcours'
import Realisations from './pages/Realisations'
import ProjetDetail from './pages/ProjetDetail'
import Contact from './pages/Contact'
import Admin from './pages/Admin'
import Login from './pages/Login'

function App() {
  const [showLangModal, setShowLangModal] = useState(false)

  useEffect(() => {
    // Afficher le modal si l'utilisateur n'a pas coché "Ne plus demander"
    // et qu'on ne lui a pas encore demandé durant cette session
    const alreadyChosen = localStorage.getItem('portfolio_lang_chosen')
    const askedThisSession = sessionStorage.getItem('portfolio_lang_asked')
    
    if (!alreadyChosen && !askedThisSession) {
      setShowLangModal(true)
      sessionStorage.setItem('portfolio_lang_asked', 'true')
    }
  }, [])

  return (
    <BrowserRouter>
      {showLangModal && (
        <LanguageModal onClose={() => setShowLangModal(false)} />
      )}
      <Navbar onOpenLangModal={() => setShowLangModal(true)} />
      <main>
        <Routes>
          <Route path="/"            element={<Accueil />} />
          <Route path="/parcours"    element={<Parcours />} />
          <Route path="/realisations" element={<Realisations />} />
          <Route path="/projet/:id"  element={<ProjetDetail />} />
          <Route path="/contact"     element={<Contact />} />
          <Route path="/login"       element={<Login />} />
          <Route path="/admin"       element={<Admin />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  )
}

export default App
