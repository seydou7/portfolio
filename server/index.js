const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const cloudinary = require('cloudinary').v2;
require('dotenv').config({ path: path.join(__dirname, '../.env') });

// Configuration Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();
const PORT = process.env.PORT || 5000;
const isProd = process.env.NODE_ENV === 'production';

// CORS — autoriser le frontend (configurable via env)
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['http://localhost:5173', 'http://localhost:4173'];

app.use(cors({
  origin: function (origin, callback) {
    // Autoriser les requêtes sans origin (ex: Postman, mobile)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json());

// Serve static uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// En production : servir le build React
if (isProd) {
  app.use(express.static(path.join(__dirname, '../dist')));
}

// Configuration Multer — stockage en mémoire pour Cloudinary
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Connexion MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('Connecté à MongoDB Atlas');
    // NE PAS DÉCOMMENTER LA LIGNE CI-DESSOUS EN PRODUCTION OU EN DÉVELOPPEMENT COURANT
    // Sinon, la base de données sera écrasée à chaque redémarrage du serveur !
    // await seedDatabase();
  })
  .catch(err => console.error('Erreur de connexion MongoDB:', err));

// --- SCHEMAS ---
const projetSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  nom: String,
  type: String,
  ecrans: String,
  pays: String,
  techno: [String],
  live: String,
  figma: String,
  categorie: String,
  description: String,
  contexte: String,
  role: String,
  cover: String,
  order: Number
});

const Projet = mongoose.model('Projet', projetSchema);

const parcoursSchema = new mongoose.Schema({
  periode: String,
  entreprise: String,
  poste: String,
  description: String,
  type: { type: String, enum: ['experience', 'formation'] },
  order: Number
});

const Parcours = mongoose.model('Parcours', parcoursSchema);

