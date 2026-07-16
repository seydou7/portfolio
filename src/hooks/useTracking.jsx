import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import API_URL from '../config/api';

export function useTracking() {
  const location = useLocation();

  useEffect(() => {
    // Éviter de tracker l'interface d'administration
    if (location.pathname.startsWith('/admin')) return;

    const trackVisit = async () => {
      try {
        const source = document.referrer;
        
        await fetch(`${API_URL}/api/visits`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            page: location.pathname,
            source: source,
          }),
        });
      } catch (err) {
        // Silencieux pour ne pas déranger l'utilisateur en cas d'erreur de tracking
        console.error('Tracking error:', err);
      }
    };

    trackVisit();
  }, [location.pathname]); // S'exécute à chaque changement de page
}
