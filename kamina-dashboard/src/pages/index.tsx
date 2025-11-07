import { useState, useEffect } from 'react';
import Head from 'next/head';
import { Inter } from 'next/font/google';
import { KaminaHeader } from '@/components/layout/Header';
import { KaminaSidebar } from '@/components/layout/Sidebar';
import { ChainStats } from '@/components/viz/ChainStats';
import { WalletWidget } from '@/components/ui/WalletWidget';
import { AIPanel } from '@/components/ui/AIPanel';
import styles from '@/styles/Home.module.css';

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [chainData, setChainData] = useState(null);

  useEffect(() => {
    // Fetch initial chain data
    fetchChainStats();
  }, []);

  const fetchChainStats = async () => {
    try {
      const response = await fetch('/api/v1/kamina/stats');
      const data = await response.json();
      setChainData(data);
    } catch (error) {
      console.error('Failed to fetch chain stats:', error);
    }
  };

  return (
    <>
      <Head>
        <title>Kamina OS Dashboard</title>
        <meta name="description" content="Kamina Blockchain & AI Ecosystem" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <KaminaHeader onMenuClick={() => setIsSidebarOpen(true)} />
      <KaminaSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.grid}>
            <div className={styles.card}>
              <ChainStats data={chainData} />
            </div>
            <div className={styles.card}>
              <WalletWidget />
            </div>
            <div className={styles.card}>
              <AIPanel />
            </div>
          </div>
          
          <div className={styles.features}>
            <h2 className={styles.heading}>Kamina OS Features</h2>
            <div className={styles.featureGrid}>
              <div className={styles.featureCard}>
                <h3>⚡ High Performance</h3>
                <p>105,000 TPS with 1.4s latency</p>
              </div>
              <div className={styles.featureCard}>
                <h3>🔐 Zero-Trust Security</h3>
                <p>WebAuthn + Biometric Authentication</p>
              </div>
              <div className={styles.featureCard}>
                <h3>🤖 AI Integration</h3>
                <p>KaminaLLM-7B Assistant</p>
              </div>
              <div className={styles.featureCard}>
                <h3>💰 DeFi Protocol</h3>
                <p>Native AMM & Cross-Chain Bridge</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