// --- SEED FUNCTION ---
async function seedDatabase() {
  // On vide la base pour être sûr d'avoir toutes les données à jour
  console.log('Vidage de la base de données pour migration...');
  await Projet.deleteMany({});
  await Parcours.deleteMany({});

  console.log('Insertion de tous les projets...');
  const allProjets = [
    {
      id: 'coraf',
      nom: 'CORAF',
      type: 'Site institutionnel + Dashboard admin',
      ecrans: '30 (v2) + 19 (v1)',
      pays: 'Sénégal',
      techno: ['Laravel', 'Bootstrap', 'JS'],
      live: 'https://www.coraf.org/',
      figma: 'https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Fproto%2FAcVrATo6y8inF9ht2SFvyo%2FCoraf--website%3Fpage-id%3D22%3A10%26type%3Ddesign%26node-id%3D781-3146%26viewport%3D3247%2C-851%2C0.16%26t%3DihDOgrYXELDOGPgh-1%26scaling%3Dmin-zoom%26starting-point-node-id%3D781%3A3146',
      categorie: 'web',
      description: 'Refonte complète du site institutionnel CORAF et de son dashboard administratif responsive.',
      contexte: 'Le CORAF avait besoin de moderniser sa présence en ligne et de simplifier la gestion de ses publications scientifiques et actualités via un tableau de bord intuitif.',
      role: 'Lead UX/UI Designer & Intégrateur Front-end',
      cover: '/portfolio_project_mockup.png'
    },
    {
      id: 'cetud',
      nom: 'CETUD',
      type: 'Web App — Dashboard multi-rôles',
      ecrans: '19',
      pays: 'Sénégal',
      techno: ['Angular', 'Figma'],
      categorie: 'dashboard',
      description: 'Application web avec dashboard multi-rôles (Responsable, Agent, Comité) pour la gestion des transports.',
      contexte: 'Optimisation des processus de validation et de suivi pour les agents de transport et le comité de direction.',
      role: 'Product Designer',
      cover: '/portfolio_project_mockup.png'
    },
    {
      id: 'livelearn',
      nom: 'LiveLearn',
      type: 'Application mobile e-learning',
      ecrans: '+50',
      pays: 'Pays-Bas',
      techno: ['Angular', 'Figma'],
      live: 'https://livelearn.nl/',
      categorie: 'mobile',
      description: 'Plateforme e-learning complète : cours, blog, podcast — conçue pour le marché néerlandais.',
      contexte: 'Création from scratch d\'une plateforme éducative à destination d\'un large public néerlandophone.',
      role: 'Lead UX/UI Designer',
      cover: '/portfolio_project_mockup.png'
    },
    {
      id: 'gestion-immo',
      nom: 'Gestion Immobilière',
      type: 'Site web + Dashboards',
      ecrans: '+40',
      pays: 'Sénégal',
      techno: ['Figma', 'Angular'],
      figma: 'https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Fproto%2FNzA9HMhF8YeVPoDukqIOEO%2FGestion-Immo-kellel',
      categorie: 'dashboard',
      description: 'Solution complète de gestion immobilière avec dashboards agent, administrateur et utilisateur.',
      contexte: 'Besoin d\'un outil centralisé pour la gestion des biens, des locations et des transactions immobilières.',
      role: 'UX/UI Designer & Développeur Front-end',
      cover: '/portfolio_project_mockup.png'
    },
    {
      id: 'ovindi',
      nom: 'Ovindi',
      type: 'Landing page + E-commerce',
      ecrans: '12',
      pays: 'USA',
      techno: ['Figma'],
      figma: 'https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Fproto%2FF1kpBccOTTyaDuNYOnhwQq%2Fovindi-design',
      categorie: 'web',
      description: 'Plateforme e-commerce agroalimentaire avec landing page et boutique en ligne.',
      contexte: 'Lancement d\'une nouvelle marque agroalimentaire visant le marché américain.',
      role: 'Product Designer',
      cover: '/portfolio_project_mockup.png'
    },
    {
      id: 'tonideme',
      nom: 'Tonidéme',
      type: 'Application mobile fintech',
      ecrans: '+50',
      pays: 'Mali',
      techno: ['Figma'],
      figma: 'https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Fproto%2FvDx4PbgYRzZNP5ydbCmJrJ%2FTonid%25C3%25A9me',
      categorie: 'mobile',
      description: 'Application fintech couvrant Cotisation, Tontine et Démé — finance participative africaine.',
      contexte: 'Digitalisation des pratiques traditionnelles de tontine et de solidarité financière.',
      role: 'Lead UX/UI Designer',
      cover: '/portfolio_project_mockup.png'
    },
    {
      id: 'tonideme-web',
      nom: 'Tonidéme Web',
      type: 'Version web plateforme fintech',
      ecrans: '6',
      pays: 'Mali',
      techno: ['Figma'],
      figma: 'https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Fproto%2FWJwY3rnK0sQoH48zvuBow0%2FTonid%25C3%25A9me-projet',
      categorie: 'web',
      description: 'Déclinaison web de la plateforme fintech Tonidéme.',
      contexte: 'Accessibilité web pour les utilisateurs préférant gérer leurs finances depuis un ordinateur.',
      role: 'UX/UI Designer',
      cover: '/portfolio_project_mockup.png'
    },
    {
      id: 'pfane',
      nom: 'PFANE',
      type: 'Site institutionnel',
      ecrans: '13',
      pays: 'Sénégal',
      techno: ['Figma'],
      figma: 'https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Fproto%2FAgZRfbDufmch0k3h63WnbV%2FPlateforme-des-Acteurs-Non-Etatiques',
      categorie: 'web',
      description: 'Plateforme officielle des acteurs non étatiques — site institutionnel.',
      contexte: 'Création d\'un espace de visibilité et d\'information pour les acteurs non étatiques au Sénégal.',
      role: 'Web Designer',
      cover: '/portfolio_project_mockup.png'
    },
    {
      id: 'wutiko',
      nom: 'Wutiko',
      type: 'Site + Dashboard professionnel',
      ecrans: '32 + 33',
      pays: 'Sénégal',
      techno: ['Figma', 'Angular'],
      figma: 'https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Fproto%2F6azQQInQaEnUTHCKzKwfcI%2Fwutiko-(dashboard)',
      categorie: 'dashboard',
      description: 'Plateforme d\'opportunités professionnelles avec site public et dashboard complet.',
      contexte: 'Refonte de l\'interface pour faciliter la mise en relation entre recruteurs et candidats.',
      role: 'UX/UI Designer',
      cover: '/portfolio_project_mockup.png'
    },
    {
      id: 'scinbcorp',
      nom: 'Scinbcorp',
      type: 'Site corporate IT',
      ecrans: '7',
      pays: 'France',
      techno: ['Figma'],
      figma: 'https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Fproto%2FE24YpKD327bko1qTDFPylu%2Fscinbcorp-France',
      categorie: 'web',
      description: 'Site corporate pour une entreprise IT française.',
      contexte: 'Conception d\'une vitrine digitale moderne pour présenter les services informatiques B2B.',
      role: 'UI Designer',
      cover: '/portfolio_project_mockup.png'
    },
    {
      id: 'ef2tk-renov',
      nom: 'ef2tk-renov',
      type: 'Site design intérieur & rénovation',
      ecrans: '10',
      pays: 'France',
      techno: ['Figma'],
      figma: 'https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Fproto%2FTgW7FVNg8DQQWQB85WP1wl%2Fef2tk-renov',
      categorie: 'web',
      description: 'Site vitrine pour une entreprise de design d\'intérieur et rénovation.',
      contexte: 'Mise en valeur du savoir-faire artisanal et des réalisations architecturales.',
      role: 'Digital Designer',
      cover: '/portfolio_project_mockup.png'
    },
    {
      id: 'looka',
      nom: 'Looka',
      type: 'Web App market research',
      ecrans: '—',
      pays: 'Afrique',
      techno: ['Angular', 'Figma'],
      live: 'https://getlooka.com/',
      categorie: 'dashboard',
      description: 'Application web de market research responsive — YUX Design.',
      contexte: 'Développement d\'un outil SaaS pour la collecte et l\'analyse de données marché en Afrique.',
      role: 'UX/UI Designer & Front-end Developer',
      cover: '/portfolio_project_mockup.png'
    }
  ].map((p, index) => ({ ...p, order: index + 1 }));
  await Projet.insertMany(allProjets);
  console.log('Tous les projets insérés !');

  console.log('Insertion de tout le parcours...');
  const allExperiences = [
    { periode: 'CONSULTANT', entreprise: 'Agile Way International', poste: 'UX/UI DESIGNER & INTÉGRATEUR FRONT-END · PAYS-BAS', description: 'Conception et validation de maquettes UX/UI (wireframes, prototypes Figma), intégration front-end Angular et étroite collaboration en méthode Agile.', type: 'experience', order: 1 },
    { periode: '2021 – FÉV. 2025', entreprise: 'Livelearn', poste: 'LEAD UX/UI DESIGNER & FRONT-END · PAYS-BAS', description: "Conception UX/UI complète pour des plateformes e-learning à fort trafic. Développement d'une marketplace de freelancers, de la recherche utilisateur à la livraison front-end. Création et maintien d'un Design System Figma.", type: 'experience', order: 2 },
    { periode: 'AVR. 2023 – AVR. 2024', entreprise: 'CORAF', poste: 'UX/UI DESIGNER & FRONT-END · SÉNÉGAL', description: "Refonte totale du site institutionnel et des plateformes affiliées : audit, wireframing, prototypage et tests. Mise en place d'un Design System global et développement front-end sur base Laravel.", type: 'experience', order: 3 },
    { periode: '2021 – 2022', entreprise: 'Anugo Canada', poste: 'UI DESIGNER & INTÉGRATEUR WEB · CANADA', description: "Conception et développement complet de sites web en freelance. Gestion de projet autonome, depuis le recueil du besoin initial jusqu'à la mise en production finale.", type: 'experience', order: 4 },
    { periode: 'FÉV. 2019 – FÉV. 2021', entreprise: 'YUX Design', poste: 'UX/UI DESIGNER & FRONT-END · SÉNÉGAL', description: "Recherche utilisateur approfondie (méthodes qualitatives/quantitatives, focus groups). Conception d'interfaces et intégration front-end via HTML/CSS, JS et Angular.", type: 'experience', order: 5 },
    { periode: 'JUIL. 2019 – PRÉSENT', entreprise: 'Missions Internationales', poste: 'UX/UI DESIGNER & FRONT-END INDÉPENDANT', description: "Accompagnement de divers clients à l'international (France, Canada, Mali, Sénégal) sur des missions de conception UX/UI et d'intégration web.", type: 'experience', order: 6 }
  ];
  
  const allFormations = [
    { periode: '2017 – 2018', entreprise: 'Sonatel Academy', poste: 'DIPLÔMÉ (1RE COHORTE) · DÉVELOPPEMENT WEB', description: "Formation intensive et certifiante en développement web et digital. Acquisition d'un socle technique solide pour aborder l'intégration complexe.", type: 'formation', order: 1 },
    { periode: 'BAC 2015', entreprise: 'Université de Dakar', poste: 'LICENCE EN SOCIOLOGIE (BAC+3)', description: "Étude des comportements humains et de la société, un atout majeur et différenciant pour la recherche utilisateur et l'empathie UX.", type: 'formation', order: 2 },
    { periode: '2018 – PRÉSENT', entreprise: 'Formation Continue', poste: 'AUTODIDACTE · VEILLE TECHNOLOGIQUE', description: "Apprentissage continu sur les nouveaux outils de design (Figma avancé), les frameworks front-end modernes et l'intégration de l'IA dans les process.", type: 'formation', order: 3 }
  ];

  await Parcours.insertMany([...allExperiences, ...allFormations]);
  console.log('Tout le parcours inséré !');
}

