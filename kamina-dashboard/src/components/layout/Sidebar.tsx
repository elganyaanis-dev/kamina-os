// src/components/layout/Sidebar.tsx
import React from 'react';

interface KaminaSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function KaminaSidebar({ isOpen, onClose }: KaminaSidebarProps) {
  if (!isOpen) return null;

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.sidebar} onClick={(e) => e.stopPropagation()}>
        <div style={styles.sidebarHeader}>
          <h2 style={styles.sidebarTitle}>Navigation</h2>
          <button style={styles.closeButton} onClick={onClose}>
            ✕
          </button>
        </div>
        
        <nav style={styles.nav}>
          <a href="/" style={styles.navLink}>🏠 Dashboard</a>
          <a href="/wallet" style={styles.navLink}>💰 Wallet</a>
          <a href="/trading" style={styles.navLink}>📊 Trading</a>
          <a href="/ai" style={styles.navLink}>🤖 AI Assistant</a>
          <a href="/staking" style={styles.navLink}>🎯 Staking</a>
          <a href="/settings" style={styles.navLink}>⚙️ Settings</a>
        </nav>
        
        <div style={styles.footer}>
          <div style={styles.userInfo}>
            <div style={styles.userAvatar}>👤</div>
            <div>
              <div style={styles.userName}>User</div>
              <div style={styles.userAddress}>0x742...d35e1</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1000,
  },
  sidebar: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    width: '300px',
    height: '100%',
    backgroundColor: '#1a1a1a',
    color: 'white',
    padding: '1rem',
    display: 'flex',
    flexDirection: 'column' as const,
  },
  sidebarHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
  },
  sidebarTitle: {
    margin: 0,
    fontSize: '1.25rem',
    fontWeight: 'bold',
  },
  closeButton: {
    background: 'none',
    border: 'none',
    color: 'white',
    fontSize: '1.5rem',
    cursor: 'pointer',
  },
  nav: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.5rem',
    flex: 1,
  },
  navLink: {
    color: 'white',
    textDecoration: 'none',
    padding: '1rem',
    borderRadius: '8px',
    transition: 'background-color 0.2s',
  },
  footer: {
    marginTop: 'auto',
    paddingTop: '1rem',
    borderTop: '1px solid #333',
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  userAvatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: '#667eea',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.25rem',
  },
  userName: {
    fontWeight: 'bold',
  },
  userAddress: {
    fontSize: '0.875rem',
    color: '#999',
  },
};
