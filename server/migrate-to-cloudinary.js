/**
 * Script de migration : Upload les images locales vers Cloudinary
 * et met à jour les URLs dans MongoDB.
 * 
 * Utilisation : node server/migrate-to-cloudinary.js
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const mongoose = require('mongoose');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');

// Configuration Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Schema Projet (même que dans index.js)
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

// Dossier uploads local
const UPLOADS_DIR = path.join(__dirname, 'uploads');

async function migrate() {
  console.log('🚀 Connexion à MongoDB...');
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✅ Connecté à MongoDB Atlas\n');

  const projets = await Projet.find({ cover: /localhost:5000\/uploads/ });
  console.log(`📦 ${projets.length} projet(s) avec des images localhost trouvé(s).\n`);

  if (projets.length === 0) {
    console.log('✅ Aucune migration nécessaire. Toutes les images sont déjà à jour !');
    await mongoose.disconnect();
    return;
  }

  for (const projet of projets) {
    // Extraire le nom du fichier depuis l'URL localhost
    const filename = projet.cover.split('/uploads/')[1];
    const localPath = path.join(UPLOADS_DIR, filename);

    if (!fs.existsSync(localPath)) {
      console.log(`⚠️  Fichier local introuvable pour "${projet.nom}" : ${filename} — Ignoré.`);
      continue;
    }

    console.log(`📤 Upload de "${projet.nom}" (${filename})...`);
    try {
      const result = await cloudinary.uploader.upload(localPath, {
        folder: 'portfolio',
        public_id: path.parse(filename).name,
        overwrite: true,
      });

      await Projet.findOneAndUpdate(
        { id: projet.id },
        { cover: result.secure_url }
      );

      console.log(`   ✅ Mis à jour : ${result.secure_url}`);
    } catch (err) {
      console.error(`   ❌ Erreur pour "${projet.nom}" : ${err.message}`);
    }
  }

  console.log('\n🎉 Migration terminée !');
  await mongoose.disconnect();
}

migrate().catch(console.error);
