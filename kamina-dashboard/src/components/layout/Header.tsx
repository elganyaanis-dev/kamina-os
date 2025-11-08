// src/components/layout/Header.tsx
import React from 'react';

interface KaminaHeaderProps {
  onMenuClick: () => void;
}

export function KaminaHeader({ onMenuClick }: KaminaHeaderProps) {
  return (
    <header style={styles.header}>
      <div style={styles.leftSection}>
        <button style={styles.menuButton} onClick={onMenuClick}>
          ☰
        </button>
        <div style={styles.logo}>
          <span style={styles.logoIcon}>⚡</span>
          <span style={styles.logoText}>Kamina OS</span>
        </div>
      </div>
      
      <div style={styles.rightSection}>
        <div style={styles.networkStatus}>
          <span style={styles.statusDot}></span>
          <span>Mainnet</span>
        </div>
        <button style={styles.connectButton}>
          Connect Wallet
        </button>
      </div>
    </header>
  );
}

const styles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 2rem',
    backgroundColor: '#1a1a1a',
    color: 'white',
    borderBottom: '1px solid #333',
  },
  leftSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  menuButton: {
    background: 'none',
    border: 'none',
    color: 'white',
    fontSize: '1.5rem',
    cursor: 'pointer',
    padding: '0.5rem',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  logoIcon: {
    fontSize: '1.5rem',
  },
  logoText: {
    fontSize: '1.25rem',
    fontWeight: 'bold',
  },
  rightSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  networkStatus: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.875rem',
  },
  statusDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: '#4CAF50',
  },
  connectButton: {
    backgroundColor: '#667eea',
    color: 'white',
    border: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
  },
};
