import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Eye, TrendingUp, Link as LinkIcon, Calendar } from 'lucide-react';
import API_URL from '../config/api';

export default function StatsWidget() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`${API_URL}/api/visits/stats`);
        if (!response.ok) throw new Error('Erreur lors du chargement des statistiques');
        const data = await response.json();
        setStats(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="stats-grid">
        {[1, 2, 3].map(i => (
          <motion.div 
            key={i}
            className="stat-card skeleton"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            style={{ height: '120px', backgroundColor: 'var(--color-bg-secondary)', borderRadius: '12px' }}
          />
        ))}
      </div>
    );
  }

  if (error) {
    return <div className="stats-error">Erreur: {error}</div>;
  }

  if (!stats) return null;

  return (
    <div className="stats-container">
      <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        
        {/* Vues Totales */}
        <motion.div 
          className="stat-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{ background: 'var(--color-bg-secondary)', padding: '20px', borderRadius: '12px', border: '1px solid var(--color-border)' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
            <Eye size={20} color="var(--color-primary)" />
            <h3 style={{ margin: 0, fontSize: '14px', color: 'var(--color-muted)' }}>Vues Totales</h3>
          </div>
          <p style={{ margin: 0, fontSize: '32px', fontWeight: '700', color: 'var(--color-text)' }}>
            {stats.totalVisits}
          </p>
        </motion.div>

        {/* Top Projet */}
        <motion.div 
          className="stat-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{ background: 'var(--color-bg-secondary)', padding: '20px', borderRadius: '12px', border: '1px solid var(--color-border)' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
            <TrendingUp size={20} color="var(--color-gold)" />
            <h3 style={{ margin: 0, fontSize: '14px', color: 'var(--color-muted)' }}>Page la plus vue</h3>
          </div>
          <p style={{ margin: 0, fontSize: '20px', fontWeight: '600', color: 'var(--color-text)', wordBreak: 'break-all' }}>
            {stats.topPages[0]?._id || 'N/A'}
          </p>
          <p style={{ margin: '5px 0 0 0', fontSize: '12px', color: 'var(--color-muted)' }}>
            {stats.topPages[0]?.count || 0} vues
          </p>
        </motion.div>

        {/* Top Source */}
        <motion.div 
          className="stat-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{ background: 'var(--color-bg-secondary)', padding: '20px', borderRadius: '12px', border: '1px solid var(--color-border)' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
            <LinkIcon size={20} color="#10b981" />
            <h3 style={{ margin: 0, fontSize: '14px', color: 'var(--color-muted)' }}>Top Source</h3>
          </div>
          <p style={{ margin: 0, fontSize: '20px', fontWeight: '600', color: 'var(--color-text)', wordBreak: 'break-all' }}>
            {stats.sources[0]?._id || 'Direct'}
          </p>
          <p style={{ margin: '5px 0 0 0', fontSize: '12px', color: 'var(--color-muted)' }}>
            {stats.sources[0]?.count || 0} visites
          </p>
        </motion.div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        {/* Détail des pages */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          style={{ background: 'var(--color-bg-secondary)', padding: '20px', borderRadius: '12px', border: '1px solid var(--color-border)' }}
        >
          <h3 style={{ margin: '0 0 15px 0', fontSize: '16px' }}>Top 5 Pages</h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {stats.topPages.map((page, idx) => (
              <li key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: idx < stats.topPages.length - 1 ? '1px solid var(--color-border)' : 'none' }}>
                <span style={{ color: 'var(--color-text)' }}>{page._id}</span>
                <span style={{ fontWeight: '600', color: 'var(--color-primary)' }}>{page.count}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Détail sur 7 jours */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          style={{ background: 'var(--color-bg-secondary)', padding: '20px', borderRadius: '12px', border: '1px solid var(--color-border)' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
            <Calendar size={18} color="var(--color-muted)" />
            <h3 style={{ margin: 0, fontSize: '16px' }}>7 Derniers Jours</h3>
          </div>
          {stats.visitsByDay.length > 0 ? (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {stats.visitsByDay.map((day, idx) => (
                <li key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: idx < stats.visitsByDay.length - 1 ? '1px solid var(--color-border)' : 'none' }}>
                  <span style={{ color: 'var(--color-text)' }}>{day._id}</span>
                  <span style={{ fontWeight: '600', color: 'var(--color-primary)' }}>{day.count} vues</span>
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ color: 'var(--color-muted)', fontSize: '14px' }}>Pas de données pour les 7 derniers jours.</p>
          )}
        </motion.div>
      </div>
    </div>
  );
}
