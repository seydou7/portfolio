// URL de base de l'API — utilise la variable d'environnement en production
// En dev : http://localhost:5000
// En prod : l'URL de votre VPS Hostinger (ex: https://api.seydoudiallo.com)
const API_URL = import.meta.env.PROD ? '' : 'http://localhost:5000';

export default API_URL;
