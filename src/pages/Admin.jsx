import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { projets as staticProjets } from '../data/projets'
import { experiences as staticExperiences, formations as staticFormations } from '../data/parcours'
import { Plus, Pencil, Trash2, ExternalLink, X, Save, ArrowUp, ArrowDown, Crop } from 'lucide-react'
import Cropper from 'react-easy-crop'
import getCroppedImg from '../utils/cropImage'
import API_URL from '../config/api'
import './Admin.css'

export default function Admin() {
  const navigate = useNavigate()
  const [projets, setProjets] = useState([])
  const [experiences, setExperiences] = useState([])
  const [formations, setFormations] = useState([])
  const [activeTab, setActiveTab] = useState('projets')
  
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
    categorie: 'web',
    description: '',
    contexte: '',
    role: '',
    cover: '/portfolio_project_mockup.png'
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
        fetchData() // Recharger les données
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
        techno: project.techno.join(', ')
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
        categorie: 'web',
        description: '',
        contexte: '',
        role: '',
        cover: '/portfolio_project_mockup.png'
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
      // Convert blob to file so our upload logic still works
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
      // Use FileReader to display it in the Cropper
      const reader = new FileReader()
      reader.addEventListener('load', () => {
        setImageSrc(reader.result?.toString() || null)
        setIsCropperOpen(true)
      })
      reader.readAsDataURL(file)
    }
  }

  const handleProjectInputChange = (e) => {
    const { name, value } = e.target
    setProjectFormData(prev => ({ ...prev, [name]: value }))
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

    // Swap
    const temp = newList[index]
    newList[index] = newList[targetIndex]
    newList[targetIndex] = temp

    // Préparer les données
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

  const handleOpenParcoursForm = (item = null, type = 'experience') => {
    setParcoursType(type)
    if (item) {
      setEditingParcours(item)
      setParcoursFormData({ ...item })
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
    const itemToSave = {
      ...parcoursFormData,
      type: parcoursType
    }

    try {
      const url = editingParcours 
        ? `${API_URL}/api/parcours/${editingParcours._id}` // MongoDB utilise _id
        : `${API_URL}/api/parcours`
      
      const method = editingParcours ? 'PUT' : 'POST'

      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(itemToSave)
      })

      fetchData()
      handleCloseParcoursForm()
    } catch (err) {
      console.error(err)
    }
  }

  const handleMoveParcours = async (id, type, direction) => {
    const list = type === 'experience' ? experiences : formations
    const index = list.findIndex(item => item._id === id)
    if (index === -1) return

    const newList = [...list]
    const targetIndex = direction === 'up' ? index - 1 : index + 1

    if (targetIndex < 0 || targetIndex >= newList.length) return

    // Swap
    const temp = newList[index]
    newList[index] = newList[targetIndex]
    newList[targetIndex] = temp

    // Préparer les données pour l'API de réordonnancement
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

  return (
    <div className="admin-page">
      <div className="page-header-editorial">
        <span className="section-label">BACK-OFFICE</span>
        <h1 className="page-header-editorial__title">Tableau de bord</h1>
        <div className="page-header-editorial__line" aria-hidden="true" />
        <p className="page-header-editorial__subtitle">
          GÉREZ VOS RÉALISATIONS ET VOTRE PARCOURS.
        </p>
      </div>

      <div className="container">
        <div className="admin-nav">
          <button 
            className={`admin-nav__btn ${activeTab === 'projets' ? 'active' : ''}`}
            onClick={() => setActiveTab('projets')}
          >
            Projets
          </button>
          <button 
            className={`admin-nav__btn ${activeTab === 'parcours' ? 'active' : ''}`}
            onClick={() => setActiveTab('parcours')}
          >
            Parcours
          </button>
        </div>

        {/* ONGLET PROJETS */}
        {activeTab === 'projets' && !isProjectFormOpen && (
          <div className="admin-content animate-fade-up">
            <div className="admin-content__header">
              <h2>Gestion des Projets</h2>
              <button className="btn btn-primary" onClick={() => handleOpenProjectForm()}>
                <Plus size={16} />
                Ajouter un projet
              </button>
            </div>

            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Projet</th>
                    <th>Catégorie</th>
                    <th>Pays</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {projets.map((projet, index) => (
                    <tr key={projet.id}>
                      <td>
                        <div className="admin-table__projet-name">
                          <strong>{projet.nom}</strong>
                          <span>{projet.type}</span>
                        </div>
                      </td>
                      <td><span className="tag">{projet.categorie}</span></td>
                      <td>{projet.pays}</td>
                      <td>
                        <div className="admin-table__actions">
                          <button 
                            className="action-btn" 
                            title="Monter" 
                            onClick={() => handleMoveProject(projet.id, 'up')}
                            disabled={index === 0}
                            style={{ opacity: index === 0 ? 0.3 : 1, cursor: index === 0 ? 'not-allowed' : 'pointer' }}
                          >
                            <ArrowUp size={16} />
                          </button>
                          <button 
                            className="action-btn" 
                            title="Descendre" 
                            onClick={() => handleMoveProject(projet.id, 'down')}
                            disabled={index === projets.length - 1}
                            style={{ opacity: index === projets.length - 1 ? 0.3 : 1, cursor: index === projets.length - 1 ? 'not-allowed' : 'pointer' }}
                          >
                            <ArrowDown size={16} />
                          </button>
                          <button className="action-btn" title="Modifier" onClick={() => handleOpenProjectForm(projet)}>
                            <Pencil size={16} />
                          </button>
                          <button 
                            className="action-btn action-btn--danger" 
                            title="Supprimer"
                            onClick={() => handleDeleteProject(projet.id)}
                          >
                            <Trash2 size={16} />
                          </button>
                          {projet.live && (
                            <a href={projet.live} target="_blank" rel="noopener noreferrer" className="action-btn" title="Voir le site">
                              <ExternalLink size={16} />
                            </a>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* FORMULAIRE PROJET */}
        {activeTab === 'projets' && isProjectFormOpen && (
          <div className="admin-content animate-fade-up">
            <div className="admin-content__header">
              <h2>{editingProject ? 'Modifier le projet' : 'Ajouter un projet'}</h2>
              <button className="btn btn-outline" onClick={handleCloseProjectForm}>
                <X size={16} />
                Annuler
              </button>
            </div>

            <form className="admin-form" onSubmit={handleSaveProject}>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Nom du projet *</label>
                  <input type="text" name="nom" className="form-input" value={projectFormData.nom} onChange={handleProjectInputChange} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Type de projet *</label>
                  <input type="text" name="type" className="form-input" placeholder="Ex: Site web, App mobile" value={projectFormData.type} onChange={handleProjectInputChange} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Catégorie *</label>
                  <select name="categorie" className="form-input" value={projectFormData.categorie} onChange={handleProjectInputChange} required>
                    <option value="web">Web</option>
                    <option value="mobile">Mobile</option>
                    <option value="dashboard">Dashboard</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Pays</label>
                  <input type="text" name="pays" className="form-input" value={projectFormData.pays} onChange={handleProjectInputChange} />
                </div>
                <div className="form-group">
                  <label className="form-label">Nombre d'écrans</label>
                  <input type="text" name="ecrans" className="form-input" placeholder="Ex: 12, +50" value={projectFormData.ecrans} onChange={handleProjectInputChange} />
                </div>
                <div className="form-group">
                  <label className="form-label">Technologies (séparées par des virgules)</label>
                  <input type="text" name="techno" className="form-input" placeholder="Ex: Figma, React, CSS" value={projectFormData.techno} onChange={handleProjectInputChange} />
                </div>
                <div className="form-group">
                  <label className="form-label">Lien Live</label>
                  <input type="url" name="live" className="form-input" value={projectFormData.live} onChange={handleProjectInputChange} />
                </div>
                <div className="form-group">
                  <label className="form-label">Lien Figma Embed</label>
                  <input type="url" name="figma" className="form-input" placeholder="https://www.figma.com/embed?..." value={projectFormData.figma} onChange={handleProjectInputChange} />
                </div>
                <div className="form-group">
                  <label className="form-label">Rôle *</label>
                  <input type="text" name="role" className="form-input" value={projectFormData.role} onChange={handleProjectInputChange} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Image Cover (Optionnel)</label>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleFileChange} 
                    style={{ marginBottom: '10px' }} 
                  />
                  {projectFormData.cover && !selectedFile && (
                    <div style={{ fontSize: '12px', color: 'var(--color-muted)' }}>
                      Image actuelle : <img src={projectFormData.cover} alt="Cover actuelle" style={{ height: '40px', verticalAlign: 'middle', marginLeft: '10px', borderRadius: '4px' }} />
                    </div>
                  )}
                  {selectedFile && (
                    <div style={{ fontSize: '12px', color: 'var(--color-primary)' }}>
                      Nouvelle image prête à être téléchargée : {selectedFile.name}
                    </div>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Description courte</label>
                <textarea name="description" className="form-textarea" value={projectFormData.description} onChange={handleProjectInputChange} />
              </div>

              <div className="form-group">
                <label className="form-label">Contexte du projet</label>
                <textarea name="contexte" className="form-textarea" value={projectFormData.contexte} onChange={handleProjectInputChange} />
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                  <Save size={16} />
                  Enregistrer le projet
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ONGLET PARCOURS */}
        {activeTab === 'parcours' && !isParcoursFormOpen && (
          <div className="admin-content animate-fade-up">
            {/* Expériences */}
            <div className="admin-content__header">
              <h2>Expériences Professionnelles</h2>
              <button className="btn btn-primary" onClick={() => handleOpenParcoursForm(null, 'experience')}>
                <Plus size={16} />
                Ajouter une expérience
              </button>
            </div>
            
            <div className="admin-table-wrapper" style={{marginBottom: '3rem'}}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Période</th>
                    <th>Entreprise</th>
                    <th>Poste</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {experiences.map((item, index) => (
                    <tr key={item._id}>
                      <td>{item.periode}</td>
                      <td><strong>{item.entreprise}</strong></td>
                      <td>{item.poste}</td>
                      <td>
                        <div className="admin-table__actions">
                          <button 
                            className="action-btn" 
                            title="Monter" 
                            onClick={() => handleMoveParcours(item._id, 'experience', 'up')}
                            disabled={index === 0}
                            style={{ opacity: index === 0 ? 0.3 : 1, cursor: index === 0 ? 'not-allowed' : 'pointer' }}
                          >
                            <ArrowUp size={16} />
                          </button>
                          <button 
                            className="action-btn" 
                            title="Descendre" 
                            onClick={() => handleMoveParcours(item._id, 'experience', 'down')}
                            disabled={index === experiences.length - 1}
                            style={{ opacity: index === experiences.length - 1 ? 0.3 : 1, cursor: index === experiences.length - 1 ? 'not-allowed' : 'pointer' }}
                          >
                            <ArrowDown size={16} />
                          </button>
                          <button className="action-btn" title="Modifier" onClick={() => handleOpenParcoursForm(item, 'experience')}>
                            <Pencil size={16} />
                          </button>
                          <button className="action-btn action-btn--danger" title="Supprimer" onClick={() => handleDeleteParcours(item._id)}>
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Formations */}
            <div className="admin-content__header">
              <h2>Formations</h2>
              <button className="btn btn-primary" onClick={() => handleOpenParcoursForm(null, 'formation')}>
                <Plus size={16} />
                Ajouter une formation
              </button>
            </div>
            
            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Période</th>
                    <th>Établissement</th>
                    <th>Diplôme/Titre</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {formations.map((item, index) => (
                    <tr key={item._id}>
                      <td>{item.periode}</td>
                      <td><strong>{item.entreprise}</strong></td>
                      <td>{item.poste}</td>
                      <td>
                        <div className="admin-table__actions">
                          <button 
                            className="action-btn" 
                            title="Monter" 
                            onClick={() => handleMoveParcours(item._id, 'formation', 'up')}
                            disabled={index === 0}
                            style={{ opacity: index === 0 ? 0.3 : 1, cursor: index === 0 ? 'not-allowed' : 'pointer' }}
                          >
                            <ArrowUp size={16} />
                          </button>
                          <button 
                            className="action-btn" 
                            title="Descendre" 
                            onClick={() => handleMoveParcours(item._id, 'formation', 'down')}
                            disabled={index === formations.length - 1}
                            style={{ opacity: index === formations.length - 1 ? 0.3 : 1, cursor: index === formations.length - 1 ? 'not-allowed' : 'pointer' }}
                          >
                            <ArrowDown size={16} />
                          </button>
                          <button className="action-btn" title="Modifier" onClick={() => handleOpenParcoursForm(item, 'formation')}>
                            <Pencil size={16} />
                          </button>
                          <button className="action-btn action-btn--danger" title="Supprimer" onClick={() => handleDeleteParcours(item._id)}>
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* FORMULAIRE PARCOURS */}
        {activeTab === 'parcours' && isParcoursFormOpen && (
          <div className="admin-content animate-fade-up">
            <div className="admin-content__header">
              <h2>{editingParcours ? 'Modifier' : 'Ajouter'} {parcoursType === 'experience' ? 'une expérience' : 'une formation'}</h2>
              <button className="btn btn-outline" onClick={handleCloseParcoursForm}>
                <X size={16} />
                Annuler
              </button>
            </div>

            <form className="admin-form" onSubmit={handleSaveParcours}>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Période *</label>
                  <input type="text" name="periode" className="form-input" placeholder="Ex: 2024 – PRÉSENT" value={parcoursFormData.periode} onChange={handleParcoursInputChange} required />
                </div>
                <div className="form-group">
                  <label className="form-label">{parcoursType === 'experience' ? 'Entreprise' : 'Établissement'} *</label>
                  <input type="text" name="entreprise" className="form-input" value={parcoursFormData.entreprise} onChange={handleParcoursInputChange} required />
                </div>
                <div className="form-group">
                  <label className="form-label">{parcoursType === 'experience' ? 'Poste' : 'Diplôme/Titre'} *</label>
                  <input type="text" name="poste" className="form-input" value={parcoursFormData.poste} onChange={handleParcoursInputChange} required />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Description *</label>
                <textarea name="description" className="form-textarea" value={parcoursFormData.description} onChange={handleParcoursInputChange} required />
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                  <Save size={16} />
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* CROPPER MODAL */}
      {isCropperOpen && imageSrc && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 9999,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center'
        }}>
          <div style={{ position: 'relative', width: '90%', height: '70%', background: '#333' }}>
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={16 / 9}
              onCropChange={setCrop}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
            />
          </div>
          <div style={{ marginTop: '20px', display: 'flex', gap: '15px' }}>
            <button className="btn btn-outline" onClick={() => {
              setIsCropperOpen(false)
              setImageSrc(null)
            }}>Annuler</button>
            <button className="btn btn-primary" onClick={showCroppedImage}>
              <Crop size={16} /> Recadrer l'image
            </button>
          </div>
        </div>
      )}

    </div>
  )
}
