// src/components/viz/ChainStats.tsx
import React from 'react';

interface ChainStatsProps {
  data: any;
}

export function ChainStats({ data }: ChainStatsProps) {
  const stats = data || {
    blockNumber: 12456789,
    gasPrice: '25.4',
    walletAddress: '0x742...d35e1',
    network: 'mainnet',
    timestamp: new Date().toISOString(),
  };

  return (
    <div style={styles.stats}>
      <h3 style={styles.title}>📊 Chain Stats</h3>
      
      <div style={styles.grid}>
        <div style={styles.statItem}>
          <div style={styles.statLabel}>Block Height</div>
          <div style={styles.statValue}>{stats.blockNumber.toLocaleString()}</div>
        </div>
        
        <div style={styles.statItem}>
          <div style={styles.statLabel}>Gas Price</div>
          <div style={styles.statValue}>{stats.gasPrice} Gwei</div>
        </div>
        
        <div style={styles.statItem}>
          <div style={styles.statLabel}>Network</div>
          <div style={styles.statValue}>{stats.network}</div>
        </div>
        
        <div style={styles.statItem}>
          <div style={styles.statLabel}>Status</div>
          <div style={styles.statValue}>
            <span style={styles.statusOnline}>●</span> Online
          </div>
        </div>
      </div>
      
      <div style={styles.performance}>
        <h4 style={styles.performanceTitle}>Performance</h4>
        <div style={styles.performanceGrid}>
          <div style={styles.performanceItem}>
            <div style={styles.performanceValue}>105K</div>
            <div style={styles.performanceLabel}>TPS</div>
          </div>
          <div style={styles.performanceItem}>
            <div style={styles.performanceValue}>1.4s</div>
            <div style={styles.performanceLabel}>Latency</div>
          </div>
          <div style={styles.performanceItem}>
            <div style={styles.performanceValue}>99.9%</div>
            <div style={styles.performanceLabel}>Uptime</div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  stats: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '1.5rem',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    height: '100%',
  },
  title: {
    margin: '0 0 1.5rem 0',
    fontSize: '1.25rem',
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem',
    marginBottom: '1.5rem',
  },
  statItem: {
    padding: '1rem',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
  },
  statLabel: {
    fontSize: '0.875rem',
    color: '#666',
    marginBottom: '0.25rem',
  },
  statValue: {
    fontSize: '1.125rem',
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  statusOnline: {
    color: '#4CAF50',
    marginRight: '0.5rem',
  },
  performance: {
    borderTop: '1px solid #e9ecef',
    paddingTop: '1.5rem',
  },
  performanceTitle: {
    margin: '0 0 1rem 0',
    fontSize: '1rem',
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  performanceGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gap: '1rem',
  },
  performanceItem: {
    textAlign: 'center' as const,
  },
  performanceValue: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#667eea',
    marginBottom: '0.25rem',
  },
  performanceLabel: {
    fontSize: '0.875rem',
    color: '#666',
  },
};
