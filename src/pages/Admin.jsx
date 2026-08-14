import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { projets as staticProjets } from '../data/projets'
import { experiences as staticExperiences, formations as staticFormations } from '../data/parcours'
import { 
  Plus, 
  Pencil, 
  Trash2, 
  ExternalLink, 
  X, 
  Save, 
  ArrowUp, 
  ArrowDown, 
  Crop, 
  FolderKanban, 
  Briefcase, 
  BarChart3, 
  LogOut, 
  Image as ImageIcon,
  Sparkles,
  Search,
  CheckCircle2,
  GraduationCap
} from 'lucide-react'
import Cropper from 'react-easy-crop'
import getCroppedImg from '../utils/cropImage'
import StatsWidget from '../components/StatsWidget'
import API_URL from '../config/api'
import './Admin.css'

export default function Admin() {
  const navigate = useNavigate()
  const [projets, setProjets] = useState([])
  const [experiences, setExperiences] = useState([])
  const [formations, setFormations] = useState([])
  const [activeTab, setActiveTab] = useState('projets')
  const [projectSearch, setProjectSearch] = useState('')
  
  const [isProjectFormOpen, setIsProjectFormOpen] = useState(false)
  const [editingProject, setEditingProject] = useState(null)
  const [selectedFile, setSelectedFile] = useState(null)
  
  // States for Cropper
  const [imageSrc, setImageSrc] = useState(null)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
  const [isCropperOpen, setIsCropperOpen] = useState(false)

  const [projectFormData, setProjectFormData] = useState({
    nom: '',
    type: '',
    ecrans: '',
    pays: '',
    techno: '',
    live: '',
    figma: '',
    designUrl: '',
    categorie: 'web',
    description: '',
    contexte: '',
    role: '',
    cover: '/portfolio_project_mockup.png',
    showInHome: false
  })

  // State pour le formulaire Parcours (Expérience/Formation)
  const [isParcoursFormOpen, setIsParcoursFormOpen] = useState(false)
  const [editingParcours, setEditingParcours] = useState(null)
  const [parcoursType, setParcoursType] = useState('experience') // 'experience' ou 'formation'
  const [parcoursFormData, setParcoursFormData] = useState({
    periode: '',
    entreprise: '',
    poste: '',
    description: ''
  })

  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    if (!token) {
      navigate('/login')
    } else {
      fetchData()
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('admin_token')
    navigate('/login')
  }

  const fetchData = async () => {
    try {
      // Charger les projets
      const resProjets = await fetch(`${API_URL}/api/projets`)
      const dataProjets = await resProjets.json()
      if (dataProjets && dataProjets.length > 0) {
        setProjets(dataProjets)
      } else {
        setProjets(staticProjets)
      }

      // Charger le parcours
      const resParcours = await fetch(`${API_URL}/api/parcours`)
      const dataParcours = await resParcours.json()
      if (dataParcours && dataParcours.length > 0) {
        setExperiences(dataParcours.filter(item => item.type === 'experience'))
        setFormations(dataParcours.filter(item => item.type === 'formation'))
      } else {
        setExperiences(staticExperiences)
        setFormations(staticFormations)
      }
    } catch (err) {
      console.error('Erreur lors du chargement des données:', err)
      setProjets(staticProjets)
      setExperiences(staticExperiences)
      setFormations(staticFormations)
    }
  }

  // Handlers Projets
  const handleDeleteProject = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) {
      try {
        await fetch(`${API_URL}/api/projets/${id}`, { method: 'DELETE' })
        fetchData()
      } catch (err) {
        console.error(err)
      }
    }
  }

  const handleOpenProjectForm = (project = null) => {
    if (project) {
      setEditingProject(project)
      setProjectFormData({
        ...project,
        techno: Array.isArray(project.techno) ? project.techno.join(', ') : (project.techno || '')
      })
    } else {
      setEditingProject(null)
      setSelectedFile(null)
      setProjectFormData({
        nom: '',
        type: '',
        ecrans: '',
        pays: '',
        techno: '',
        live: '',
        figma: '',
        designUrl: '',
        categorie: 'web',
        description: '',
        contexte: '',
        role: '',
        cover: '/portfolio_project_mockup.png',
        showInHome: false
      })
    }
    setIsProjectFormOpen(true)
  }

  const handleCloseProjectForm = () => {
    setIsProjectFormOpen(false)
    setEditingProject(null)
    setSelectedFile(null)
    setImageSrc(null)
  }

  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }

  const showCroppedImage = async () => {
    try {
      const croppedImageBlob = await getCroppedImg(
        imageSrc,
        croppedAreaPixels,
        0
      )
      const croppedFile = new File([croppedImageBlob], "cropped_image.jpg", { type: "image/jpeg" })
      setSelectedFile(croppedFile)
      setIsCropperOpen(false)
    } catch (e) {
      console.error(e)
    }
  }

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      const reader = new FileReader()
      reader.addEventListener('load', () => {
        setImageSrc(reader.result?.toString() || null)
        setIsCropperOpen(true)
      })
      reader.readAsDataURL(file)
    }
  }

  const handleProjectInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setProjectFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }))
  }

  const handleSaveProject = async (e) => {
    e.preventDefault()
    
    let coverUrl = projectFormData.cover
    
    if (selectedFile) {
      const formData = new FormData()
      formData.append('image', selectedFile)
      
      try {
        const uploadRes = await fetch(`${API_URL}/api/upload`, {
          method: 'POST',
          body: formData
        })
        const uploadData = await uploadRes.json()
        if (uploadData.success) {
          coverUrl = uploadData.url
        }
      } catch (err) {
        console.error('Erreur upload:', err)
        alert('Erreur lors du téléchargement de l\'image')
        return
      }
    }

    const technoArray = projectFormData.techno.split(',').map(t => t.trim()).filter(t => t !== '')
    const projectToSave = {
      ...projectFormData,
      cover: coverUrl,
      techno: technoArray,
      id: editingProject ? editingProject.id : projectFormData.nom.toLowerCase().replace(/\s+/g, '-')
    }

    try {
      const url = editingProject 
        ? `${API_URL}/api/projets/${editingProject.id}`
        : `${API_URL}/api/projets`
      
      const method = editingProject ? 'PUT' : 'POST'

      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectToSave)
      })

      fetchData()
      handleCloseProjectForm()
    } catch (err) {
      console.error(err)
    }
  }

  const handleMoveProject = async (id, direction) => {
    const index = projets.findIndex(p => p.id === id)
    if (index === -1) return

    const newList = [...projets]
    const targetIndex = direction === 'up' ? index - 1 : index + 1

    if (targetIndex < 0 || targetIndex >= newList.length) return

    const temp = newList[index]
    newList[index] = newList[targetIndex]
    newList[targetIndex] = temp

    setProjets(newList)

    const itemsToUpdate = newList.map((item, idx) => ({
      id: item.id,
      order: idx + 1
    }))

    try {
      await fetch(`${API_URL}/api/projets/reorder`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: itemsToUpdate })
      })
      fetchData()
    } catch (err) {
      console.error(err)
    }
  }

  // Handlers Parcours
  const handleOpenParcoursForm = (item = null, type = 'experience') => {
    setParcoursType(type)
    if (item) {
      setEditingParcours(item)
      setParcoursFormData({
        periode: item.periode,
        entreprise: item.entreprise,
        poste: item.poste,
        description: item.description
      })
    } else {
      setEditingParcours(null)
      setParcoursFormData({
        periode: '',
        entreprise: '',
        poste: '',
        description: ''
      })
    }
    setIsParcoursFormOpen(true)
  }

  const handleCloseParcoursForm = () => {
    setIsParcoursFormOpen(false)
    setEditingParcours(null)
  }

  const handleParcoursInputChange = (e) => {
    const { name, value } = e.target
    setParcoursFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSaveParcours = async (e) => {
    e.preventDefault()
    const parcoursToSave = {
      ...parcoursFormData,
      type: parcoursType
    }

    try {
      const url = editingParcours 
        ? `${API_URL}/api/parcours/${editingParcours._id}`
        : `${API_URL}/api/parcours`
      
      const method = editingParcours ? 'PUT' : 'POST'

      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parcoursToSave)
      })

      fetchData()
      handleCloseParcoursForm()
    } catch (err) {
      console.error(err)
    }
  }

  const handleDeleteParcours = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet élément ?')) {
      try {
        await fetch(`${API_URL}/api/parcours/${id}`, { method: 'DELETE' })
        fetchData()
      } catch (err) {
        console.error(err)
      }
    }
  }

  const handleMoveParcours = async (id, type, direction) => {
    const list = type === 'experience' ? experiences : formations
    const index = list.findIndex(p => p._id === id)
    if (index === -1) return

    const newList = [...list]
    const targetIndex = direction === 'up' ? index - 1 : index + 1

    if (targetIndex < 0 || targetIndex >= newList.length) return

    const temp = newList[index]
    newList[index] = newList[targetIndex]
    newList[targetIndex] = temp

    const itemsToUpdate = newList.map((item, idx) => ({
      id: item._id,
      order: idx + 1
    }))

    try {
      await fetch(`${API_URL}/api/parcours/reorder`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: itemsToUpdate })
      })
      fetchData()
    } catch (err) {
      console.error(err)
    }
  }

  const filteredProjets = projets.filter(p => {
    if (!projectSearch) return true
    const q = projectSearch.toLowerCase()
    return (
      (p.nom && p.nom.toLowerCase().includes(q)) ||
      (p.type && p.type.toLowerCase().includes(q)) ||
      (p.categorie && p.categorie.toLowerCase().includes(q)) ||
      (p.pays && p.pays.toLowerCase().includes(q))
    )
  })

  return (
    <div className="admin-page">
      
      {/* ===== 1. HERO / HEADER ADMIN ===== */}
      <section className="admin-hero">
        <div className="container">
          <div className="admin-hero__wrapper">
            <div className="admin-hero__content">
              <span className="admin-hero__badge">
                <Sparkles size={13} aria-hidden="true" />
                ESPACE ADMINISTRATION
              </span>
              <h1 className="admin-hero__title">Tableau de bord</h1>
              <p className="admin-hero__desc">
                Gérez vos réalisations, votre parcours et analysez la fréquentation du portfolio.
              </p>
            </div>

            <div className="admin-hero__actions">
              <div className="admin-hero__stats-pill">
                <span className="stat-item"><strong>{projets.length}</strong> projets</span>
                <span className="stat-sep">·</span>
                <span className="stat-item"><strong>{experiences.length}</strong> expériences</span>
              </div>
              <button 
                onClick={handleLogout} 
                className="btn-admin-logout"
                title="Se déconnecter de l'administration"
              >
                <LogOut size={15} />
                <span>Déconnexion</span>
              </button>
            </div>
          </div>

          {/* Onglets de navigation principaux */}
          <div className="admin-tabs-nav">
            <button 
              className={`admin-tab-btn ${activeTab === 'projets' ? 'admin-tab-btn--active' : ''}`}
              onClick={() => setActiveTab('projets')}
            >
              <FolderKanban size={16} />
              <span>Projets</span>
              <span className="tab-count">{projets.length}</span>
            </button>
            <button 
              className={`admin-tab-btn ${activeTab === 'parcours' ? 'admin-tab-btn--active' : ''}`}
              onClick={() => setActiveTab('parcours')}
            >
              <Briefcase size={16} />
              <span>Parcours & Formations</span>
              <span className="tab-count">{experiences.length + formations.length}</span>
            </button>
            <button 
              className={`admin-tab-btn ${activeTab === 'stats' ? 'admin-tab-btn--active' : ''}`}
              onClick={() => setActiveTab('stats')}
            >
              <BarChart3 size={16} />
              <span>Statistiques</span>
            </button>
          </div>
        </div>
      </section>

      <div className="container admin-container">

        {/* ============================================================
            ONGLET 1 : STATISTIQUES
            ============================================================ */}
        {activeTab === 'stats' && (
          <div className="admin-card-panel animate-fade-up">
            <div className="admin-panel__header">
              <div>
                <h2>Statistiques de Visites</h2>
                <p className="admin-panel__sub">Analyse du trafic et interactions sur vos projets.</p>
              </div>
            </div>
            <StatsWidget />
          </div>
        )}

        {/* ============================================================
            ONGLET 2 : PROJETS (LISTE)
            ============================================================ */}
        {activeTab === 'projets' && !isProjectFormOpen && (
          <div className="admin-card-panel animate-fade-up">
            <div className="admin-panel__header">
              <div>
                <h2>Gestion des Projets</h2>
                <p className="admin-panel__sub">Ajoutez, modifiez, réorganisez ou supprimez vos études de cas.</p>
              </div>
              <div className="admin-panel__actions">
                <div className="admin-search-wrap">
                  <Search size={15} className="search-icon" />
                  <input 
                    type="text" 
                    placeholder="Filtrer par nom, pays, catégorie..." 
                    value={projectSearch} 
                    onChange={(e) => setProjectSearch(e.target.value)}
                    className="admin-search-input"
                  />
                  {projectSearch && (
                    <button onClick={() => setProjectSearch('')} className="search-clear-btn">
                      <X size={13} />
                    </button>
                  )}
                </div>
                <button className="btn btn-primary" onClick={() => handleOpenProjectForm()}>
                  <Plus size={16} />
                  <span>Nouveau projet</span>
                </button>
              </div>
            </div>

            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th style={{ width: '45%' }}>Projet</th>
                    <th style={{ width: '15%' }}>Catégorie</th>
                    <th style={{ width: '15%' }}>Pays</th>
                    <th style={{ width: '25%', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProjets.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="admin-empty-row">
                        Aucun projet ne correspond à votre recherche.
                      </td>
                    </tr>
                  ) : (
                    filteredProjets.map((projet, index) => (
                      <tr key={projet.id} className="admin-table-row">
                        <td>
                          <div className="admin-project-cell">
                            <div className="admin-project-thumb">
                              {projet.cover ? (
                                <img src={projet.cover} alt={projet.nom} />
                              ) : (
                                <ImageIcon size={18} />
                              )}
                            </div>
                            <div className="admin-project-info">
                              <div className="admin-project-name-wrap">
                                <span className="admin-project-name">{projet.nom}</span>
                                {projet.showInHome && (
                                  <span className="admin-badge-home" title="Mis en avant sur la Home Page">
                                    <Sparkles size={11} /> Accueil
                                  </span>
                                )}
                              </div>
                              <span className="admin-project-type">{projet.type}</span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className={`admin-category-pill admin-category-pill--${projet.categorie || 'web'}`}>
                            {projet.categorie}
                          </span>
                        </td>
                        <td>
                          <span className="admin-country-cell">{projet.pays || '—'}</span>
                        </td>
                        <td>
                          <div className="admin-actions-cell">
                            <button 
                              className="admin-action-btn" 
                              title="Monter d'une position" 
                              onClick={() => handleMoveProject(projet.id, 'up')}
                              disabled={index === 0}
                            >
                              <ArrowUp size={14} />
                            </button>
                            <button 
                              className="admin-action-btn" 
                              title="Descendre d'une position" 
                              onClick={() => handleMoveProject(projet.id, 'down')}
                              disabled={index === projets.length - 1}
                            >
                              <ArrowDown size={14} />
                            </button>
                            <button 
                              className="admin-action-btn admin-action-btn--edit" 
                              title="Modifier ce projet" 
                              onClick={() => handleOpenProjectForm(projet)}
                            >
                              <Pencil size={14} />
                            </button>
                            <button 
                              className="admin-action-btn admin-action-btn--delete" 
                              title="Supprimer ce projet"
                              onClick={() => handleDeleteProject(projet.id)}
                            >
                              <Trash2 size={14} />
                            </button>
                            {projet.live && (
                              <a 
                                href={projet.live} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="admin-action-btn admin-action-btn--link" 
                                title="Voir le site en direct"
                              >
                                <ExternalLink size={14} />
                              </a>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ============================================================
            FORMULAIRE PROJET (AJOUT / MODIFICATION)
            ============================================================ */}
        {activeTab === 'projets' && isProjectFormOpen && (
          <div className="admin-card-panel animate-fade-up">
            <div className="admin-panel__header">
              <div>
                <h2>{editingProject ? 'Modifier le projet' : 'Ajouter un nouveau projet'}</h2>
                <p className="admin-panel__sub">Remplissez les informations de l'étude de cas.</p>
              </div>
              <button className="btn btn-secondary" onClick={handleCloseProjectForm}>
                <X size={15} />
                <span>Fermer</span>
              </button>
            </div>

            <form className="admin-form" onSubmit={handleSaveProject}>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Nom du projet <span className="req">*</span></label>
                  <input 
                    type="text" 
                    name="nom" 
                    className="form-input" 
                    placeholder="Ex: CETUD — Transport"
                    value={projectFormData.nom} 
                    onChange={handleProjectInputChange} 
                    required 
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Type de projet <span className="req">*</span></label>
                  <input 
                    type="text" 
                    name="type" 
                    className="form-input" 
                    placeholder="Ex: Web App · Dashboard multi-rôles" 
                    value={projectFormData.type} 
                    onChange={handleProjectInputChange} 
                    required 
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Catégorie <span className="req">*</span></label>
                  <select 
                    name="categorie" 
                    className="form-input" 
                    value={projectFormData.categorie} 
                    onChange={handleProjectInputChange} 
                    required
                  >
                    <option value="dashboard">Dashboard / Métier</option>
                    <option value="web">Web & Digital</option>
                    <option value="mobile">Application Mobile</option>
                    <option value="dev">Front-end & Intégration</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Pays</label>
                  <input 
                    type="text" 
                    name="pays" 
                    className="form-input" 
                    placeholder="Ex: Sénégal, France, Pays-Bas" 
                    value={projectFormData.pays} 
                    onChange={handleProjectInputChange} 
                  />
                </div>

                {/* Nombre d'écrans */}
                {projectFormData.categorie !== 'dev' && (
                  <div className="form-group">
                    <label className="form-label">Nombre d'écrans</label>
                    <input 
                      type="text" 
                      name="ecrans" 
                      className="form-input" 
                      placeholder="Ex: 19, +50" 
                      value={projectFormData.ecrans} 
                      onChange={handleProjectInputChange} 
                    />
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label">Technologies (séparées par des virgules)</label>
                  <input 
                    type="text" 
                    name="techno" 
                    className="form-input" 
                    placeholder="Ex: Figma, Angular, Design System, Responsive" 
                    value={projectFormData.techno} 
                    onChange={handleProjectInputChange} 
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Rôle <span className="req">*</span></label>
                  <input 
                    type="text" 
                    name="role" 
                    className="form-input" 
                    placeholder="Ex: Lead UX/UI Designer & Front-end" 
                    value={projectFormData.role} 
                    onChange={handleProjectInputChange} 
                    required 
                  />
                </div>

                {/* Lien Live */}
                <div className="form-group">
                  <label className="form-label">
                    Lien du site {projectFormData.categorie === 'dev' && <span className="req">*</span>}
                  </label>
                  <input
                    type="url"
                    name="live"
                    className="form-input"
                    placeholder="https://exemple.com"
                    value={projectFormData.live}
                    onChange={handleProjectInputChange}
                    required={projectFormData.categorie === 'dev'}
                  />
                </div>

                {/* URL du Design */}
                {projectFormData.categorie === 'dev' && (
                  <div className="form-group">
                    <label className="form-label">URL du Design (Figma - optionnel)</label>
                    <input
                      type="url"
                      name="designUrl"
                      className="form-input"
                      placeholder="https://figma.com/design/..."
                      value={projectFormData.designUrl || ''}
                      onChange={handleProjectInputChange}
                    />
                  </div>
                )}

                {/* Figma Embed */}
                {projectFormData.categorie !== 'dev' && (
                  <div className="form-group">
                    <label className="form-label">Lien Figma Embed (Prototype)</label>
                    <input 
                      type="url" 
                      name="figma" 
                      className="form-input" 
                      placeholder="https://www.figma.com/embed?..." 
                      value={projectFormData.figma} 
                      onChange={handleProjectInputChange} 
                    />
                  </div>
                )}
              </div>

              {/* Upload Image Cover */}
              <div className="form-group form-group--cover">
                <label className="form-label">Image Cover (16:10 recommandé)</label>
                <div className="admin-cover-upload-box">
                  <div className="admin-cover-preview">
                    {selectedFile ? (
                      <div className="cover-tag cover-tag--new">
                        <CheckCircle2 size={14} /> Nouvelle image prête ({selectedFile.name})
                      </div>
                    ) : projectFormData.cover ? (
                      <img src={projectFormData.cover} alt="Cover actuelle" className="cover-thumb" />
                    ) : (
                      <span className="no-cover">Aucune image</span>
                    )}
                  </div>
                  
                  <div className="admin-cover-controls">
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleFileChange} 
                      id="cover-file-input"
                      className="file-input-hidden"
                    />
                    <label htmlFor="cover-file-input" className="btn btn-secondary btn-sm">
                      <ImageIcon size={14} />
                      Choisir une image & recadrer
                    </label>
                  </div>
                </div>
              </div>

              {/* Toggle Home Page */}
              <div className="form-toggle-wrap">
                <label className="toggle-switch">
                  <input 
                    type="checkbox" 
                    name="showInHome" 
                    id="showInHome"
                    checked={projectFormData.showInHome} 
                    onChange={handleProjectInputChange} 
                  />
                  <span className="toggle-slider"></span>
                </label>
                <label htmlFor="showInHome" className="toggle-label">
                  <strong>Mettre en avant sur la page d'accueil (Home Page)</strong>
                  <span>Ce projet sera affiché dans la section "Projets Sélectionnés" de la page d'accueil.</span>
                </label>
              </div>

              <div className="form-group">
                <label className="form-label">Description courte</label>
                <textarea 
                  name="description" 
                  className="form-textarea" 
                  rows={3}
                  placeholder="Résumé du projet et de la valeur apportée..."
                  value={projectFormData.description} 
                  onChange={handleProjectInputChange} 
                />
              </div>

              <div className="form-group">
                <label className="form-label">Contexte du projet</label>
                <textarea 
                  name="contexte" 
                  className="form-textarea" 
                  rows={3}
                  placeholder="Objectifs métier, utilisateurs cibles et défis à relever..."
                  value={projectFormData.contexte} 
                  onChange={handleProjectInputChange} 
                />
              </div>

              <div className="form-actions-bar">
                <button type="button" className="btn btn-secondary" onClick={handleCloseProjectForm}>
                  Annuler
                </button>
                <button type="submit" className="btn btn-primary">
                  <Save size={16} />
                  <span>Enregistrer le projet</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ============================================================
            ONGLET 3 : PARCOURS & FORMATIONS (LISTE)
            ============================================================ */}
        {activeTab === 'parcours' && !isParcoursFormOpen && (
          <div className="admin-parcours-stack animate-fade-up">
            
            {/* 1. Expériences */}
            <div className="admin-card-panel">
              <div className="admin-panel__header">
                <div>
                  <h2>Expériences Professionnelles</h2>
                  <p className="admin-panel__sub">Vos rôles en entreprise, missions freelance et collaborations.</p>
                </div>
                <button className="btn btn-primary" onClick={() => handleOpenParcoursForm(null, 'experience')}>
                  <Plus size={16} />
                  <span>Ajouter une expérience</span>
                </button>
              </div>
              
              <div className="admin-table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th style={{ width: '20%' }}>Période</th>
                      <th style={{ width: '25%' }}>Entreprise</th>
                      <th style={{ width: '35%' }}>Poste & Description</th>
                      <th style={{ width: '20%', textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {experiences.map((item, index) => (
                      <tr key={item._id} className="admin-table-row">
                        <td>
                          <span className="admin-period-badge">{item.periode}</span>
                        </td>
                        <td>
                          <strong className="admin-company-name">{item.entreprise}</strong>
                        </td>
                        <td>
                          <div className="admin-role-info">
                            <span className="admin-role-title">{item.poste}</span>
                            <p className="admin-role-desc">{item.description}</p>
                          </div>
                        </td>
                        <td>
                          <div className="admin-actions-cell">
                            <button 
                              className="admin-action-btn" 
                              title="Monter" 
                              onClick={() => handleMoveParcours(item._id, 'experience', 'up')}
                              disabled={index === 0}
                            >
                              <ArrowUp size={14} />
                            </button>
                            <button 
                              className="admin-action-btn" 
                              title="Descendre" 
                              onClick={() => handleMoveParcours(item._id, 'experience', 'down')}
                              disabled={index === experiences.length - 1}
                            >
                              <ArrowDown size={14} />
                            </button>
                            <button 
                              className="admin-action-btn admin-action-btn--edit" 
                              title="Modifier" 
                              onClick={() => handleOpenParcoursForm(item, 'experience')}
                            >
                              <Pencil size={14} />
                            </button>
                            <button 
                              className="admin-action-btn admin-action-btn--delete" 
                              title="Supprimer" 
                              onClick={() => handleDeleteParcours(item._id)}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 2. Formations */}
            <div className="admin-card-panel" style={{ marginTop: '32px' }}>
              <div className="admin-panel__header">
                <div>
                  <h2>Formations & Diplômes</h2>
                  <p className="admin-panel__sub">Certifications et parcours académique.</p>
                </div>
                <button className="btn btn-primary" onClick={() => handleOpenParcoursForm(null, 'formation')}>
                  <Plus size={16} />
                  <span>Ajouter une formation</span>
                </button>
              </div>
              
              <div className="admin-table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th style={{ width: '20%' }}>Période</th>
                      <th style={{ width: '25%' }}>Établissement</th>
                      <th style={{ width: '35%' }}>Diplôme / Titre</th>
                      <th style={{ width: '20%', textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formations.map((item, index) => (
                      <tr key={item._id} className="admin-table-row">
                        <td>
                          <span className="admin-period-badge">{item.periode}</span>
                        </td>
                        <td>
                          <strong className="admin-company-name">{item.entreprise}</strong>
                        </td>
                        <td>
                          <div className="admin-role-info">
                            <span className="admin-role-title">{item.poste}</span>
                            <p className="admin-role-desc">{item.description}</p>
                          </div>
                        </td>
                        <td>
                          <div className="admin-actions-cell">
                            <button 
                              className="admin-action-btn" 
                              title="Monter" 
                              onClick={() => handleMoveParcours(item._id, 'formation', 'up')}
                              disabled={index === 0}
                            >
                              <ArrowUp size={14} />
                            </button>
                            <button 
                              className="admin-action-btn" 
                              title="Descendre" 
                              onClick={() => handleMoveParcours(item._id, 'formation', 'down')}
                              disabled={index === formations.length - 1}
                            >
                              <ArrowDown size={14} />
                            </button>
                            <button 
                              className="admin-action-btn admin-action-btn--edit" 
                              title="Modifier" 
                              onClick={() => handleOpenParcoursForm(item, 'formation')}
                            >
                              <Pencil size={14} />
                            </button>
                            <button 
                              className="admin-action-btn admin-action-btn--delete" 
                              title="Supprimer" 
                              onClick={() => handleDeleteParcours(item._id)}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ============================================================
            FORMULAIRE PARCOURS (AJOUT / MODIFICATION)
            ============================================================ */}
        {activeTab === 'parcours' && isParcoursFormOpen && (
          <div className="admin-card-panel animate-fade-up">
            <div className="admin-panel__header">
              <div>
                <h2>{editingParcours ? 'Modifier' : 'Ajouter'} {parcoursType === 'experience' ? 'une expérience' : 'une formation'}</h2>
                <p className="admin-panel__sub">Renseignez les détails du parcours.</p>
              </div>
              <button className="btn btn-secondary" onClick={handleCloseParcoursForm}>
                <X size={15} />
                <span>Fermer</span>
              </button>
            </div>

            <form className="admin-form" onSubmit={handleSaveParcours}>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Période <span className="req">*</span></label>
                  <input 
                    type="text" 
                    name="periode" 
                    className="form-input" 
                    placeholder="Ex: 2024 – PRÉSENT" 
                    value={parcoursFormData.periode} 
                    onChange={handleParcoursInputChange} 
                    required 
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">{parcoursType === 'experience' ? 'Entreprise' : 'Établissement'} <span className="req">*</span></label>
                  <input 
                    type="text" 
                    name="entreprise" 
                    className="form-input" 
                    placeholder={parcoursType === 'experience' ? "Ex: Agile Way International" : "Ex: Université / École"}
                    value={parcoursFormData.entreprise} 
                    onChange={handleParcoursInputChange} 
                    required 
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">{parcoursType === 'experience' ? 'Poste' : 'Diplôme / Titre'} <span className="req">*</span></label>
                  <input 
                    type="text" 
                    name="poste" 
                    className="form-input" 
                    placeholder={parcoursType === 'experience' ? "Ex: Lead UX/UI Designer" : "Ex: Master Informatique & Design"}
                    value={parcoursFormData.poste} 
                    onChange={handleParcoursInputChange} 
                    required 
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Description <span className="req">*</span></label>
                <textarea 
                  name="description" 
                  className="form-textarea" 
                  rows={4}
                  placeholder="Détaillez les réalisations et responsabilités clés..."
                  value={parcoursFormData.description} 
                  onChange={handleParcoursInputChange} 
                  required 
                />
              </div>

              <div className="form-actions-bar">
                <button type="button" className="btn btn-secondary" onClick={handleCloseParcoursForm}>
                  Annuler
                </button>
                <button type="submit" className="btn btn-primary">
                  <Save size={16} />
                  <span>Enregistrer</span>
                </button>
              </div>
            </form>
          </div>
        )}

      </div>

      {/* ============================================================
          CROPPER MODAL (MODERNE)
          ============================================================ */}
      {isCropperOpen && imageSrc && (
        <div className="admin-cropper-modal-overlay">
          <div className="admin-cropper-modal-card">
            <div className="admin-cropper-modal-header">
              <h3>Recadrer l'image du projet (Ratio 16:9 / 16:10)</h3>
              <button 
                className="admin-cropper-close" 
                onClick={() => {
                  setIsCropperOpen(false)
                  setImageSrc(null)
                }}
              >
                <X size={18} />
              </button>
            </div>
            
            <div className="admin-cropper-canvas-area">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={16 / 10}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
              />
            </div>

            <div className="admin-cropper-modal-footer">
              <button 
                className="btn btn-secondary" 
                onClick={() => {
                  setIsCropperOpen(false)
                  setImageSrc(null)
                }}
              >
                Annuler
              </button>
              <button className="btn btn-primary" onClick={showCroppedImage}>
                <Crop size={16} />
                <span>Valider le recadrage</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
