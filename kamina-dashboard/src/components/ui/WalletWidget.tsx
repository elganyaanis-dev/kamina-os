// src/components/ui/WalletWidget.tsx
import React, { useState } from 'react';

export function WalletWidget() {
  const [balance, setBalance] = useState('$29,878.55');
  const [isConnected, setIsConnected] = useState(false);

  const handleConnect = () => {
    setIsConnected(true);
    // In real app, this would connect to Web3 wallet
  };

  return (
    <div style={styles.widget}>
      <h3 style={styles.title}>Wallet</h3>
      
      {!isConnected ? (
        <div style={styles.connectSection}>
          <p style={styles.connectText}>Connect your wallet to view balances</p>
          <button style={styles.connectButton} onClick={handleConnect}>
            Connect Wallet
          </button>
        </div>
      ) : (
        <div style={styles.balanceSection}>
          <div style={styles.totalBalance}>
            <span style={styles.balanceLabel}>Total Balance</span>
            <span style={styles.balanceAmount}>{balance}</span>
            <span style={styles.balanceChange}>+3.2% today</span>
          </div>
          
          <div style={styles.assets}>
            <div style={styles.asset}>
              <span style={styles.assetName}>KMINA</span>
              <span style={styles.assetAmount}>1,250.75</span>
              <span style={styles.assetValue}>$12,507.50</span>
            </div>
            <div style={styles.asset}>
              <span style={styles.assetName}>ETH</span>
              <span style={styles.assetAmount}>4.25</span>
              <span style={styles.assetValue}>$8,245.75</span>
            </div>
            <div style={styles.asset}>
              <span style={styles.assetName}>BTC</span>
              <span style={styles.assetAmount}>0.125</span>
              <span style={styles.assetValue}>$4,125.30</span>
            </div>
          </div>
          
          <div style={styles.actions}>
            <button style={styles.actionButton}>Send</button>
            <button style={styles.actionButton}>Receive</button>
            <button style={styles.actionButton}>Swap</button>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  widget: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '1.5rem',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    height: '100%',
  },
  title: {
    margin: '0 0 1rem 0',
    fontSize: '1.25rem',
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  connectSection: {
    textAlign: 'center' as const,
    padding: '2rem 1rem',
  },
  connectText: {
    margin: '0 0 1rem 0',
    color: '#666',
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
  balanceSection: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1.5rem',
  },
  totalBalance: {
    textAlign: 'center' as const,
  },
  balanceLabel: {
    display: 'block',
    fontSize: '0.875rem',
    color: '#666',
    marginBottom: '0.5rem',
  },
  balanceAmount: {
    display: 'block',
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: '0.25rem',
  },
  balanceChange: {
    display: 'block',
    fontSize: '0.875rem',
    color: '#4CAF50',
    fontWeight: '600',
  },
  assets: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1rem',
  },
  asset: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.75rem',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
  },
  assetName: {
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  assetAmount: {
    color: '#666',
  },
  assetValue: {
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  actions: {
    display: 'flex',
    gap: '0.5rem',
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    border: '1px solid #e9ecef',
    padding: '0.75rem',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    color: '#1a1a1a',
  },
};