// Login
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
    res.json({ success: true, token: 'session_active_token_seydou' });
  } else {
    res.status(401).json({ success: false, message: 'Identifiants incorrects' });
  }
});

// Upload image vers Cloudinary
app.post('/api/upload', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'Aucun fichier téléchargé' });
  }
  try {
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'portfolio' },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(req.file.buffer);
    });
    res.json({ success: true, url: result.secure_url });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Projets
app.get('/api/projets', async (req, res) => {
  try {
    const projets = await Projet.find().sort({ order: 1 });
    res.json(projets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/projets', async (req, res) => {
  const projet = new Projet(req.body);
  try {
    const newProjet = await projet.save();
    res.status(201).json(newProjet);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.put('/api/projets/:id', async (req, res) => {
  try {
    const updatedProjet = await Projet.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
    res.json(updatedProjet);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.delete('/api/projets/:id', async (req, res) => {
  try {
    await Projet.findOneAndDelete({ id: req.params.id });
    res.json({ message: 'Projet supprimé' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Réordonner les projets
app.post('/api/projets/reorder', async (req, res) => {
  const { items } = req.body;
  try {
    for (const item of items) {
      await Projet.findOneAndUpdate({ id: item.id }, { order: item.order });
    }
    res.json({ message: 'Ordre des projets mis à jour' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Parcours
app.get('/api/parcours', async (req, res) => {
  try {
    const parcours = await Parcours.find().sort({ order: 1 });
    res.json(parcours);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/parcours', async (req, res) => {
  const parcours = new Parcours(req.body);
  try {
    const newParcours = await parcours.save();
    res.status(201).json(newParcours);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.put('/api/parcours/:id', async (req, res) => {
  try {
    const updatedParcours = await Parcours.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedParcours);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.delete('/api/parcours/:id', async (req, res) => {
  try {
    await Parcours.findByIdAndDelete(req.params.id);
    res.json({ message: 'Élément supprimé' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Réordonner le parcours
app.post('/api/parcours/reorder', async (req, res) => {
  const { items } = req.body;
  try {
    for (const item of items) {
      await Parcours.findByIdAndUpdate(item.id, { order: item.order });
    }
    res.json({ message: 'Ordre mis à jour' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// En production : renvoyer index.html pour toutes les routes React
if (isProd) {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  });
}

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT} (${isProd ? 'PRODUCTION' : 'DÉVELOPPEMENT'})`);
  });
}

// Export requis par Vercel Serverless Functions
module.exports = app;
